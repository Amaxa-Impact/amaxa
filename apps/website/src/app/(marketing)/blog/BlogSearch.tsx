"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  _id: string;
  title: string;
  slug: { current: string };
}

interface BlogSearchProps {
  posts: SearchResult[];
}

export function BlogSearch({ posts }: BlogSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  // Derive results from searchText using useMemo instead of useEffect
  const results = useMemo(() => {
    if (searchText.trim() === "") {
      return [];
    }
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, posts]);

  function handleResultClick(slug: string) {
    router.push(`/blog/${slug}`);
    setIsOpen(false);
    setSearchText("");
  }

  function handleBackdropClick() {
    setIsOpen(false);
    setSearchText("");
  }

  return (
    <>
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => setIsOpen(true)}
          className="group border-border hover:border-foreground/40 flex w-full items-center justify-between border-b py-4 transition-colors duration-200"
        >
          <span className="text-muted-foreground text-lg">
            Search for blogs...
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-muted-foreground group-hover:text-foreground transition-colors"
          >
            <circle
              cx="10"
              cy="10"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M15 15L21 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-20"
          onClick={handleBackdropClick}
        >
          <div
            className={`bg-card w-full max-w-2xl overflow-hidden shadow-2xl ${
              searchText ? "rounded-3xl" : "rounded-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4">
              <div className="flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="text-muted-foreground flex-shrink-0"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12.5 12.5L17 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-base outline-none"
                  autoFocus
                />
              </div>
            </div>

            {searchText && (
              <div className="border-border max-h-[400px] overflow-y-auto rounded-b-3xl border-t">
                {results.length === 0 ? (
                  <div className="text-muted-foreground p-8 text-center">
                    No blogs found for "{searchText}"
                  </div>
                ) : (
                  results.map((result) => (
                    <button
                      key={result._id}
                      onClick={() => handleResultClick(result.slug.current)}
                      className="border-border/50 hover:bg-muted w-full border-b p-6 text-left transition-colors last:border-b-0"
                    >
                      <h3 className="text-foreground mb-1 text-lg font-semibold">
                        {result.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        /blog/{result.slug.current}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
