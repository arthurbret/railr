"use client";

import Image from "next/image";
import React from "react";

const Header: React.FC = () => {
  return (
    <div>
      <header
        onClick={() => (window.location.href = "/dashboard")}
        className="flex justify-between items-center p-4 bg-localblue/50 fixed rounded-lg m-4 z-50 backdrop-blur-[7px] gap-[15px] shadow-lg cursor-pointer"
      >
        <Image
          src="/logo-railr.svg"
          alt="Railr logo"
          className="mx-auto size-full dark:filter dark:invert"
          width={160}
          height={40}
        />
        <div className="flex items-center gap-4"></div>
      </header>
      <div className="h-[90px]"></div>
    </div>
  );
};

export default Header;
