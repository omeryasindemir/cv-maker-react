import React, { useState } from "react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";

import {
  BiFolder,
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import { saveToCollections, saveToFavourites } from "../api";
import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";

const TemplateDesignPim = ({ data, index }) => {
  const { data: user, refetch: userRefetch } = useUser();
  const { refetch: temp_refetch } = useTemplates();

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    temp_refetch();
  };

  const [isHoverred, setisHoverred] = useState(false);

  const navigate = useNavigate()

  const handleRouteNavigation = () => {
    navigate(`/cvDetail/${data?._id}` , {replace: true})
  }

  

  return (
    <motion.div
      key={data?._id}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ delay: index * 0.3, ease: easeInOut }}
      onMouseEnter={() => setisHoverred(true)}
      onMouseLeave={() => setisHoverred(false)}
    >
      <div className="w-full h-[500px] 2xl:h-[740px] rounded-md bg-gray-200 overflow-hidden relative">
        <img
          className="h-full w-full object-cover"
          src={data.imageURL}
          alt=""
        />

        <AnimatePresence>
          {isHoverred && (
            <motion.div
            onClick={handleRouteNavigation}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer"
            >
              <div className="flex flex-col items-end justify-start w-full gap-8">
                <InnerBoxCard
                  label={
                    user?.collection?.includes(data?._id)
                      ? "Saved To Collections"
                      : "Add To Collections"
                  }
                  Icon={
                    user?.collection?.includes(data?._id)
                      ? BiSolidFolderPlus
                      : BiFolderPlus
                  }
                  onHandle={addToCollection}
                />

                <InnerBoxCard
                  label={
                    data?.favourites?.includes(user?.uid)
                      ? "Saved To Favourites"
                      : "Add To Favourites"
                  }
                  Icon={
                    data?.favourites?.includes(user?.uid)
                      ? BiSolidHeart
                      : BiHeart
                  }
                  onHandle={addToFavourites}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxCard = ({ label, Icon, onHandle }) => {
  const [isHoverred, setisHoverred] = useState(false);

  return (
    <div
      onMouseEnter={() => setisHoverred(true)}
      onMouseLeave={() => setisHoverred(false)}
      onClick={onHandle}
      className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative"
    >
      <Icon className="text-txtPrimary text-base" />

      <AnimatePresence>
        {isHoverred && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 50 }}
            className="px-3 py-2 rounded-md bg-gray-200 absolute -left-44 after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-3 after:rounded-2xl"
          >
            <p className="text-sm text-txtPrimary whitespace-nowrap">{label}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesignPim;
