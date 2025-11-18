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

/**
 * BlogSearch Component
 *
 * A searchable modal component that allows users to find and navigate to blog posts.
 * Features:
 * - Click-to-open search modal
 * - Real-time search filtering by post title
 * - Clickable results that navigate to blog posts
 * - Click outside to close functionality
 */
export function BlogSearch({ posts }: BlogSearchProps) {
  // Is the search popup open?
  const [isOpen, setIsOpen] = useState(false);

  // What the user is typing
  const [searchText, setSearchText] = useState("");

  // The search results
  const [results, setResults] = useState<SearchResult[]>([]);

  const router = useRouter();

  // Search whenever user types
  useEffect(() => {
    if (searchText.trim() === "") {
      setResults([]);
      return;
    }

    // Filter posts by title
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchText.toLowerCase()),
    );

    setResults(filtered);
  }, [searchText, posts]);

  // When user clicks a result
  function handleResultClick(slug: string) {
    router.push(`/blog/${slug}`);
    setIsOpen(false);
    setSearchText("");
  }

  // Close popup when clicking outside
  function handleBackdropClick() {
    setIsOpen(false);
    setSearchText("");
  }

  return (
    <>
      {/* Search Input */}
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex w-full items-center justify-between border-b border-[#3B3B3B]/20 py-4 transition-colors duration-200 hover:border-[#3B3B3B]/40"
        >
          <span className="text-lg text-[#3B3B3B]/50">Search for blogs...</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#3B3B3B]/40 transition-colors group-hover:text-[#3B3B3B]/60"
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

      {/* Search Popup Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-20"
          onClick={handleBackdropClick}
        >
          <div
            className={`w-full max-w-2xl overflow-hidden bg-white shadow-2xl ${
              searchText ? "rounded-3xl" : "rounded-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Inside Modal */}
            <div className="px-6 py-4">
              <div className="flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="flex-shrink-0 text-[#3B3B3B]/40"
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
                  className="flex-1 bg-transparent text-base text-[#3B3B3B] outline-none placeholder:text-[#3B3B3B]/40"
                  autoFocus
                />
              </div>
            </div>

            {/* Results */}
            {searchText && (
              <div className="max-h-[400px] overflow-y-auto rounded-b-3xl border-t border-[#3B3B3B]/10">
                {results.length === 0 ? (
                  <div className="p-8 text-center text-[#3B3B3B]/60">
                    No blogs found for "{searchText}"
                  </div>
                ) : (
                  results.map((result) => (
                    <button
                      key={result._id}
                      onClick={() => handleResultClick(result.slug.current)}
                      className="w-full border-b border-[#3B3B3B]/5 p-6 text-left transition-colors last:border-b-0 hover:bg-[#3B3B3B]/5"
                    >
                      <h3 className="mb-1 text-lg font-semibold text-[#3B3B3B]">
                        {result.title}
                      </h3>
                      <p className="text-sm text-[#3B3B3B]/60">
                        /blogs/{result.slug.current}
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
