exports = async function (changeEvent) {
  const Post = context.services
    .get("<CLUSTER_NAME>")
    .db("<DB_NAME>")
    .collection("<COLLECTION_NAME>");
  const Comment = context.services
    .get("<CLUSTER_NAME>")
    .db("<DB_NAME>")
    .collection("<COLLECTION_NAME>");
  const doc = changeEvent.fullDocument;

  try {
    await Post.updateOne(
      { _id: doc.pid },
      { $inc: { "count.comments": 1 }, $currentDate: { updatedAt: true } }
    );
    if (doc.parent_id) {
      await Comment.updateOne(
        { _id: doc.parent_id },
        { $inc: { "count.replies": 1 }, $currentDate: { updatedAt: true } }
      );
    }
  } catch (err) {
    console.log(err);
  }
};
