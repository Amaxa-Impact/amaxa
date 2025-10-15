import Link from 'next/link'
import Image from 'next/image'
import { sanityClient } from '@/lib/sanity'
import type { PortableTextComponents } from '@portabletext/react'
import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(sanityClient)
const urlFor = (source: any) => builder.image(source)

type PostPreview = {
  _id: string
  title: string
  slug: { current: string }
  body: any
  mainImage?: { asset: { _ref: string } }
  publishedAt: string
  author?: { name: string }
  featured?: boolean
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-gray-700">{children}</p>,
  },
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
    }`
  )

  // Separate featured post from the rest
  const featuredPost = posts.find((post) => post.featured)
  const otherPosts = posts.filter((post) => post._id !== featuredPost?._id)

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Ámaxa Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore articles on youth-led change, global issues, and projects making a real impact.
        </p>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <Link
          href={`/blog/${featuredPost.slug.current}`}
          className="group mb-16 block overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row bg-white">
            {featuredPost.mainImage?.asset && (
              <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                <Image
                  src={urlFor(featuredPost.mainImage.asset).width(1200).url()}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {featuredPost.title}
              </h2>
              {featuredPost.author && (
                <p className="text-gray-500 text-sm mb-4">
                  By {featuredPost.author.name} •{' '}
                  {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}
              <div className="text-gray-700 text-lg line-clamp-4">
                <PortableText value={featuredPost.body.slice(0, 2)} components={portableTextComponents} />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Other Posts Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {otherPosts.map((post) => (
          <Link key={post.slug.current} href={`/blog/${post.slug.current}`} className="group">
            <div className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
              {post.mainImage?.asset && (
                <div className="relative w-full h-48 md:h-56 lg:h-64">
                  <Image
                    src={urlFor(post.mainImage.asset).width(800).url()}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {post.title}
                </h2>
                {post.author && (
                  <p className="text-gray-500 text-sm mb-2">
                    By {post.author.name} •{' '}
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
                <div className="text-gray-700 text-sm line-clamp-3">
                  <PortableText value={post.body.slice(0, 1)} components={portableTextComponents} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
