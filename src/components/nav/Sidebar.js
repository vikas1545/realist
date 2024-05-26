import {NavLink} from "react-router-dom";

const Sidebar = () => {
    return (
        // <h1>Sidebar</h1>
        <div>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                    <NavLink className="nav-link" to='/dashboard'>Dashboard</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to='/ad/create'>Create Ad</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to='/user/profile'>Profile</NavLink>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar;