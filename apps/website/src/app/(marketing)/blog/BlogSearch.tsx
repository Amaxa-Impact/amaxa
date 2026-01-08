"use client";

import { useEffect, useState } from "react";
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
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (searchText.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchText.toLowerCase()),
    );

    setResults(filtered);
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
          className="group flex w-full items-center justify-between border-b border-border py-4 transition-colors duration-200 hover:border-foreground/40"
        >
          <span className="text-lg text-muted-foreground">
            Search for blogs...
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-muted-foreground transition-colors group-hover:text-foreground"
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
            className={`w-full max-w-2xl overflow-hidden bg-card shadow-2xl ${
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
                  className="flex-shrink-0 text-muted-foreground"
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
                  className="flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>
            </div>

            {searchText && (
              <div className="max-h-[400px] overflow-y-auto rounded-b-3xl border-t border-border">
                {results.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No blogs found for "{searchText}"
                  </div>
                ) : (
                  results.map((result) => (
                    <button
                      key={result._id}
                      onClick={() => handleResultClick(result.slug.current)}
                      className="w-full border-b border-border/50 p-6 text-left transition-colors last:border-b-0 hover:bg-muted"
                    >
                      <h3 className="mb-1 text-lg font-semibold text-foreground">
                        {result.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
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
