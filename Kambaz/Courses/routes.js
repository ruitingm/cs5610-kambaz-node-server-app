import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import * as postsDao from "../Posts/dao.js";
import * as folderDao from "../Folders/dao.js";
export default function CourseRoutes(app) {
  app.get("/api/courses", async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  });
  app.post("/api/courses", async (req, res) => {
    const course = await dao.createCourse(req.body);
    const currentUser = req.session["currentUser"];
    if (currentUser) {
      await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
    }
    res.json(course);
  });
  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  });
  app.put("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  });
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });
  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = await modulesDao.createModule(module);
    res.send(newModule);
  });
  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    const assignments = await assignmentsDao.findAssignmentForCourse(courseId);
    res.json(assignments);
  });
  app.post("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    const assignment = {
      ...req.body,
      course: courseId,
    };
    const newAssignment = await assignmentsDao.createAssignment(assignment);
    res.send(newAssignment);
  });
  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  };
  app.get("/api/courses/:cid/users", findUsersForCourse);
  const getPostsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const { keyword, userId, role } = req.query;
    if (!userId || !role) {
      return res.status(400).send("Missing userId or role");
    }
    try {
      if (keyword) {
        const posts = await postsDao.findPostByKeywords(
          courseId,
          userId,
          role,
          keyword
        );
        return res.json(posts);
      }
      const posts = await postsDao.findPostsForCourse(courseId, userId, role);
      return res.json(posts);
    } catch (err) {
      return res.status(500);
    }
  };
  app.get("/api/courses/:courseId/posts", getPostsForCourse);
  const createPostForCourse = async (req, res) => {
    const { courseId } = req.params;
    const post = { ...req.body, course: courseId };
    const newPost = await postsDao.createPost(post);
    res.send(newPost);
  };
  app.post("/api/courses/:courseId/posts", createPostForCourse);
  app.get("/api/courses/:courseId/folders", async (req, res) => {
    const { courseId } = req.params;
    const folders = await folderDao.findFoldersForCourse(courseId);
    res.json(folders);
  });
  app.post("/api/courses/:courseId/folders", async (req, res) => {
    const { courseId } = req.params;
    const folder = {
      ...req.body,
      _id: courseId,
    };
    const newFolder = await folderDao.createFolder(folder);
    res.json(newFolder);
  });
}
