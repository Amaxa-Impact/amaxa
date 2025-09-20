import Link from "next/link";
import { allPosts } from "content-collections";

export default function ServerPage() {
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.slug}>
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
