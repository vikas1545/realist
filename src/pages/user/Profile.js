import Sidebar from "../../components/nav/Sidebar";
import {useAuth} from "../../context/Auth";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import ProfileUpload from "../../components/forms/ProfileUpload";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
    const [profile, setProfile] = useState({
        username: "",
        name: "",
        email: "",
        company: "",
        address: "",
        phone: "",
        about: "",
        photo: null,
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.user) {
            setProfile({
                ...profile,
                username: auth.user?.username,
                name: auth.user?.name,
                email: auth.user?.email,
                company: auth.user?.company,
                address: auth.user?.address,
                phone: auth.user?.phone,
                about: auth.user?.about,
                photo: auth.user?.photo
            })
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const {data} = await axios.put("/update-profile", {profile});
            if (data?.error) {
                toast.error(data.error)
            } else {
                setAuth({...auth, user: data});
                let fromLS = JSON.parse(localStorage.getItem("auth"));
                fromLS.user = data;
                localStorage.setItem("auth", JSON.stringify(fromLS))
                setLoading(false)
                toast.success("Profile Updated")
            }
        } catch (e) {
            console.log('error :', e)
            toast.error("something went wrong")
            setLoading(false)
        }
    }
    return (
        <>
            <h1 className='display-1 bg-primary text-light p-5'>Profile</h1>
            <div className='container-fluid'>
                <Sidebar/>
                <div className='container mt-2'>
                    {/*<pre>{JSON.stringify({...profile})}</pre>*/}
                    {/*<pre>{JSON.stringify(auth)}</pre>*/}
                    <div className='row'>
                        <div className='col-lg-8 offset-lg-2 mt-2'>
                            <ProfileUpload profile={profile} uploading={uploading} setUploading={setUploading}
                                           setProfile={setProfile}/>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type='text'
                                    placeholder='update your username'
                                    className='form-control mb-4'
                                    value={profile.username}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        username: e.target.value.toLocaleLowerCase()
                                    })}
                                />
                                <input
                                    type='text'
                                    placeholder='update your name'
                                    className='form-control mb-4'
                                    value={profile.name}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        name: e.target.value.toLocaleLowerCase()
                                    })}
                                />
                                <input
                                    type='text'
                                    placeholder='update your email'
                                    className='form-control mb-4'
                                    value={profile.email}
                                    disabled={true}
                                />

                                <input
                                    type='text'
                                    placeholder='Enter your company name'
                                    className='form-control mb-4'
                                    value={profile.company}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        company: e.target.value.toLocaleLowerCase()
                                    })}
                                />
                                <input
                                    type='text'
                                    placeholder='Enter your address'
                                    className='form-control mb-4'
                                    value={profile.address}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        address: e.target.value.toLocaleLowerCase()
                                    })}
                                />
                                <input
                                    type='text'
                                    placeholder='Enter your phone'
                                    className='form-control mb-4'
                                    value={profile.phone}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        phone: e.target.value.toLocaleLowerCase()
                                    })}
                                />
                                <textarea
                                    placeholder='Write something intresting about yourself..'
                                    className='form-control mb-4'
                                    value={profile.about}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        about: e.target.value.toLocaleLowerCase()
                                    })}
                                />
                                <button className='btn btn-primary col-12 mb-4' disabled={loading}>
                                    {loading ? "Processing" : "Update profile"}
                                </button>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )

}

export default Profile;