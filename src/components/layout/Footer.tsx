"use client";

import React from "react";
import { Combobox } from "../ui/combobox";

import { useEffect, useState } from "react";

function KeyboardAwareWrapper({ children }: { children: React.ReactNode }) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const fullHeight = window.innerHeight;
        setKeyboardHeight(fullHeight - viewportHeight);
      }
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    return () =>
      window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  return <div style={{ paddingBottom: keyboardHeight }}>{children}</div>;
}

const Footer: React.FC = () => {
  return (
    <div>
      <footer className="flex justify-between border border-neutral-200 items-center max-w-fit fixed bottom-0 inset-x-0 mx-auto transform rounded-lg m-4 z-50 backdrop-blur-[7px] gap-[15px] shadow">
        <KeyboardAwareWrapper>
          <div className="flex items-center gap-4 border-0">
            <Combobox />
          </div>
        </KeyboardAwareWrapper>
      </footer>
      <div className="h-[90px]"></div>
    </div>
  );
};

export default Footer;
