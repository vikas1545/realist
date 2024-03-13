import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {useAuth} from "../context/Auth";
const Login=()=> {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [auth,setAuth] = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const {data} = await axios.post(`/login`, {email, password});
            console.log('data is :', data)
            if (data?.error) {
                toast.error(data.error);
                setLoading(false);
            } else {
                setAuth(data);
                localStorage.setItem("auth",JSON.stringify(data))
                toast.success("Login successfully..");
                setLoading(false);
                navigate('/');
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong!");
            setLoading(false);
        }
    }

    return (
        <div>
            <h1 className="display-1 bg-primary text-light p-5">Login</h1>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 offset-lg-4">
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Enter your Email" className="form-control mb-4" required
                                   autoFocus onChange={(e) => setEmail(e.target.value)} value={email}/>
                            <input type="password" placeholder="Enter your Password" className="form-control mb-4"
                                   onChange={(e) => setPassword(e.target.value)} value={password} required/>
                            <button disabled={loading}
                                    className="btn btn-primary col-12 mb-4">{loading ? "Waiting" : "Login"}</button>
                        </form>

                        <Link className="text-danger" to="/auth/forgot-password">Forgot Password</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;