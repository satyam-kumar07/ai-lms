function CourseCard({ course }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      margin: "10px",
      borderRadius: "8px"
    }}>
      <h3>{course.title}</h3>
    </div>
  );
}

export default CourseCard;