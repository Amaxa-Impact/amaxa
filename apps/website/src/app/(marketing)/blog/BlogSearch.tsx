'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  _id: string
  title: string
  slug: { current: string }
}

interface BlogSearchProps {
  posts: SearchResult[]
}

export function BlogSearch({ posts }: BlogSearchProps) {
  // Is the search popup open?
  const [isOpen, setIsOpen] = useState(false)

  // What the user is typing
  const [searchText, setSearchText] = useState('')

  // The search results
  const [results, setResults] = useState<SearchResult[]>([])

  const router = useRouter()

  // Search whenever user types
  useEffect(() => {
    if (searchText.trim() === '') {
      setResults([])
      return
    }

    // Filter posts by title
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchText.toLowerCase())
    )

    setResults(filtered)
  }, [searchText, posts])

  // When user clicks a result
  function handleResultClick(slug: string) {
    router.push(`/blog/${slug}`)
    setIsOpen(false)
    setSearchText('')
  }

  // Close popup when clicking outside
  function handleBackdropClick() {
    setIsOpen(false)
    setSearchText('')
  }

  return (
    <>
      {/* Search Input */}
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 border-b border-[#3B3B3B]/20 hover:border-[#3B3B3B]/40 transition-colors duration-200 flex items-center justify-between group"
        >
          <span className="text-[#3B3B3B]/50 text-lg">Search for blogs...</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#3B3B3B]/40 group-hover:text-[#3B3B3B]/60 transition-colors"
          >
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M15 15L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Search Popup Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[600px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Inside Modal */}
            <div className="p-6 border-b border-[#3B3B3B]/10">
              <div className="flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="text-[#3B3B3B]/40"
                >
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
                  <path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for blogs..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="flex-1 outline-none text-lg text-[#3B3B3B] placeholder:text-[#3B3B3B]/40"
                  autoFocus
                />
                <button
                  onClick={handleBackdropClick}
                  className="p-2 hover:bg-[#3B3B3B]/5 rounded-full transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="overflow-y-auto max-h-[480px]">
              {searchText && results.length === 0 && (
                <div className="p-8 text-center text-[#3B3B3B]/60">
                  No blogs found for "{searchText}"
                </div>
              )}

           

              {results.map((result) => (
                <button
                  key={result._id}
                  onClick={() => handleResultClick(result.slug.current)}
                  className="w-full p-6 text-left hover:bg-[#3B3B3B]/5 transition-colors border-b border-[#3B3B3B]/5 last:border-b-0"
                >
                  <h3 className="text-lg font-semibold text-[#3B3B3B] mb-1">
                    {result.title}
                  </h3>
                  <p className="text-sm text-[#3B3B3B]/60">
                    /blogs/{result.slug.current}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
