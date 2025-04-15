import * as postDao from "./dao.js";
import * as repliesDao from "../Replies/dao.js";
export default function PostRoutes(app) {
  app.put("/api/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const postUpdates = req.body;
    const status = await postDao.updatePost(postId, postUpdates);
    res.send(status);
  });
  const findRepliesForPost = async (req, res) => {
    const { courseId, postId } = req.params;
    const posts = await repliesDao.findRepliesForPost(courseId, postId);
    res.json(posts);
  };
  app.get("/api/posts/:postId/replies", findRepliesForPost);
  const createReplyForPost = async (req, res) => {
    const { courseId, postId } = req.params;
    const post = { ...req.body, course: courseId, post: postId };
    const newReply = await repliesDao.creatReply(post);
    res.send(newReply);
  };
  app.post("/api/posts/:postId/replies", createReplyForPost);
}
