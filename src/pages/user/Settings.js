import Sidebar from "../../components/nav/Sidebar";
import {useAuth} from "../../context/Auth";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import ProfileUpload from "../../components/forms/ProfileUpload";

export default function Settings() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [auth, setAuth] = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const {data} = await axios.put("/update-password", {password});
            if (data?.error) {
                toast.error(data.error)
                setLoading(false)
            } else {
                console.log('data :', data)
                setLoading(false)
                setPassword("")
                toast.success("Profile Updated")
            }
        } catch (e) {
            console.log('error :', e)
            setLoading(false)
            toast.error("something went wrong")
        }
    }


    return (
        <>
            <h1 className='display-1 bg-primary text-light p-5'>Settings</h1>
            <div className='container-fluid'>
                <Sidebar/>
                <div className='container mt-2'>
                    <pre>{JSON.stringify(password)}</pre>
                    <div className='row'>
                        <div className='col-lg-8 offset-lg-2 mt-2'>

                            <form onSubmit={handleSubmit}>
                                <input
                                    type='password'
                                    placeholder='update password'
                                    className='form-control mb-4'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button className='btn btn-primary col-12 mb-4' disabled={loading}>
                                    {loading ? "Processing" : "Update Password"}
                                </button>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )

}