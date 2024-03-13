import {json, useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {useAuth} from "../../context/Auth";

const AccountActivate = () => {
    const [auth,setAuth] = useAuth();
    const {token} = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if(token) requestActivation();
    }, [token]);

    const requestActivation =async ()=> {
        try{
            const {data} = await axios.post('/register',{token});
            if(data?.error){
                toast.error(data.error);
            }else {
                localStorage.setItem("auth",JSON.stringify(data))
                setAuth(data);
                toast.success("Successfully loggedIn..");
                navigate('/');
            }
        }catch (err) {
            console.log(err)
            toast.error("Something went wrong...");
        }
    }

    return (
        <div className="display-1 d-flex justify-content-center align-items-center vh-100"
             style={{marginTop: '-5%'}}>Please Wait...</div>
    )
}

export default AccountActivate;