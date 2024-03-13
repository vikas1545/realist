import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {useAuth} from "../../context/Auth";
const ForgotPassword=()=> {
    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [auth,setAuth] = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const {data} = await axios.post(`/forgot-password`, {email});
            console.log('data is :', data)
            if (data?.error) {
                toast.error(data.error);
                setLoading(false);
            } else {
                toast.success("Check your email for reset password ..");
                setLoading(false);
                //navigate('/');
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong!");
            setLoading(false);
        }
    }

    return (
        <div>
            <h1 className="display-1 bg-primary text-light p-5">Forgot Password</h1>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 offset-lg-4">
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Enter your Email" className="form-control mb-4" required
                                   autoFocus onChange={(e) => setEmail(e.target.value)} value={email}/>
                            <button disabled={loading}
                                    className="btn btn-primary col-12 mb-4">{loading ? "Waiting" : "Submit"}</button>
                        </form>

                        <Link className="text-danger" to="/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ForgotPassword;