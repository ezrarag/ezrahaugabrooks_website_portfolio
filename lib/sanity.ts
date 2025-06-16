import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

// These will be your actual Sanity project credentials
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN, // Only needed for mutations
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Improved GROQ queries with proper null handling
export const musicWorksQuery = `
  *[_type == "musicianWork"] | order(featured desc, dateCompleted desc) {
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

// Get unique tags from all works (for dynamic filter generation)
export const uniqueTagsQuery = `
  array::unique(*[_type == "musicianWork"].tags[])
`

// Health check query to test connection
export const healthCheckQuery = `
  count(*[_type == "musicianWork"])
`
