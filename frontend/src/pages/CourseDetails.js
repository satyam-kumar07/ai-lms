import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/courses`)
      .then((res) => {
        const found = res.data.find(c => c._id === id);
        setCourse(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      <h3>📚 Modules</h3>

      {course.modules.map((module, i) => (
        <div key={i}>
          <h4>📦 {module.title}</h4>

          {module.lessons.map((lesson, j) => (
            <div key={j}>
              <p onClick={() => navigate(`/lesson/${id}/${i}/${j}`)}>
   {lesson.title}
</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default CourseDetails;