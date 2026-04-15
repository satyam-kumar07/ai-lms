import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CourseDetails from "./pages/CourseDetails";
import LessonPage from "./pages/LessonPage";

function App() {
  return (
    <Router>
      <h1>AI LMS 🚀</h1>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/lesson/:courseId/:moduleIndex/:lessonIndex" element={<LessonPage />} />
      </Routes>
    </Router>
  );
}

export default App;