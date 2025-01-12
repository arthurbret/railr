"use client"

import Image from 'next/image';
import React from 'react';

const Header: React.FC = () => {
  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-localblue/50 fixed rounded-lg m-4 z-50 backdrop-blur-[7px] gap-[15px] shadow-lg">
        <Image src="/logo_traintracker.jpg" alt="Logo" width={40} height={40} className='rounded' />
        <h1 className="text-xl font-bold">TrainTracker</h1>
        <div className="flex items-center gap-4"></div>
      </header>
      <div className="h-[90px]"></div>
    </div>
  );
};

export default Header;