import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
export const findAllCourses = () => {
  return Database.courses;
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
  Database.courses = [...Database.courses, newCourse];
  return newCourse;
};
export const deleteCourse = (courseId) => {
  const { courses, enrollments } = Database;
  Database.courses = courses.filter((course) => course._id !== courseId);
  Database.enrollments = enrollments.filter(
    (enrollment) => enrollment.course !== courseId
  );
};
export function updateCourse(courseId, courseUpdates) {
  const { courses } = Database;
  const updatedCourses = courses.map((course) =>
    course._id === courseId ? { ...course, ...courseUpdates } : course
  );
  Database.courses = updatedCourses;
  return updatedCourses.find((course) => course._id === courseId);
}
