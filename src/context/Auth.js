import React, {useEffect} from "react";
import {useState,createContext,useContext} from "react";
import axios from "axios";
const AuthContext = createContext({});

const API = process.env.REACT_APP_API_URL;
axios.defaults.baseURL=API;
const AuthProvider = ({children}) => {
    const [auth,setAuth]=useState({
        user:null,
        token:"",
        refreshToken:""
    })

    useEffect(() => {
        let fromLS = localStorage.getItem("auth");
        if(fromLS) setAuth(JSON.parse(fromLS))
    }, []);

    return (
        <AuthContext.Provider value={[auth,setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = ()=>useContext(AuthContext);
export {useAuth,AuthProvider}