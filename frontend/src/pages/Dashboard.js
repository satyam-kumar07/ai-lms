import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [courses, setCourses] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    API.get("/courses", {
      headers: { Authorization: token },
    })
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleEnroll = async (courseId) => {
    try {
      await API.post(`/courses/enroll/${courseId}/${userId}`);
      alert("Enrolled successfully 🚀");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {courses.map((course) => (
        <div key={course._id}>
          <h4>{course.title}</h4>
          <p>{course.description}</p>

          <button onClick={() => handleEnroll(course._id)}>
            Enroll
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;