import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@amaxa/ui/breadcrumb";
import { Card, CardContent, CardHeader } from "@amaxa/ui/card";

import { LinkPreview } from "./LinkPreview";
import { TableOfContents } from "./TableOfContents";

const builder = imageUrlBuilder(sanityClient);
const urlFor = (source: any) => builder.image(source).width(1200).url();

// Helper function to create ID from text
const createId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

// Extract headings from PortableText body
const extractHeadings = (
  body: any[],
): { id: string; text: string; level: number }[] => {
  const headings: { id: string; text: string; level: number }[] = [];

  if (!Array.isArray(body)) return headings;

  for (const block of body) {
    if (block._type === "block" && block.style) {
      const level =
        block.style === "h2"
          ? 2
          : block.style === "h3"
            ? 3
            : block.style === "h4"
              ? 4
              : 0;
      if (level > 0 && Array.isArray(block.children)) {
        const text = block.children.map((c: any) => c.text || "").join("");
        if (text) {
          headings.push({ id: createId(text), text, level });
        }
      }
    }
  }

  return headings;
};

interface Post {
  title: string;
  mainImage?: { asset: { _ref: string }; alt?: string };
  body: any;
  publishedAt: string;
  author?: { name: string };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

/**
 * PORTABLETEXT EXPLANATION:
 *
 * Sanity CMS stores blog content as structured JSON (not HTML).
 * PortableText converts that JSON into React components.
 *
 * Think of it like this:
 * - Sanity stores: { type: "h2", children: [{ text: "My Heading" }] }
 * - PortableText renders: <h2>My Heading</h2>
 *
 * This object defines HOW each content type should be styled.
 * You customize the look by changing the className props below.
 */

// ============================================
// CUSTOM COMPONENTS FOR PORTABLETEXT
// ============================================
// These components define how each piece of content from Sanity is rendered

const portableTextComponents: PortableTextComponents = {
  types: {
    // When Sanity has an image in the content
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="my-8">
          <Image
            src={urlFor(value.asset)}
            alt={value.alt || "Image"}
            width={1200}
            height={700}
            className="w-full rounded-xl object-cover shadow-md"
          />
        </div>
      );
    },
    // When Sanity has a code block
    code: ({ value }) => (
      <pre className="my-6 overflow-x-auto rounded bg-gray-100 p-4 text-gray-900">
        <code>{value.code}</code>
      </pre>
    ),
  },

  // Text blocks (headings, paragraphs, quotes)
  block: {
    h1: ({ children, value }) => {
      const text =
        value?.children?.map((c: any) => c.text || "").join("") || "";
      const id = createId(text);
      return (
        <h1
          id={id}
          className="mb-8 mt-12 scroll-mt-24 text-4xl font-bold leading-tight tracking-tight text-neutral-900 first:mt-0"
        >
          {children}
        </h1>
      );
    },
    h2: ({ children, value }) => {
      const text =
        value?.children?.map((c: any) => c.text || "").join("") || "";
      const id = createId(text);
      return (
        <h2
          id={id}
          className="mb-6 mt-10 scroll-mt-24 text-3xl font-semibold leading-tight tracking-tight text-neutral-900"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const text =
        value?.children?.map((c: any) => c.text || "").join("") || "";
      const id = createId(text);
      return (
        <h3
          id={id}
          className="mb-5 mt-8 scroll-mt-24 text-2xl font-semibold leading-snug text-neutral-900"
        >
          {children}
        </h3>
      );
    },
    h4: ({ children, value }) => {
      const text =
        value?.children?.map((c: any) => c.text || "").join("") || "";
      const id = createId(text);
      return (
        <h4
          id={id}
          className="mb-4 mt-6 scroll-mt-24 text-xl font-semibold leading-snug text-neutral-900"
        >
          {children}
        </h4>
      );
    },
    normal: ({ children }) => (
      <p className="mb-6 text-lg leading-relaxed text-neutral-700">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 rounded-r-lg border-l-4 border-blue-500 bg-blue-50/50 py-6 pl-8 pr-6 text-lg italic leading-relaxed text-neutral-800">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 ml-6 space-y-3 text-lg leading-relaxed text-neutral-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 ml-6 space-y-3 text-lg leading-relaxed text-neutral-700">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="pl-2 marker:text-neutral-400">{children}</li>
    ),
    number: ({ children }) => (
      <li className="pl-2 marker:font-semibold marker:text-neutral-500">
        {children}
      </li>
    ),
  },

  // Text formatting (links, bold, italic)
  marks: {
    link: ({ value, children }) => {
      const isExternal = value?.href?.startsWith("http");
      return (
        <LinkPreview href={value.href} isExternal={isExternal}>
          {children}
        </LinkPreview>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-900">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-neutral-700">{children}</em>
    ),
  },
};

// --- Page component ---
export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  const post: Post = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage,
      body,
      publishedAt,
      author->{name}
    }`,
    { slug },
  );

  if (!post) return <p>Post not found.</p>;

  // Extract headings from the post body
  const headings = extractHeadings(post.body);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/blog"
                  className="text-neutral-500 transition-colors hover:text-neutral-900"
                >
                  Back to Blogs
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-neutral-900">
                {post.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Content Layout */}
        <div className="flex gap-8">
          {/* Article Content */}
          <article className="flex-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
            {/* Hero Image */}
            {post.mainImage?.asset && (
              <div className="relative h-[300px] w-full overflow-hidden bg-neutral-100 sm:h-[400px] md:h-[450px]">
                <Image
                  src={urlFor(post.mainImage.asset)}
                  alt={post.mainImage.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
                />
              </div>
            )}

            {/* Article Header */}
            <header className="border-b border-neutral-100 bg-white px-6 py-8 sm:px-8 sm:py-10">
              <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
              {post.author && (
                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                  <span className="font-medium text-neutral-700">
                    {post.author.name}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <time
                    dateTime={post.publishedAt}
                    className="text-neutral-500"
                  >
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="bg-white px-6 py-8 sm:px-8 sm:py-12">
              {/* Content wrapper - ensures consistent spacing and clean layout */}
              <div className="article-content">
                <PortableText
                  value={post.body}
                  components={portableTextComponents}
                />
              </div>
            </div>
          </article>

          {/* Table of Contents */}
          <aside className="hidden lg:block lg:w-64">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </div>
    </div>
  );
}
