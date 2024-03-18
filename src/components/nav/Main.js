import {NavLink, useNavigate} from "react-router-dom";
import {NavDropdown} from 'react-bootstrap';
import {useAuth} from "../../context/Auth";

const Main = () => {
    const [auth,setAuth] = useAuth();
    const navigate = useNavigate();
    const logout=()=> {
        setAuth({user:null, token:"", refreshToken:""});
        localStorage.removeItem("auth");
        navigate('/login')
    }

    const loggedIn= auth.user!==null && auth.token!=="" && auth.refreshToken!=="";

    const handlePostAdClick=()=> {
        if(loggedIn) {
            navigate('/ad/create')
        }else{
            navigate('/login')
        }
    }


    return (
        <nav className="nav d-flex justify-content-between lead">
            <NavLink className="nav-link nav-font" aria-current="page" to="/">Home</NavLink>


            <NavLink className="nav-link nav-font" to="/login">Login</NavLink>
            <NavLink className="nav-link nav-font" to="/register">Register</NavLink>

            <div className="dropdown">
                <NavDropdown title="User" id="basic-nav-dropdown" className="nav-font">
                    <NavLink className="dropdown-item" to="/dashboard">Dashboard</NavLink>
                    <a className="dropdown-item" onClick={logout}>Logout</a>
                </NavDropdown>
            </div>
        </nav>

    )
}

export default Main;