// Sanity CMS Schema for Musician Works
export const musicianWorkSchema = {
  name: "musicianWork",
  title: "Musician Work",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Recording", value: "Recording" },
          { title: "Score", value: "Score" },
          { title: "Live Performance", value: "Live Performance" },
          { title: "Experimental", value: "Experimental" },
          { title: "Commissioned", value: "Commissioned" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "mediaType",
      title: "Media Type",
      type: "string",
      options: {
        list: [
          { title: "Audio (MP3/WAV)", value: "audio" },
          { title: "Video (MP4/YouTube/Vimeo)", value: "video" },
          { title: "Document (PDF)", value: "document" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "mediaFile",
      title: "Media File",
      type: "file",
      options: {
        accept: ".mp3,.wav,.mp4,.pdf",
      },
    },
    {
      name: "mediaUrl",
      title: "Media URL (for YouTube/Vimeo)",
      type: "url",
    },
    {
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Orchestra", value: "orchestra" },
          { title: "Choral", value: "choral" },
          { title: "Film", value: "film" },
          { title: "BEAM Think Tank", value: "BEAM Think Tank" },
          { title: "Electronic", value: "electronic" },
          { title: "Classical", value: "classical" },
          { title: "Jazz", value: "jazz" },
          { title: "Experimental", value: "experimental" },
          { title: "Commissioned", value: "commissioned" },
          { title: "Live", value: "live" },
          { title: "Collaborative", value: "collaborative" },
        ],
      },
    },
    {
      name: "dateCompleted",
      title: "Date Completed",
      type: "date",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "collaborators",
      title: "Collaborators",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "duration",
      title: "Duration (MM:SS)",
      type: "string",
    },
    {
      name: "instrumentation",
      title: "Instrumentation",
      type: "string",
    },
    {
      name: "featured",
      title: "Featured Work",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "cvInclude",
      title: "Include in CV Generation",
      type: "boolean",
      initialValue: true,
      description: "Whether this work should be included when generating CVs/resumes",
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
    },
  ],
  orderings: [
    {
      title: "Date Completed, New",
      name: "dateCompletedDesc",
      by: [{ field: "dateCompleted", direction: "desc" }],
    },
    {
      title: "Featured First",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "dateCompleted", direction: "desc" },
      ],
    },
    {
      title: "Custom Order",
      name: "customOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "type",
      media: "thumbnail",
    },
  },
}
