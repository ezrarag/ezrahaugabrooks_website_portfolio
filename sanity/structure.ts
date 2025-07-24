import type { StructureBuilder } from "sanity/structure"

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Musician Works")
        .child(
          S.documentTypeList("musicianWork")
            .title("All Works")
            .filter('_type == "musicianWork"')
            .defaultOrdering([
              { field: "featured", direction: "desc" },
              { field: "dateCompleted", direction: "desc" },
            ]),
        ),
      S.listItem()
        .title("Featured Works")
        .child(
          S.documentTypeList("musicianWork")
            .title("Featured Works")
            .filter('_type == "musicianWork" && featured == true'),
        ),
      S.listItem()
        .title("CV Ready Works")
        .child(
          S.documentTypeList("musicianWork")
            .title("CV Ready Works")
            .filter('_type == "musicianWork" && cvInclude == true'),
        ),
    ])
