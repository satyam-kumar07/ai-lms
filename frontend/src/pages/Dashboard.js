import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);

  const navigate = useNavigate();

  // ✅ Get token & userId safely
  const token = localStorage.getItem("token");

  const userId =
    localStorage.getItem("userId") ||
    JSON.parse(localStorage.getItem("user") || "{}")?._id ||
    JSON.parse(localStorage.getItem("user") || "{}")?.id;

  // ✅ Fetch My Courses
  const fetchMyCourses = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await API.get(
        `/courses/my-courses/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMyCourses(res.data);
    } catch (err) {
      console.error("Error fetching my courses:", err);
    }
  }, [userId, token]);

  // ✅ Load data
  useEffect(() => {
    // Get all courses
    API.get("/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));

    // Get my courses
    fetchMyCourses();
  }, [fetchMyCourses, token]);

  // ✅ Enroll function
  const handleEnroll = async (courseId) => {
    if (!userId) {
      alert("User not logged in ❌");
      return;
    }

    try {
      await API.post(
        `/courses/enroll/${courseId}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Enrolled successfully 🚀");

      // Refresh courses
      await fetchMyCourses();
    } catch (err) {
      console.error("Enroll error:", err.response?.data || err.message);
      alert("Enroll failed ❌");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard</h2>

      {/* ALL COURSES */}
      <h3>📚 All Courses</h3>
      <div className="row">
        {courses.map((course) => (
          <div className="col-md-4" key={course._id}>
            <div className="card p-3 mb-3 shadow-sm">
              <h5
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/course/${course._id}`)}
              >
                {course.title}
              </h5>

              <p>{course.description}</p>

              <button
                className="btn btn-primary"
                onClick={() => handleEnroll(course._id)}
              >
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MY COURSES */}
      <h3 className="mt-5">🎯 My Courses</h3>
      <div className="row">
        {myCourses.length === 0 ? (
          <p>No enrolled courses yet.</p>
        ) : (
          myCourses.map((course) => (
            <div className="col-md-4" key={course._id}>
              <div className="card p-3 mb-3 shadow-sm bg-light">
                <h5>{course.title}</h5>
                <p>{course.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;