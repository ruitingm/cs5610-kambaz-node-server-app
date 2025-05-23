import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
export const findAllCourses = () => {
  return model.find();
};
export const findCoursesForEnrolledUser = (userId) => {
  const { courses, enrollments } = Database;
  const enrolledCourses = courses.filter((course) =>
    enrollments.some(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === course._id
    )
  );
  return enrolledCourses;
};
export const createCourse = (course) => {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
};
export const deleteCourse = (courseId) => {
  return model.deleteOne({ _id: courseId });
};
export function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}
