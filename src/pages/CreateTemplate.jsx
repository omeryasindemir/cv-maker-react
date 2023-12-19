import React, { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { ClockLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../config/firebase.config";
import { adminID, initialTags } from "../utils/helpers";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";

import useUser from "../hooks/useUser";

const CreateTemplate = () => {
  const [formData, setformData] = useState({
    title: "",
    imageURL: null,
  });

  const [imageAsset, setimageAsset] = useState({
    isImageLoading: false,
    uri: null,
    process: 0,
  });

  const [selectedTags, setselectedTags] = useState([]);

  const {
    data: templates,
    isLoading: templatesIsLoading,
    isError: templatesIsError,
    refetch: templatesRefetch,
  } = useTemplates();

  const {data : user, isLoading} = useUser()

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData((prevRec) => ({ ...prevRec, [name]: value }));
  };

  const handleFileSelect = async (e) => {
    setimageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapShot) => {
          setimageAsset((prevAsset) => ({
            ...prevAsset,
            process: (snapShot.bytesTransferred / snapShot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) {
            toast.error(`Error : Authorization Revoked`);
          } else {
            toast.error(`Error : ${error.message}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setimageAsset((prevAsset) => ({
              ...prevAsset,
              uri: downloadURL,
            }));
          });

          toast.success("Image Upload Success!");
          setInterval(() => {
            setimageAsset((prevAsset) => ({
              ...prevAsset,
              isImageLoading: false,
            }));
          }, 2000);
        }
      );
    } else {
      toast.info("Invalid File Format!");
    }
  };

  // action to delete
  const deleteAnImageObject = async () => {
    setInterval(() => {
      setimageAsset((prevAsset) => ({
        ...prevAsset,
        process: 0,
        uri: null,
      }));
    }, 2000);

    const deleteRef = ref(storage, imageAsset.uri);
    deleteObject(deleteRef).then(() => {
      toast.success("Image Delete Success!");
    });
  };



  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const handleSelectTags = (tag) => {
    if (selectedTags.includes(tag)) {
      setselectedTags(selectedTags.filter((selected) => selected !== tag));
    } else {
      setselectedTags([...selectedTags, tag]);
    }
  };

  const pushToCloud = async () => {
    const timestamp = serverTimestamp();
    const id = `${Date.now()}`;

    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.uri,
      tags: selectedTags,
      name:
        templates && templates.length > 0
          ? `Templates${templates.length + 1}`
          : "Template1",
      timestamp: timestamp,
    };

    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setformData((prevData) => ({ ...prevData, title: "", imageURL: "" }));
        setimageAsset((prevData) => ({ ...prevData, uri: null }));
        setselectedTags([]);
        templatesRefetch();
        toast.success("Template Upload Success!");
      })
      .catch((error) => {
        toast.error(`Error : ${error.message}`);
      });
  };

  const removeTemplate = async (template) => {
    const deleteRef = ref(storage, template.imageURL)
    await deleteObject(deleteRef).then( async() => {
      await deleteDoc(doc(db, "templates", template._id)).then(() => {
        toast.success("Template Deleted Success!")
        templatesRefetch()
      })
      .catch((err) => {
        toast.error(`Error : ${err.message}`)
      })
    })
  }

  useEffect(() => {
    if (!isLoading && !adminID.includes(user.uid)) {
      navigate("/", {replace : true})
    }
  },[user, isLoading])

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* left container */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2">
        <div className="w-full">
          <p className="text-lg text-txtPrimary">Create a new Template</p>
        </div>

        <div className="w-full flex items-center justify-end">
          <p className="text-base text-txtLight uppercase font-semibold">
            Temp-ID :{" "}
          </p>

          <p className="text-sm text-txtDark font-bold capitalize">
            {templates && templates.length > 0
              ? `Templates${templates.length + 1}`
              : "Template1"}
          </p>
        </div>

        {/* template title section */}

        <input
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none"
          type="text"
          name="title"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleInputChange}
        />

        {/* file uploader section */}
        <div className="w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div className="flex flex-col items-center justify-center gap-4">
                <ClockLoader color="#498FCD" size={40} />
                <p>{imageAsset.process.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset.uri ? (
                <React.Fragment>
                  <label className="w-full cursor-pointer h-full">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex items-center justify-center cursor-pointer flex-col gap-4">
                        <FaUpload className="text-2xl" />
                        <p className="text-lg text-txtLight">CLICK to Upload</p>
                      </div>
                    </div>

                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg, .jpg, .png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset.uri}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      alt=""
                    />

                    {/* delete action */}
                    <div
                      onClick={deleteAnImageObject}
                      className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center cursor-pointer bg-red-700"
                    >
                      <FaTrash className="text-sm text-white" />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>

        {/* tags */}
        <div className="w-full flex items-center flex-wrap gap-2">
          {initialTags.map((tag, i) => (
            <div
              key={i}
              className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${
                selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleSelectTags(tag)}
            >
              <p className="text-xs">{tag}</p>
            </div>
          ))}
        </div>

        {/* button action */}
        <button
          type="button"
          className="bg-blue-700 text-white rounded-md py-3 w-full"
          onClick={pushToCloud}
        >
          Save
        </button>
      </div>

      {/* right container */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1 py-4">
        {templatesIsLoading ? (
          <React.Fragment>
            <div className="w-full h-full flex items-center justify-center">
              <ClockLoader color="#498FCD" size={40} />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {templates && templates.length > 0 ? (
              <React.Fragment>
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                  {templates.map((template) => (
                    <div
                      className="w-full h-[500px] rounded-md overflow-hidden relative"
                      key={template._id}
                    >
                      <img
                        src={template.imageURL}
                        alt=""
                        className="w-full h-full object-cover"
                      />

                      
                    {/* delete action */}
                    <div
                      onClick={() => removeTemplate(template)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center cursor-pointer bg-red-700"
                    >
                      <FaTrash className="text-sm text-white" />
                    </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
                  <ClockLoader color="#498FCD" size={40} />
                  <p className="text-xl tracking-wider capitalize">
                    There is no Template :/
                  </p>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default CreateTemplate;
