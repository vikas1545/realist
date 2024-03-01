import React, {useState} from "react";
import axios from "axios";
//import {API} from "../configclient";
export const API = "http://localhost:8000/api";
const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res= await axios.post(`${API}/pre-register`,{email,password});
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <h1 className="display-1 bg-primary text-light p-5">Register</h1>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 offset-lg-4">
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Enter your Email" className="form-control mb-4" required
                                   autoFocus onChange={(e) => setEmail(e.target.value)} value={email}/>
                            <input type="password" placeholder="Enter your Password" className="form-control mb-4"
                                   onChange={(e) => setPassword(e.target.value)} value={password} required/>
                            <button className="btn btn-primary col-12 mb-4">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;