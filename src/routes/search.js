[
  {
    $search: {
      compound: {
        should: [
          {
            text: {
              query: "rp",
              path: "body",
              fuzzy: {
                maxEdits: 1,
              },
            },
          },
          {
            text: {
              query: "natural",
              path: "name",
              fuzzy: {
                maxEdits: 1,
              },
            },
          },
        ],
      },
    },
  },
  {
    $match: {
      "meta.isDeleted": false,
    },
  },
  {
    $project: {
      name: 1,
      body: 1,
      count: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
  {
    $addFields: {
      score: {
        $meta: "searchScore",
      },
    },
  },
  {
    $limit: 30,
  },
];
