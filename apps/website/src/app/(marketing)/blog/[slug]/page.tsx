import { sanityClient } from '@/lib/sanity'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(sanityClient)
const urlFor = (source: any) => builder.image(source).width(1200).url()

type Post = {
  title: string
  mainImage?: { asset: { _ref: string }; alt?: string }
  body: any
  publishedAt: string
  author?: { name: string }
}

interface PageProps {
  params: { slug: string }
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
            src={urlFor(value.asset)}
            alt={value.alt || 'Image'}
            width={1200}
            height={700}
            className="rounded-xl shadow-md object-cover w-full"
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
    h1: ({ children }) => <h1 className="text-5xl font-bold my-8">{children}</h1>,
    h2: ({ children }) => <h2 className="text-4xl font-semibold my-6">{children}</h2>,
    h3: ({ children }) => <h3 className="text-3xl font-semibold my-5">{children}</h3>,
    h4: ({ children }) => <h4 className="text-2xl font-semibold my-4">{children}</h4>,
    normal: ({ children }) => <p className="my-4 leading-8 text-gray-700">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-6 italic my-6 text-gray-700">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const target = value?.href?.startsWith('http') ? '_blank' : undefined
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

// --- Page component ---
export default async function PostPage({ params }: PageProps) {
  const post: Post = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage,
      body,
      publishedAt,
      author->{name}
    }`,
    { slug: params.slug }
  )

  if (!post) return <p>Post not found.</p>

  return (
    <article className="max-w-5xl mx-auto px-6 py-12">
      {post.mainImage?.asset && (
        <div className="relative w-full h-[500px] mb-12 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={urlFor(post.mainImage.asset)}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}

      <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
      {post.author && (
        <p className="text-gray-500 mb-6">
          By {post.author.name} •{' '}
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      )}

      <div className="max-w-none">
        <PortableText value={post.body} components={portableTextComponents} />
      </div>
    </article>
  )
}
