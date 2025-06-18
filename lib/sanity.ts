import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

// Create the client with your environment variables
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true, // Set to false if you want fresh data
  apiVersion: "2025-06-17",
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN_READ, // Use either token
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Improved GROQ queries with better error handling
export const musicWorksQuery = `
  *[_type == "musicianWork"] | order(featured desc, dateCompleted desc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    description,
    type,
    mediaType,
    "mediaUrl": select(
      mediaFile.asset != null => mediaFile.asset->url,
      externalVideoUrl != null => externalVideoUrl,
      null
    ),
    "thumbnailUrl": select(
      thumbnail.asset != null => thumbnail.asset->url,
      null
    ),
    "thumbnailAlt": thumbnail.alt,
    tags,
    dateCompleted,
    collaborators,
    featured,
    cvInclude,
    duration,
    instrumentation,
    order
  }
`

export const featuredWorksQuery = `
  *[_type == "musicianWork" && featured == true] | order(dateCompleted desc) {
    _id,
    title,
    description,
    type,
    mediaType,
    "mediaUrl": select(
      mediaFile.asset != null => mediaFile.asset->url,
      externalVideoUrl != null => externalVideoUrl,
      null
    ),
    "thumbnailUrl": select(
      thumbnail.asset != null => thumbnail.asset->url,
      null
    ),
    tags,
    dateCompleted,
    collaborators,
    featured,
    cvInclude,
    duration,
    instrumentation
  }
`

export const worksByTagQuery = (tag: string) => `
  *[_type == "musicianWork" && "${tag}" in tags] | order(featured desc, dateCompleted desc) {
    _id,
    title,
    description,
    type,
    mediaType,
    "mediaUrl": select(
      mediaFile.asset != null => mediaFile.asset->url,
      externalVideoUrl != null => externalVideoUrl,
      null
    ),
    "thumbnailUrl": select(
      thumbnail.asset != null => thumbnail.asset->url,
      null
    ),
    tags,
    dateCompleted,
    collaborators,
    featured,
    cvInclude,
    duration,
    instrumentation
  }
`

export const cvWorksQuery = `
  *[_type == "musicianWork" && cvInclude == true] | order(featured desc, dateCompleted desc) {
    _id,
    title,
    description,
    type,
    mediaType,
    tags,
    dateCompleted,
    collaborators,
    duration,
    instrumentation
  }
`

// Get unique tags from all works
export const uniqueTagsQuery = `
  array::unique(*[_type == "musicianWork"].tags[])
`

// Health check query to test connection
export const healthCheckQuery = `
  count(*[_type == "musicianWork"])
`

// Test query for debugging
export const debugQuery = `
  {
    "totalWorks": count(*[_type == "musicianWork"]),
    "featuredWorks": count(*[_type == "musicianWork" && featured == true]),
    "worksWithMedia": count(*[_type == "musicianWork" && defined(mediaFile)]),
    "worksWithThumbnails": count(*[_type == "musicianWork" && defined(thumbnail)]),
    "allTypes": array::unique(*[_type == "musicianWork"].type),
    "allTags": array::unique(*[_type == "musicianWork"].tags[]),
    "sampleWork": *[_type == "musicianWork"][0] {
      _id,
      title,
      type,
      "hasMedia": defined(mediaFile),
      "hasThumbnail": defined(thumbnail),
      tags
    }
  }
`
