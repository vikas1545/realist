import {useAuth} from "../../context/Auth";
import {FcLike, FcLikePlaceholder} from "react-icons/fc";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const LikeUnlike = ({ad}) => {

    const [auth, setAuth] = useAuth();
    const navigate = useNavigate()

    const handleUnlike = async ()=> {
        try {
            if(auth?.user===null) {
                navigate("/login",{state:`{/ad/${ad?.slug}`});
                return
            }
            const {data} = await axios.delete(`/wishlist/${ad._id}`);
            setAuth({...auth,user:data})
            const fromLS = JSON.parse(localStorage.getItem('auth'))
            fromLS.user = data;
            localStorage.setItem("auth",JSON.stringify(fromLS))
            toast.success("removed from wishlist")
        }catch (e) {
            console.log('err :',e)
        }
    }

    const handleLike = async ()=> {
        try {
            if(auth?.user===null) {
                navigate("/login",{state:`{/ad/${ad?.slug}`});
                return
            }
            const {data} = await axios.post("/wishlist",{adId:ad._id});
            if(data?.error) {
                toast.error(data?.error);
                return
            }
            setAuth({...auth,user:data})
            const fromLS = JSON.parse(localStorage.getItem('auth'))
            fromLS.user = data;
            localStorage.setItem("auth",JSON.stringify(fromLS))
            toast.success("Added to wishlist")
        }catch (e) {
            console.log('err :',e)
            toast.error('something went wrong');
        }
    }

    return (

        <>
            {auth?.user?.wishlist?.includes(ad?._id) ?

            <span><FcLike onClick={handleUnlike} className='h2 mt-3 pointer'/></span> :
            <span><FcLikePlaceholder onClick={handleLike} className='h2 mt-3 pointer'/></span>
        }
        </>
    )
}

export default LikeUnlike;