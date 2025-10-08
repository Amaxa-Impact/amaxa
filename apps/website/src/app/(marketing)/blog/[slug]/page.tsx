import { sanityClient } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'

type Post = {
  title: string
  body: any
  publishedAt: string
  author?: { name: string }
}

interface PageProps {
  params: { slug: string }
}

export const revalidate = 60

export default async function PostPage({ params }: PageProps) {
  const { slug } = params

  // ✅ Fetching on server only
  const post: Post = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      body,
      publishedAt,
      author->{name}
    }`,
    { slug }
  )

  if (!post) return <p>Post not found</p>

  return (
    <article>
      <h1>{post.title}</h1>
      {post.author && <p>By {post.author.name}</p>}
      <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
      <PortableText value={post.body} />
    </article>
  )
}
