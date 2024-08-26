import Image from "next/image";

interface MemberCardProps {
  name: string;
  image: string;
  role: string;
}

export const PersonCard = ({ name, role, image }: MemberCardProps) => {
  return (
    <div className="group relative flex min-h-[400px] max-w-[350px] flex-col py-10 dark:border-neutral-800 lg:border-b lg:border-l lg:border-r">
      <div className="group pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover:opacity-100 dark:from-neutral-800"></div>
      <div className="w-full">
        <Image
          src={image}
          priority
          fill={true}
          className="w-full"
          alt="Illustration 1"
        />
      </div>

      <span
        className="absolute bottom-0 left-0 p-4 font-bold text-white"
        style={{ textShadow: "0 4px 8px rgba(0, 0, 0, 1)" }}
      >
        {name} • {role}
      </span>
    </div>
  );
};
