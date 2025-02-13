import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="sticky bottom-0 mt-auto w-full text-center mb-4">
      <Image
        src="/logo-railr.svg"
        alt="Railr logo"
        className="mx-auto size-full dark:filter dark:invert"
        width={0} // Next needs a width and height to render the image but tailwind will handle the size
        height={0}
      />
    </footer>
  );
};
