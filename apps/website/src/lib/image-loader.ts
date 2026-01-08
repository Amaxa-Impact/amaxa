/**
 * Custom image loader for Next.js Image component
 * Bypasses optimization for ufs.sh URLs to prevent timeout errors
 * For other URLs, uses default Next.js optimization
 */
export default function customImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Handle relative paths (already optimized or local images)
  if (src.startsWith('/')) {
    return src;
  }

  // If the image is from ufs.sh, return it unoptimized to prevent timeout errors
  // This bypasses Next.js Image Optimization API which is timing out when fetching from ufs.sh
  // We still need to include width parameter to satisfy Next.js requirements
  if (src.includes('ufs.sh')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    if (quality) {
      url.searchParams.set('q', quality.toString());
    }
    return url.toString();
  }

  // For all other images, use Next.js default optimization
  // This uses the built-in /_next/image endpoint
  const params = new URLSearchParams();
  params.set('url', src);
  params.set('w', width.toString());
  if (quality) {
    params.set('q', quality.toString());
  }
  
  return `/_next/image?${params.toString()}`;
}

