import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark p-3">
      <h4 className="text-white">AI LMS 🚀</h4>

      <div>
        {token ? (
          <>
            <Link className="btn btn-light m-1" to="/dashboard">Dashboard</Link>
            <Link className="btn btn-light m-1" to="/planner">Planner</Link>
            <Link className="btn btn-light m-1" to="/ai-teacher">AI Teacher</Link>
            <Link className="btn btn-light m-1" to="/notes">Notes</Link>
            <Link className="btn btn-light m-1" to="/quiz">Quiz</Link>

            <button className="btn btn-danger m-1" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-success m-1" to="/login">Login</Link>
            <Link className="btn btn-warning m-1" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;