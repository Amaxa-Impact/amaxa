import Image from "next/image";

interface MemberCardProps {
  name: string;
  image: string;
  role: string;
}

export const PersonCard = ({ name, role, image }: MemberCardProps) => {
  return (
    <div className="flex flex-col rounded-sm border bg-white md:flex-row">
      <div className="group relative flex min-h-[400px] w-full flex-col py-10 dark:border-neutral-800 md:w-1/4 lg:border-b lg:border-l lg:border-r ">
        <div className="group pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover:opacity-100 dark:from-neutral-800"></div>
        <div className="w-full">
          <Image
            src={image}
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
      <div className="items-start justify-center py-4 pl-10">
        <h1 className="text-2xl font-bold">{name}</h1>
      </div>
    </div>
  );
};
