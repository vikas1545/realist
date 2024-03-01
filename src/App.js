import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {AuthProvider} from "./context/Auth";
import {createContext, useState} from "react";
import Main from "./components/nav/Main";
//import 'bootstrap/dist/css/bootstrap.min.css';
export const AuthContext1 = createContext();
function App() {

    return (
        <BrowserRouter>
            <Main/>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>

    );
}

export default App;
