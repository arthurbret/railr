"use client"

import React from 'react';
import { Combobox } from '../ui/combobox';

const Footer: React.FC = () => {
  return (
    <div className="flex justify-between border border-neutral-200 items-center max-w-fit p-4 shadow-lg bg-localblue/50 fixed bottom-0 inset-x-0 mx-auto transform rounded-lg m-4 z-50 backdrop-blur-[7px] gap-[15px] shadow">
      <div className="flex items-center gap-4 border-0">
        <Combobox />
      </div>
    </div>
  );
};

export default Footer;