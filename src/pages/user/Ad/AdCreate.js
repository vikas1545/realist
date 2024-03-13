import React from "react";
import {useAuth} from "../../../context/Auth";
import Sidebar from "../../../components/nav/Sidebar";
const AdCreate=()=> {
    const [auth,setAuth] = useAuth();
    return (
        <div>
            <h1 className="display-1 bg-primary text-light p-5">AdCreate</h1>
            <Sidebar/>
        </div>
    );
}

export default AdCreate;