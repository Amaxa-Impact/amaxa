import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";

import { Card, CardContent } from "@amaxa/ui/card";

import { BlogHeader } from "./BlogHeader";
import { BlogSearch } from "./BlogSearch";

export const metadata: Metadata = {
  title: "Ámaxa Blog - Youth-Led Change & Global Impact Stories",
  description:
    "Explore expert perspectives, success stories, and valuable insights on youth-led change, global issues, and projects making a real impact. Discover how young leaders are creating meaningful change worldwide.",
  keywords: [
    "youth-led change",
    "global issues",
    "projects making real impact",
    "social impact",
    "youth leadership",
    "international development",
    "community projects",
    "student initiatives",
    "global change makers",
    "youth empowerment",
  ],
  openGraph: {
    title: "Ámaxa Blog - Youth-Led Change & Global Impact",
    description:
      "Expert perspectives on youth-led change, global issues, and projects making a real impact.",
    type: "website",
  },
};

const builder = imageUrlBuilder(sanityClient);
const urlFor = (source: any) => builder.image(source);

interface PostPreview {
  _id: string;
  title: string;
  slug: { current: string };
  body: any;
  mainImage?: { asset: { _ref: string } };
  publishedAt: string;
  author?: { name: string };
  featured?: boolean;
}

// Extract plain text from Portable Text blocks (avoids nested <a> tags)
function extractPlainText(body: any, maxLength = 200): string {
  if (!body || !Array.isArray(body)) return "";

  const text = body
    .filter((block: any) => block._type === "block")
    .map((block: any) =>
      block.children
        ?.filter((child: any) => child._type === "span")
        .map((span: any) => span.text)
        .join("") || ""
    )
    .join(" ")
    .trim();

  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export default async function BlogPage() {
  // Fetch posts, featured first
  const posts: PostPreview[] = await sanityClient.fetch(
    `*[_type == "post"] | order(featured desc, publishedAt desc){
      _id,
      title,
      slug,
      mainImage,
      body,
      publishedAt,
      author->{name},
      featured
    }`,
  );

  // Separate featured post from the rest
  const featuredPost = posts.find((post) => post.featured);
  const otherPosts = posts.filter((post) => post._id !== featuredPost?._id);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-16 md:py-24 lg:px-20">
        {/* Page Header */}
        <BlogHeader />

        {/* Featured Post */}
        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug.current}`}
            className="group mb-12 block"
          >
            <Card className="flex flex-col overflow-hidden rounded-2xl border-[#3B3B3B]/10 bg-white transition-shadow duration-300 hover:shadow-lg md:flex-row">
              {featuredPost.mainImage?.asset && (
                <div className="relative h-64 w-full overflow-hidden md:h-96 md:w-1/2">
                  <Image
                    src={urlFor(featuredPost.mainImage.asset).width(1200).url()}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="flex flex-col justify-center p-8 md:w-1/2 md:p-10">
                <h2 className="mb-4 text-3xl font-semibold text-[#3B3B3B] transition-colors duration-300 group-hover:text-[#3B3B3B]/80 md:text-4xl">
                  {featuredPost.title}
                </h2>
                {featuredPost.author && (
                  <p className="mb-4 text-sm text-[#3B3B3B]/60">
                    By {featuredPost.author.name} •{" "}
                    {new Date(featuredPost.publishedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                )}
                <p className="line-clamp-4 text-[#3B3B3B]/80">
                  {extractPlainText(featuredPost.body, 300)}
                </p>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Search Bar */}
        <div className="mb-12">
          <BlogSearch posts={posts} />
        </div>

        {/* Other Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {otherPosts.map((post) => (
            <Link
              key={post.slug.current}
              href={`/blog/${post.slug.current}`}
              className="group block"
            >
              <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-[#3B3B3B]/10 bg-white transition-shadow duration-300 hover:shadow-lg">
                {post.mainImage?.asset ? (
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={urlFor(post.mainImage.asset).width(800).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="relative flex h-64 w-full items-center justify-center bg-gradient-to-br from-[#F5F2F2] to-white">
                    <Image
                      src="/icon.png"
                      alt="Ámaxa logo"
                      width={150}
                      height={50}
                      className="opacity-40"
                    />
                  </div>
                )}
                <CardContent className="flex flex-1 flex-col p-8">
                  <h2 className="mb-3 text-2xl font-semibold leading-tight text-[#3B3B3B] transition-colors duration-300 group-hover:text-[#3B3B3B]/80">
                    {post.title}
                  </h2>
                  {post.author && (
                    <p className="mb-3 text-sm text-[#3B3B3B]/60">
                      By {post.author.name} •{" "}
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  <p className="mb-4 line-clamp-3 flex-1 text-sm text-[#3B3B3B]/70">
                    {extractPlainText(post.body, 150)}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#3B3B3B]">
                      Read more
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path
                          d="M6 3L11 8L6 13"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
