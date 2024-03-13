import React from "react";
import {useAuth} from "../../context/Auth";
import Sidebar from "../../components/nav/Sidebar";
const Dashboard=()=> {
    const [auth,setAuth] = useAuth();
    return (
        <div>
            <h1 className="display-1 bg-primary text-light p-5">Dashboard</h1>
            <Sidebar/>
        </div>
    );
}

export default Dashboard;