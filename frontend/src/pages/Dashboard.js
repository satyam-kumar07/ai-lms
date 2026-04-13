import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // All courses
    API.get("/courses", {
      headers: { Authorization: token },
    })
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));

    // My courses
    API.get(`/courses/my-courses/${userId}`)
      .then((res) => setMyCourses(res.data))
      .catch((err) => console.error(err));
  }, [token, userId]);

  const handleEnroll = async (courseId) => {
    try {
      await API.post(`/courses/enroll/${courseId}/${userId}`);
      alert("Enrolled successfully 🚀");

      // Refresh my courses
      const res = await API.get(`/courses/my-courses/${userId}`);
      setMyCourses(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>📚 All Courses</h3>
      {courses.map((course) => (
        <div key={course._id}>
          <h4>{course.title}</h4>
          <p>{course.description}</p>

          <button onClick={() => handleEnroll(course._id)}>
            Enroll
          </button>
        </div>
      ))}

      <h3>🎯 My Courses</h3>
      {myCourses.map((course) => (
        <div key={course._id}>
          <h4>{course.title}</h4>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;