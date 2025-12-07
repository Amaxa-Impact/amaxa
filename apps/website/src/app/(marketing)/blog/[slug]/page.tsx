import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@amaxa/ui/breadcrumb";

import { LinkPreview } from "./LinkPreview";
import { TableOfContents } from "./TableOfContents";
const urlForWidth = (source: any) => urlFor(source).width(1200).url();

const createId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

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

const portableTextComponents: PortableTextComponents = {
  types: {
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
    code: ({ value }) => (
      <pre className="my-6 overflow-x-auto rounded bg-muted p-4 text-foreground">
        <code>{value.code}</code>
      </pre>
    ),
  },
  block: {
    h1: ({ children, value }) => {
      const text =
        value?.children?.map((c: any) => c.text || "").join("") || "";
      const id = createId(text);
      return (
        <h1
          id={id}
          className="mb-8 mt-12 scroll-mt-24 text-4xl font-bold leading-tight tracking-tight text-foreground first:mt-0"
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
          className="mb-6 mt-10 scroll-mt-24 text-3xl font-semibold leading-tight tracking-tight text-foreground"
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
          className="mb-5 mt-8 scroll-mt-24 text-2xl font-semibold leading-snug text-foreground"
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
          className="mb-4 mt-6 scroll-mt-24 text-xl font-semibold leading-snug text-foreground"
        >
          {children}
        </h4>
      );
    },
    normal: ({ children }) => (
      <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 rounded-r-lg border-l-4 border-primary bg-primary/5 py-6 pl-8 pr-6 text-lg italic leading-relaxed text-card-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 ml-6 space-y-3 text-lg leading-relaxed text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 ml-6 space-y-3 text-lg leading-relaxed text-muted-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="pl-2 marker:text-muted">{children}</li>
    ),
    number: ({ children }) => (
      <li className="pl-2 marker:font-semibold marker:text-muted-foreground">
        {children}
      </li>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isExternal = href.startsWith("http");

      return (
        <LinkPreview href={href} isExternal={isExternal}>
          {children}
        </LinkPreview>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-muted-foreground">{children}</em>
    ),
  },
};

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await sanityFetch<Post | null>({
    query: `*[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage,
      body,
      publishedAt,
      author->{name}
    }`,
    params: { slug },
    revalidate,
    tags: ["post"],
  });

  if (!post) notFound();

  const headings = extractHeadings(post.body);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/blog"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Back to Blogs
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground">
                {post.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-8">
          <article className="flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            {post.mainImage?.asset && (
              <div className="relative h-[300px] w-full overflow-hidden bg-muted sm:h-[400px] md:h-[450px]">
                <Image
                  src={urlForWidth(post.mainImage.asset)}
                  alt={post.mainImage.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
                />
              </div>
            )}

            <header className="border-b border-border bg-card px-6 py-8 sm:px-8 sm:py-10">
              <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
              {post.author && (
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium text-card-foreground">
                    {post.author.name}
                  </span>
                  <span className="text-border">•</span>
                  <time
                    dateTime={post.publishedAt}
                    className="text-muted-foreground"
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

            <div className="bg-card px-6 py-8 sm:px-8 sm:py-12">
              <div className="article-content">
                <PortableText
                  value={post.body}
                  components={portableTextComponents}
                />
              </div>
            </div>
          </article>

          <aside className="hidden lg:block lg:w-64">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </div>
    </div>
  );
}
