// lib/sanity.ts
import SanityClient from '@sanity/client'

export const sanityClient = SanityClient({
  projectId: 'w4q41arm',       // your Sanity project ID
  dataset: 'production',       // or your dataset
  apiVersion: '2025-10-08',    // use today's date or '2021-10-21'
  useCdn: false,               // `true` for public caching, `false` for fresh data
})
