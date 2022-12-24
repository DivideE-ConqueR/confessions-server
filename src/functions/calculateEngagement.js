exports = async function () {
  const Post = context.services
    .get("<CLUSTER_NAME>")
    .db("<DB_NAME>")
    .collection("<COLLECTION_NAME>");
  const Comment = context.services
    .get("<CLUSTER_NAME>")
    .db("<DB_NAME>")
    .collection("<COLLECTION_NAME>");

  const LIKE_VALUE = 1.25;
  const DISLIKE_VALUE = -0.5;
  const COMMENT_VALUE = 2.0;
  const REPLY_VALUE = 2.0;
  const REPORT_VALUE = -0.125;

  try {
    const posts = await Post.find(
      { "meta.isDeleted": false },
      { count: 1, "meta.reports": 1 }
    ).toArray();
    await Post.bulkWrite(
      posts.map((post) => {
        return {
          updateOne: {
            filter: { _id: post._id },
            update: {
              $set: {
                engagement:
                  post.count.likes * LIKE_VALUE +
                  post.count.dislikes * DISLIKE_VALUE +
                  post.count.comments * COMMENT_VALUE +
                  post.meta.reports * REPORT_VALUE,
              },
              $currentDate: { updatedAt: true },
            },
          },
        };
      })
    );

    const comments = await Comment.find(
      { "meta.isDeleted": false },
      { count: 1, "meta.reports": 1 }
    ).toArray();
    await Comment.bulkWrite(
      comments.map((comment) => {
        return {
          updateOne: {
            filter: { _id: comment._id },
            update: {
              $set: {
                engagement:
                  comment.count.likes * LIKE_VALUE +
                  comment.count.dislikes * DISLIKE_VALUE +
                  comment.count.replies * REPLY_VALUE +
                  comment.meta.reports * REPORT_VALUE,
              },
              $currentDate: { updatedAt: true },
            },
          },
        };
      })
    );
  } catch (err) {
    console.log(err);
  }
};
