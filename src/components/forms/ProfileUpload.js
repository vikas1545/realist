import Resizer from "react-image-file-resizer";
import axios from "axios";
import {Avatar, Box, Stack} from "@mui/material";
import {useAuth} from "../../context/Auth";

const ProfileUpload = ({profile, setProfile, uploading, setUploading}) => {
    const [auth, setAuth] = useAuth();
    const handleUpload = async (e) => {
        try {
            let file = e.target.files[0];
            if (file) {
                setUploading(true);
                try {
                    const uri = await resizeImage(file);
                    const {data} = await axios.post("/upload-image", {image: uri});
                    setProfile((prev)=> ({...prev,photo:data}))
                    setUploading(false);
                } catch (e) {
                    setUploading(false)
                }
            }
        } catch (err) {
            console.log('Error:', err);

        }
    };

    const resizeImage = async (file) => {
        return new Promise((resolve, reject) => {
            Resizer.imageFileResizer(file, 1080, 720, "JPEG", 100, 0,
                (uri) => resolve(uri),
                "base64",
                () => reject("Image resizing failed")
            );
        });
    };

    const handleDelete = async (file) => {
        const answer = window.confirm("Are you sure want to delete it ?");
        if (!answer) return;
        try {
            setUploading(true)
            const {data} = await axios.delete('/remove-image', {data: file});
            if (data?.ok) {
                setProfile((prev)=> ({...prev,photo:null}));
                setUploading(false)
            }
        } catch (err) {
            setUploading(false)
        }
    }

    return (
        <Box display={'flex'}>
            <label className='btn btn-secondry mr-1'>
                {uploading ? "processing..." : "Upload photo"}
                <input onChange={handleUpload} type='file' accept="image/*" hidden/>
            </label>

            <Stack direction="row" spacing={2}>
                {profile.photo?.Location ?(
                        <Avatar
                            key='img'
                            alt="Profile image"
                            src={profile?.photo?.Location}
                            sx={{width: 54, height: 50}}
                            className="mx-1"
                            variant="rounded"
                            onClick={() => handleDelete(profile?.photo)}
                        />
                    ):""
                }

            </Stack>

        </Box>
    )
}

export default ProfileUpload;