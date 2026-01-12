import authorSchema from "@/lib/sanity/schema/author";
import jobPosting from "@/lib/sanity/schema/jobPosting";
import postSchema from "@/lib/sanity/schema/posts";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  name: "content-admin",
  title: "Content Admin",

  projectId: "w4q41arm",
  dataset: "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Jobs")
              .child(S.documentTypeList("jobPosting").title("Job Postings")),

            S.divider(),

            S.listItem()
              .title("Blog")
              .child(
                S.list()
                  .title("Blog")
                  .items([
                    S.documentTypeListItem("post").title("Posts"),
                    S.documentTypeListItem("author").title("Authors"),
                  ]),
              ),
          ]),
    }),
  ],

  schema: {
    types: [jobPosting, postSchema, authorSchema],
  },
});
