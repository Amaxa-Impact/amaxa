// schemas/jobPosting.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "jobPosting",
  title: "Job Posting",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "department",
      title: "Department",
      type: "string",
      options: {
        list: [
          { title: "Engineering", value: "Engineering" },
          { title: "Operations", value: "Operations" },
          { title: "Programs", value: "Programs" },
          { title: "Marketing", value: "Marketing" },
          { title: "General", value: "General" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "type",
      title: "Employment Type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "Full-time" },
          { title: "Part-time", value: "Part-time" },
          { title: "Contract", value: "Contract" },
          { title: "Internship", value: "Internship" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Job Description",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Toggle to show or hide this job on the site",
      initialValue: true,
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: {
      title: "title",
      department: "department",
      location: "location",
      isActive: "isActive",
    },
    prepare({ title, department, location, isActive }) {
      return {
        title,
        subtitle: `${department} • ${location}${isActive ? "" : " (Inactive)"}`,
      };
    },
  },
});
