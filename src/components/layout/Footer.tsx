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
    <div className="flex items-center gap-4 border-0 max-w-fit fixed bottom-0 inset-x-0 mx-auto mb-8 shadow-xl">
      <KeyboardAwareWrapper>
        <Combobox />
      </KeyboardAwareWrapper>
    </div>
  );
};

export default Footer;
