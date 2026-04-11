import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/courses", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Available Courses:</h3>
      {courses.map((course) => (
        <div key={course._id}>
          <h4>{course.title}</h4>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;