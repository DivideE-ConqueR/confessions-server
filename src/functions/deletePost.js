exports = async function () {
  const Post = context.services
    .get("<CLUSTER_NAME>")
    .db("<DB_NAME>")
    .collection("<COLLECTION_NAME>");

  const DELETE_THRESHOLD = 10;

  try {
    const posts = await Post.find(
      {
        $and: [
          { "meta.isDeleted": false },
          { "meta.reports": { $gte: DELETE_THRESHOLD } },
        ],
      },
      { _id: 1 }
    ).toArray();
    const ids = posts.map((post) => post._id);
    Post.updateMany(
      { _id: { $in: ids } },
      { $set: { "meta.isDeleted": true }, $currentDate: { updatedAt: true } }
    );
  } catch (err) {
    console.log(err);
  }
};
