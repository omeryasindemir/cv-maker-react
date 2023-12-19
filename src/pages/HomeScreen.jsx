import React, { Suspense } from "react";
import { Header, MainSpinner } from "../components";
import { Routes, Route } from "react-router-dom";
import { HomeContainer } from "../containers";
import { CreateCV, CreateTemplate, TemplateDesign, UserProfile } from "../pages";

const HomeScreen = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Header />
      <main className="w-full">
        <Suspense fallback={<MainSpinner />}>
          <Routes>
            <Route path="/" element={<HomeContainer />} />
            <Route path="/template/create" element={<CreateTemplate/>} />
            <Route path="/profile/:uid" element={<UserProfile/>} />
            <Route path="/cv/*" element={<CreateCV/>} />
            <Route path="/cvDetail/:templateID" element={<TemplateDesign/>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default HomeScreen;
