import { sanityClient } from '@/lib/sanity'
import Link from 'next/link'

type Post = {
  title: string
  slug: { current: string }
  publishedAt: string
}

// ISR: rebuild every 60s
export const revalidate = 60

export default async function BlogPage() {
  // ✅ Fetching on server only
  const posts: Post[] = await sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc){
      title,
      slug,
      publishedAt
    }`
  )

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug.current}>
            <Link href={`/blog/${post.slug.current}`}>
              {post.title} ({new Date(post.publishedAt).toLocaleDateString()})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
