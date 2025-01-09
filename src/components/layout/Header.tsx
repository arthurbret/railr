"use client"

import Image from 'next/image';
import React from 'react';
import { ComboboxDemo } from '../ui/combobox';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white/50 fixed rounded-lg m-4 z-50 backdrop-blur-[7px] gap-[15px] shadow">
      <Image src="/logo_traintracker.jpg" alt="Logo" width={40} height={40} className='rounded' />
      <h1 className="text-xl font-bold">TrainTracker</h1>
      <div className="flex items-center gap-4"></div>
      <div className="flex items-center gap-4">
        <ComboboxDemo />
      </div>
    </header>
  );
};

export default Header;