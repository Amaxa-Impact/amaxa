import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { getCareerPostBySlug, urlFor } from "@/lib/careers";
import { PortableText } from "@portabletext/react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@amaxa/ui/button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

// --- PortableText components for rich content ---
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="my-8">
          <Image
            src={urlFor(value.asset).width(1200).url()}
            alt={value.alt || "Image"}
            width={1200}
            height={700}
            className="w-full rounded-xl object-cover shadow-md"
            unoptimized={urlFor(value.asset)
              .url()
              .includes("b47pkz22xs.ufs.sh")}
          />
        </div>
      );
    },
    code: ({ value }) => (
      <pre className="my-6 overflow-x-auto rounded bg-gray-100 p-4 text-gray-900">
        <code>{value.code}</code>
      </pre>
    ),
  },
  block: {
    h1: ({ children }) => (
      <h1 className="my-8 text-5xl font-bold text-[#3B3B3B]">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="my-6 text-4xl font-semibold text-[#3B3B3B]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="my-5 text-3xl font-semibold text-[#3B3B3B]">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="my-4 text-2xl font-semibold text-[#3B3B3B]">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="my-4 leading-8 text-gray-700">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-[#b9d66e] pl-6 text-gray-700 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      if (!value?.href) return <>{children}</>;
      const target = value.href.startsWith("http") ? "_blank" : undefined;
      return (
        <a
          href={value.href}
          target={target}
          rel={target ? "noopener noreferrer" : undefined}
          className="text-blue-600 underline transition-colors duration-200 hover:text-blue-800"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "internship":
      return "Internship";
    case "volunteer":
      return "Volunteer Opening";
    case "undergraduate-coach":
      return "Undergraduate Coach";
    default:
      return category;
  }
};

// --- Page component ---
export default async function CareerPage({ params }: PageProps) {
  const { slug } = await params;
  let career;
  try {
    career = await getCareerPostBySlug(slug);
  } catch (error) {
    console.error("Error fetching career post:", error);
    career = null;
  }

  if (!career) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-[#3B3B3B]">
            Career Post Not Found
          </h1>
          <p className="mb-8 text-gray-600">
            The career post you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/careers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-8 h-auto p-0 text-gray-600 hover:text-[#3B3B3B]"
        asChild
      >
        <Link href="/careers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Careers
        </Link>
      </Button>

      {/* Main Image */}
      {career.mainImage?.asset && (
        <div className="relative mb-12 h-[500px] w-full overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={urlFor(career.mainImage.asset).width(1200).url()}
            alt={career.mainImage.alt || career.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="100vw"
            unoptimized={urlFor(career.mainImage.asset)
              .url()
              .includes("b47pkz22xs.ufs.sh")}
          />
        </div>
      )}

      {/* Title and Meta */}
      <div className="mb-8">
        <div className="mb-4 inline-block rounded-full bg-[#b9d66e] px-4 py-2 text-sm font-medium text-[#3B3B3B]">
          {getCategoryLabel(career.category)}
        </div>
        <h1 className="mb-4 text-5xl font-bold text-[#3B3B3B]">
          {career.title}
        </h1>
        {career.description && (
          <p className="mb-6 text-xl text-gray-600">{career.description}</p>
        )}
        <p className="mb-6 text-gray-500">
          Published{" "}
          {new Date(career.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Body Content */}
      {career.body && (
        <div className="prose prose-lg max-w-none">
          <PortableText
            value={career.body}
            components={portableTextComponents}
          />
        </div>
      )}

      {/* Application Link */}
      {career.applicationLink && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <Button size="lg" asChild>
            <Link
              href={career.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
            </Link>
          </Button>
        </div>
      )}
    </article>
  );
}
