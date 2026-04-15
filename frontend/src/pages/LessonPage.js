import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function LessonPage() {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const [lesson, setLesson] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    API.get("/courses")
      .then((res) => {
        const course = res.data.find(c => c._id === courseId);
        const lessonData =
          course.modules[moduleIndex].lessons[lessonIndex];

        setLesson(lessonData);

        //  Update progress
        API.post("/progress/update", {
          userId,
          courseId,
          progress: 50
        });

      })
      .catch((err) => console.error(err));
  }, [ courseId, moduleIndex, lessonIndex, userId]);

  if (!lesson) return <p>Loading...</p>;

  return (
    <div>
      <h2>{lesson.title}</h2>
      <p>{lesson.content}</p>
    </div>
  );
}

export default LessonPage;