import {useEffect, useState} from "react";
import {useAuth} from "../../context/Auth";
import {Link, useNavigate} from "react-router-dom";
import {message} from "antd";
import toast from "react-hot-toast";
import axios from "axios";

export default function ContactSeller({ad}) {
    const [auth, setAuth] = useAuth();
    const [sellerContact, setSellerContact] = useState({
        name: "",
        email: "",
        message: "",
        phone: "",
    })
    const [loading,setLoading]=useState(false);
    const navigate = useNavigate();
    const loggedIn = auth?.user !==null && auth?.token !=="";

    useEffect(()=> {
        if(loggedIn) {
            setSellerContact({
                ...sellerContact,
                email: auth.user.email,
                phone: auth.user.phone,
                name: auth.user.name
            })
        }
    },[loggedIn])

    const handleSubmit =async (e)=> {
        e.preventDefault();
        try{
            setLoading(true);
            const {data} = await axios.post('/contact-seller',{
                ...sellerContact,adId:ad._id
            });
            if(data?.error) {
                toast.error("Something went wrong")
                setLoading(false);
            }else {
                toast.success("Your enquiry has been sent to seller")
                setLoading(false);
            }
        }catch (e) {
            toast.error("Something went wrong")
            setLoading(false);
        }
    }

    return (
        <>
            <div className='row'>
                {/*<pre>{JSON.stringify(auth?.user)}</pre>*/}
                <div className='col-md-8 offset-lg-2'>
                    <h3>Contact {ad?.postedBy?.name ? ad?.postedBy?.name : ad?.postedBy?.username}</h3>

                    <form onSubmit={handleSubmit}>
                        <textarea
                            placeholder='Write your message'
                            className='form-control mb-4'
                            value={sellerContact.message}
                            onChange={(e) => setSellerContact({
                                ...sellerContact,
                                message: e.target.value
                            })}
                            autoFocus={true}
                        />
                        <input
                            type='email'
                            placeholder='Enter your Name'
                            className='form-control mb-4'
                            value={sellerContact.email}
                            onChange={(e) => setSellerContact({
                                ...sellerContact,
                                email: e.target.value
                            })}

                        />

                        <input
                            type='text'
                            placeholder='Enter your Name'
                            className='form-control mb-4'
                            value={sellerContact.name}
                            onChange={(e) => setSellerContact({
                                ...sellerContact,
                                name: e.target.value
                            })}
                        />

                        <input
                            type='text'
                            placeholder='Enter your Phone No'
                            className='form-control mb-4'
                            value={sellerContact.phone}
                            onChange={(e) => setSellerContact({
                                ...sellerContact,
                                phone: e.target.value
                            })}
                        />

                        <button
                            className='btn btn-primary mb-5 pointer'
                            disabled={!sellerContact.name || !sellerContact.email}
                        >
                            {/*{sellerContact.loading?"Please Wait":"Send Enquiry"}*/}
                            {loggedIn ? loading?"Please Wait..":"Send Enquiry" :"Login to Send enquiry"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}