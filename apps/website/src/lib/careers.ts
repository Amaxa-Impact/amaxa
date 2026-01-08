// lib/careers.ts
import { sanityClient } from './sanity'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(sanityClient)
export const urlFor = (source: any) => builder.image(source)

export type CareerCategory = 'internship' | 'volunteer' | 'undergraduate-coach'

export interface CareerPost {
  _id: string
  title: string
  slug: { current: string }
  category: CareerCategory
  description?: string
  body?: any
  mainImage?: { asset: { _ref: string }; alt?: string }
  publishedAt: string
  applicationLink?: string
}

export async function getAllCareerPosts(): Promise<CareerPost[]> {
  const posts: CareerPost[] = await sanityClient.fetch(
    `*[_type == "career"] | order(publishedAt desc){
      _id,
      title,
      slug,
      category,
      description,
      body,
      mainImage,
      publishedAt,
      applicationLink
    }`
  )
  return posts
}

export async function getCareerPostBySlug(slug: string): Promise<CareerPost | null> {
  const post: CareerPost = await sanityClient.fetch(
    `*[_type == "career" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      category,
      description,
      body,
      mainImage,
      publishedAt,
      applicationLink
    }`,
    { slug }
  )
  return post || null
}

