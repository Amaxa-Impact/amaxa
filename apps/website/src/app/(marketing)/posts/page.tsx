import { allPosts } from "@/.content-collections/generated";
import { MDXContent } from "@content-collections/mdx/react";

export default function ServerPage() {
  return (
    <>
      <h1>Posts (RSC)</h1>
      {allPosts.map((post) => (
        <article key={post._meta.path}>
          <h2>{post.title}</h2>
          <MDXContent code={post.content} />
        </article>
      ))}
    </>
  );
}
