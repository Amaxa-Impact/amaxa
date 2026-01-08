import { getCareerPostBySlug } from '@/lib/careers'
import { urlFor } from '@/lib/careers'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@amaxa/ui/button'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

// --- PortableText components for rich content ---
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      return (
        <div className="my-8">
          <Image
            src={urlFor(value.asset).width(1200).url()}
            alt={value.alt || 'Image'}
            width={1200}
            height={700}
            className="rounded-xl shadow-md object-cover w-full"
            unoptimized={urlFor(value.asset).url().includes("b47pkz22xs.ufs.sh")}
          />
        </div>
      )
    },
    code: ({ value }) => (
      <pre className="bg-gray-100 text-gray-900 p-4 rounded my-6 overflow-x-auto">
        <code>{value.code}</code>
      </pre>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-5xl font-bold my-8 text-[#3B3B3B]">{children}</h1>,
    h2: ({ children }) => <h2 className="text-4xl font-semibold my-6 text-[#3B3B3B]">{children}</h2>,
    h3: ({ children }) => <h3 className="text-3xl font-semibold my-5 text-[#3B3B3B]">{children}</h3>,
    h4: ({ children }) => <h4 className="text-2xl font-semibold my-4 text-[#3B3B3B]">{children}</h4>,
    normal: ({ children }) => <p className="my-4 leading-8 text-gray-700">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#b9d66e] pl-6 italic my-6 text-gray-700">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      if (!value?.href) return <>{children}</>
      const target = value.href.startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value.href}
          target={target}
          rel={target ? 'noopener noreferrer' : undefined}
          className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
        >
          {children}
        </a>
      )
    },
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'internship':
      return 'Internship'
    case 'volunteer':
      return 'Volunteer Opening'
    case 'undergraduate-coach':
      return 'Undergraduate Coach'
    default:
      return category
  }
}

// --- Page component ---
export default async function CareerPage({ params }: PageProps) {
  const { slug } = await params
  let career;
  try {
    career = await getCareerPostBySlug(slug)
  } catch (error) {
    console.error("Error fetching career post:", error)
    career = null
  }

  if (!career) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#3B3B3B]">Career Post Not Found</h1>
          <p className="text-gray-600 mb-8">The career post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/careers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <article className="max-w-5xl mx-auto px-6 py-12">
      {/* Back Button */}
      <Button variant="ghost" className="mb-8 p-0 h-auto text-gray-600 hover:text-[#3B3B3B]" asChild>
        <Link href="/careers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Careers
        </Link>
      </Button>

      {/* Main Image */}
      {career.mainImage?.asset && (
        <div className="relative w-full h-[500px] mb-12 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={urlFor(career.mainImage.asset).width(1200).url()}
            alt={career.mainImage.alt || career.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="100vw"
            unoptimized={urlFor(career.mainImage.asset).url().includes("b47pkz22xs.ufs.sh")}
          />
        </div>
      )}

      {/* Title and Meta */}
      <div className="mb-8">
        <div className="inline-block px-4 py-2 mb-4 bg-[#b9d66e] text-[#3B3B3B] rounded-full text-sm font-medium">
          {getCategoryLabel(career.category)}
        </div>
        <h1 className="text-5xl font-bold mb-4 text-[#3B3B3B]">{career.title}</h1>
        {career.description && (
          <p className="text-xl text-gray-600 mb-6">{career.description}</p>
        )}
        <p className="text-gray-500 mb-6">
          Published {new Date(career.publishedAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Body Content */}
      {career.body && (
        <div className="max-w-none prose prose-lg">
          <PortableText value={career.body} components={portableTextComponents} />
        </div>
      )}

      {/* Application Link */}
      {career.applicationLink && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Button size="lg" asChild>
            <Link href={career.applicationLink} target="_blank" rel="noopener noreferrer">
              Apply Now
            </Link>
          </Button>
        </div>
      )}
    </article>
  )
}


