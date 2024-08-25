import Link from "next/link";
import BlurImage from "@/lib/blog/blur-image";
import { timeAgo } from "@/lib/utils";

export default function Author({
  username,
  updatedAt,
  imageOnly,
}: {
  username: string | any;
  updatedAt?: string;
  imageOnly?: boolean;
}) {
  const authors = {
    Heather: {
      name: "Heather",
      image:
        "https://ca.slack-edge.com/T01J5TA3F41-U06CMECNNPR-970d37375682-512",
    },
  };

  type Author = keyof typeof authors;
  const authorUser = username as Author;

  if (!authors[authorUser]) {
    console.error(`Author not found: ${username}`);
    return null;
  }

  return imageOnly ? (
    <BlurImage
      src={authors[authorUser].image}
      alt={authors[authorUser].name}
      width={36}
      height={36}
      className="rounded-full transition-all group-hover:brightness-90"
    />
  ) : updatedAt ? (
    <div className="flex items-center space-x-3">
      <BlurImage
        src={authors[authorUser].image}
        alt={authors[authorUser].name}
        width={36}
        height={36}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <p className="text-sm text-gray-500">
          Written by {authors[authorUser].name}
        </p>
        <time dateTime={updatedAt} className="text-sm font-light text-gray-400">
          published {timeAgo(new Date(updatedAt))}
        </time>
      </div>
    </div>
  ) : (
    <Link
      href={``}
      className="group flex items-center space-x-3"
      target="_blank"
      rel=""
    >
      <BlurImage
        src={authors[authorUser].image}
        alt={authors[authorUser].name}
        width={40}
        height={40}
        className="rounded-full transition-all group-hover:brightness-90"
      />
      <div className="flex flex-col">
        <p className="font-semibold text-gray-700">
          {authors[authorUser].name}
        </p>
        <p className="text-sm text-gray-500">@{username}</p>
      </div>
    </Link>
  );
}
