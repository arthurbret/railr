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
          <div className="w-full h-auto bg-localblue flex items-center justify-center py-2 fixed top-0 z-50">
            <p className="text-black text-center">
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
          <div className="h-[35px]"></div>
        </>
      )}
    </>
  );
};
