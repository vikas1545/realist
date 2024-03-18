import {useAuth} from "../../context/Auth";
import {useEffect, useState} from "react";
import axios from "axios";
import {Outlet} from "react-router-dom";


const PrivateRoute = ()=> {
    const [auth,setAuth]=useAuth();
    const [ok,setOk]=useState(false);

    useEffect(() => {
        if(auth?.token) {
            getCurrentUser()
        }
    }, [auth?.token]);

    const getCurrentUser = async ()=> {
        try{
            const {data} =await axios.get("/current-user",{
                headers:{
                    Authorization:auth?.token
                }
            })
            setOk(true)
        }catch (err) {
            console.log('error ############ :',err)
            setOk(false)
        }
    }
    return ok?<Outlet/>:""
}

export default PrivateRoute;