import { allPosts } from "content-collections";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = allPosts.find((post) => post.slug === slug);
  if (!post) {
    return <div>Post not found</div>;
  }

  const { default: Content } = await import(
    `../../../../../content/posts/${post.slug}.mdx`
  );

  return (
    <article className="post">
      <h2>{post.title}</h2>
      <div className="content">
        <Content />
      </div>
    </article>
  );
}
