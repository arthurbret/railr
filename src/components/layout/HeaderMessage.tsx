"use client";

import { getHeaderMessage, HeaderMessageType } from "@/lib/firebaseRequests";
import { useEffect, useState } from "react";

export const HeaderMessage = () => {
  const [message, setMessage] = useState<string>("");
  const [link, setLink] = useState<string | undefined>(undefined);
  useEffect(() => {
    getHeaderMessage().then((data: HeaderMessageType | null) => {
      if (data !== null) {
        setMessage(data.message);
        if (data.link) {
          setLink(data.link);
        }
      }
    });
  });

  return (
    <>
      {message && (
        <>
          <div className="w-full bg-localblue fixed top-0 z-50 shadow-md">
            <div className="max-w-6xl mx-auto flex items-center justify-center gap-6 py-3">
              <p className="text-white font-semibold flex items-center gap-2">
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {message}
                  </a>
                ) : (
                  message
                )}
              </p>
            </div>
          </div>
          <div className="h-[48px]"></div>
        </>
      )}
    </>
  );
};
