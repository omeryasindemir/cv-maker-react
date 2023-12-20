import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getTemplateDetails, getTemplates, saveToCollections } from "../api";

import { MainSpinner } from "../components";
import { FaHouse } from "react-icons/fa6";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";

const TemplateDesign = () => {
  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };

  const { templateID } = useParams();

  const { data, isError, isLoading, refetch } = useQuery(
    ["template", templateID],
    () => getTemplateDetails(templateID)
  );

  const { data: user, refetch: userRefetch } = useUser();

  if (isLoading) return <MainSpinner />;

  if (isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-txtPrimary font-semibold">
          Error while fetching the data :/
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-start flex-col px-4 py-12">
      {/* bread crump */}
      <div className="w-full flex items-center pb-8 gap-2 cursor-pointer">
        <Link
          to={"/"}
          className="flex gap-2 items-center justify-center text-txtPrimary"
        >
          <FaHouse />
          Home
        </Link>
        <p>/</p>
        <p>{data.name}</p>
      </div>

      {/* design main section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12">
        {/* left section */}
        <div className="col-span-1 lg:col-span-8 flex flex-col items-start">
          <img
            className="w-full h-full object-contain rounded-md"
            src={data.imageURL}
            alt=""
          />

          <div className="w-full flex flex-col items-start justify-start gap-2">
            <div className="w-full flex items-center justify-between">
              {/* template title */}
              <p className="text-base text-txtPrimary font-semibold p-2">
                {data?.title}
              </p>

              {/* likes */}
              {data?.favourites?.length > 0 && (
                <div className="flex items-center justify-center gap-1 p-2">
                  <BiSolidHeart className="text-base text-red-700" />
                  <p className="text-base text-txtPrimary font-semibold">
                    {data.favourites.length} likes
                  </p>
                </div>
              )}
            </div>

            {/* collection favourite options */}
            {user && (
              <div className="flex items-center justify-center gap-3 p-2">
                {user?.collection?.includes(data?._id) ? (
                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiSolidFolderPlus className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Remove From Collections
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiFolderPlus className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Save To Collections
                      </p>
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </div>

        {/* right section */}
        <div className="col-span-1 lg:col-span-4 w-full flex flex-col items-center justify-start px-3 gap-6">
          {/* discover more section */}
          <div
            className="w-full h-72 bg-blue-200 rounded-md overflow-hidden relative"
            style={{
              background:
                "url(https://imgs.search.brave.com/jUq29dzsHxYJU1dFxp9SrtT8HhJb_LAsCFgQzAwSUPk/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMS8w/OC8wNC8xMy8wNi9z/b2Z0d2FyZS1kZXZl/bG9wZXItNjUyMTcy/MF82NDAuanBn)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.31)]">
              <Link
                className="px-4 py-2 rounded-md border-2 border-gray-50 text-white"
                to={"/"}
              >
                Discover More
              </Link>
            </div>
          </div>

          {/* edit this template */}
          {user && (
            <Link className="bg-green-500 w-full rounded-md p-3 flex justify-center" to={`/cv/${data.name}?templateId=${templateID}`}>
              <p className="text-white font-semibold">Edit This Template</p>
            </Link>
          )}

          {/* tags */}
          <div className="w-full flex items-center justify-start flex-wrap gap-2">
            {data?.tags?.map((tag, index) => (
              <p className="text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap" key={index}>
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>


      
    </div>
  );
};

export default TemplateDesign;
