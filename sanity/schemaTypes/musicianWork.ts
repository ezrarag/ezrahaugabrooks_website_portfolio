import { defineField, defineType } from "sanity"
import { Music } from "lucide-react"

export const musicianWorkType = defineType({
  name: "musicianWork",
  title: "Musician Work",
  type: "document",
  icon: Music,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "type",
      title: "Work Type",
      type: "string",
      options: {
        list: [
          { title: "Recording", value: "Recording" },
          { title: "Score", value: "Score" },
          { title: "Live Performance", value: "Live Performance" },
          { title: "Experimental", value: "Experimental" },
          { title: "Commissioned", value: "Commissioned" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mediaType",
      title: "Media Type",
      type: "string",
      options: {
        list: [
          { title: "Audio (MP3/WAV)", value: "audio" },
          { title: "Video (MP4/YouTube/Vimeo)", value: "video" },
          { title: "Document (PDF)", value: "document" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mediaFile",
      title: "Media File",
      type: "file",
      options: {
        accept: ".mp3,.wav,.mp4,.pdf",
      },
      hidden: ({ document }) => document?.mediaType === "video" && document?.externalVideoUrl,
    }),
    defineField({
      name: "externalVideoUrl",
      title: "External Video URL (YouTube/Vimeo)",
      type: "url",
      hidden: ({ document }) => document?.mediaType !== "video",
      description: "Use this for YouTube or Vimeo videos instead of uploading files",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
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
          { title: "Contemporary", value: "contemporary" },
          { title: "Chamber Music", value: "chamber" },
        ],
      },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "dateCompleted",
      title: "Date Completed",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "collaborators",
      title: "Collaborators",
      type: "array",
      of: [{ type: "string" }],
      description: "List of people or organizations you collaborated with",
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      placeholder: "e.g., 4:32 or 1:23:45",
      description: "Duration in MM:SS or HH:MM:SS format",
    }),
    defineField({
      name: "instrumentation",
      title: "Instrumentation",
      type: "string",
      placeholder: "e.g., String Quartet, Full Orchestra, Piano Solo",
    }),
    defineField({
      name: "featured",
      title: "Featured Work",
      type: "boolean",
      initialValue: false,
      description: "Mark as featured to highlight this work",
    }),
    defineField({
      name: "cvInclude",
      title: "Include in CV Generation",
      type: "boolean",
      initialValue: true,
      description: "Include this work when generating CVs and resumes",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first (optional)",
    }),
  ],
  orderings: [
    {
      title: "Featured First",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "dateCompleted", direction: "desc" },
      ],
    },
    {
      title: "Date Completed (Newest)",
      name: "dateDesc",
      by: [{ field: "dateCompleted", direction: "desc" }],
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
      featured: "featured",
    },
    prepare({ title, subtitle, media, featured }) {
      return {
        title: featured ? `⭐ ${title}` : title,
        subtitle,
        media,
      }
    },
  },
})
