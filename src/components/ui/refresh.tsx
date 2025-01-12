"use client";

import { motion, useAnimation } from "motion/react";

const RefreshIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className="cursor-pointer select-none p-2 hover:bg-neutral-100 rounded-md transition-colors duration-200 flex items-center justify-center dark:hover:bg-neutral-800"
      onMouseEnter={() => controls.start("hover")}
      onMouseLeave={() => controls.start("normal")}
      onMouseDown={() => controls.start("click")}
      onMouseUp={() => controls.start("hover")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`stroke-gray-500 stroke-[2px]`}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        variants={{
          normal: {
            rotate: "0deg",
          },
          hover: {
            rotate: "10deg",
          },
          click: {
            rotate: "60deg",
          }
        }}
        animate={controls}
      >
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </motion.svg>
    </div>
  );
};

export { RefreshIcon };
