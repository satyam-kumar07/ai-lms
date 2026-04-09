import { useEffect, useState } from "react";
import API from "./services/api";
import CourseCard from "./components/CourseCard";

function App() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get("/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>AI LMS Frontend 🚀</h1>

      {courses.map((course, index) => (
        <CourseCard key={index} course={course} />
      ))}

    </div>
  );
}

export default App;