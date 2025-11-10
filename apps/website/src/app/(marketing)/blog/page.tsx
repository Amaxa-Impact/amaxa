import Link from 'next/link'
import Image from 'next/image'
import { sanityClient } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import type { Metadata } from 'next'
import { BlogHeader } from './BlogHeader'
import { BlogSearch } from './BlogSearch'

export const metadata: Metadata = {
  title: 'Ámaxa Blog - Youth-Led Change & Global Impact Stories',
  description: 'Explore expert perspectives, success stories, and valuable insights on youth-led change, global issues, and projects making a real impact. Discover how young leaders are creating meaningful change worldwide.',
  keywords: [
    'youth-led change',
    'global issues',
    'projects making real impact',
    'social impact',
    'youth leadership',
    'international development',
    'community projects',
    'student initiatives',
    'global change makers',
    'youth empowerment'
  ],
  openGraph: {
    title: 'Ámaxa Blog - Youth-Led Change & Global Impact',
    description: 'Expert perspectives on youth-led change, global issues, and projects making a real impact.',
    type: 'website',
  },
}

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
    normal: ({ children }) => <p className="text-[#3B3B3B]/70">{children}</p>,
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20 py-16 md:py-24">
        {/* Page Header */}
        <BlogHeader />

        {/* Featured Post */}
        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug.current}`}
            className="group mb-12 block"
          >
            <div className="flex flex-col md:flex-row bg-white border border-[#3B3B3B]/10 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              {featuredPost.mainImage?.asset && (
                <div className="relative w-full md:w-1/2 h-64 md:h-96 overflow-hidden">
                  <Image
                    src={urlFor(featuredPost.mainImage.asset).width(1200).url()}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-8 md:p-10 md:w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-[#3B3B3B] transition-colors duration-300 group-hover:text-[#3B3B3B]/80">
                  {featuredPost.title}
                </h2>
                {featuredPost.author && (
                  <p className="text-[#3B3B3B]/60 text-sm mb-4">
                    By {featuredPost.author.name} •{' '}
                    {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
                <div className="text-[#3B3B3B]/80 line-clamp-4">
                  <PortableText value={featuredPost.body.slice(0, 2)} components={portableTextComponents} />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Search Bar */}
        <div className="mb-12">
          <BlogSearch posts={posts} />
        </div>

        {/* Other Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {otherPosts.map((post) => (
            <Link key={post.slug.current} href={`/blog/${post.slug.current}`} className="group block">
              <div className="bg-white border border-[#3B3B3B]/10 rounded-2xl overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-lg">
                {post.mainImage?.asset ? (
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={urlFor(post.mainImage.asset).width(800).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-64 bg-gradient-to-br from-[#F5F2F2] to-white flex items-center justify-center">
                    <Image
                      src="/icon.png"
                      alt="Ámaxa logo"
                      width={150}
                      height={50}
                      className="opacity-40"
                    />
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <h2 className="text-2xl font-semibold mb-3 text-[#3B3B3B] leading-tight transition-colors duration-300 group-hover:text-[#3B3B3B]/80">
                    {post.title}
                  </h2>
                  {post.author && (
                    <p className="text-[#3B3B3B]/60 text-sm mb-3">
                      By {post.author.name} •{' '}
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                  <div className="text-[#3B3B3B]/70 text-sm mb-4 line-clamp-3 flex-1">
                    <PortableText value={post.body.slice(0, 2)} components={portableTextComponents} />
                  </div>
                  <div className="mt-auto">
                    <span className="text-[#3B3B3B] text-sm font-medium inline-flex items-center gap-2">
                      Read more
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
