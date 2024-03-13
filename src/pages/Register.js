import React, {useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`/pre-register`, { email, password });
            console.log('data is :',data)
                if(data?.error) {
                    toast.error(data.error);
                    setLoading(false);
                }
                else{
                    toast.success("Please check your email for account activation..");
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
            <h1 className="display-1 bg-primary text-light p-5">Register</h1>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 offset-lg-4">
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Enter your Email" className="form-control mb-4" required
                                   autoFocus onChange={(e) => setEmail(e.target.value)} value={email}/>
                            <input type="password" placeholder="Enter your Password" className="form-control mb-4"
                                   onChange={(e) => setPassword(e.target.value)} value={password} required/>
                            <button disabled={loading} className="btn btn-primary col-12 mb-4">{loading ? "Waiting": "Register"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;