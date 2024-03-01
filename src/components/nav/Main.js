import {NavLink} from "react-router-dom";
import {NavDropdown} from 'react-bootstrap';

const Main = () => {
    return (
        <nav className="nav d-flex justify-content-between lead">
            <NavLink className="nav-link nav-font" aria-current="page" to="/">Home</NavLink>
            <NavLink className="nav-link nav-font" to="/login">Login</NavLink>
            <NavLink className="nav-link nav-font" to="/register">Register</NavLink>

            <div className="dropdown">
                <NavDropdown title="User" id="basic-nav-dropdown" className="nav-font">
                    <NavLink className="dropdown-item" to="/dashboard">Dashboard</NavLink>
                    <NavLink className="dropdown-item" to="/logout">Logout</NavLink>
                </NavDropdown>
            </div>
        </nav>

    )
}

export default Main;