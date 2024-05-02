import Resizer from "react-image-file-resizer";
import axios from "axios";
import {Avatar, Box, Stack} from "@mui/material";

const ImageUpload = ({ad, setAd}) => {

    // const handleUpload = async (e) => {
    //     try {
    //         let files = e.target.files;
    //         files = [...files];
    //         if (files?.length) {
    //             setAd({ ...ad, uploading: true });
    //             files.map((file) => {
    //                 return new Promise(() => {
    //                     Resizer.imageFileResizer(
    //                         file,
    //                         1080,
    //                         720,
    //                         "JPEG",
    //                         100,
    //                         0,
    //                         async (uri) => {
    //                             try {
    //                                 const { data } = await axios.post("/upload-image", {
    //                                     image: uri
    //                                 });
    //                                 setAd(prev => ({
    //                                     ...prev,
    //                                     photos: [data, ...prev.photos],
    //                                     uploading: false
    //                                 }));
    //                             } catch (e) {
    //                                 console.log('error in image resize :',e);
    //                                 setAd({ ...ad, uploading: false });
    //                             }
    //                             setAd({ ...ad, uploading: false });
    //                         },
    //                         "base64"
    //                     );
    //                 });
    //             });
    //
    //             setAd((prev) => ({
    //                 ...prev,
    //                 uploading: false
    //             }));
    //         }
    //     } catch (err) {
    //         console.log('error :', err);
    //         setAd({ ...ad, uploading: false });
    //     }
    // };

    const handleUpload = async (e) => {
        try {
            let files = e.target.files;
            files = [...files];
            if (files?.length) {
                setAd({...ad, uploading: true});
                files.forEach((file) => {
                    Resizer.imageFileResizer(
                        file,
                        1080,
                        720,
                        "JPEG",
                        100,
                        0,
                        async (uri) => {
                            try {
                                const {data} = await axios.post("/upload-image", {
                                    image: uri
                                });
                                setAd(prev => ({
                                    ...prev,
                                    photos: [data, ...prev.photos],
                                    uploading: false
                                }));
                            } catch (e) {
                                console.log('error in image resize :', e);
                                setAd(prev => ({...prev, uploading: false}));
                            }

                        },
                        "base64"
                    );
                });
            }
        } catch (err) {
            console.log('error :', err);
            setAd({...ad, uploading: false});
        }
    };

    const handleDelete = async () => {
        try {
            setAd({...ad, uploading: true})
        } catch (err) {
            setAd({...ad, uploading: false})
        }
    }

    return (
        <Box display={'flex'}><label className='btn btn-secondry'>
            {ad.uploading ? "processing..." : "Upload photos"}
            <input onChange={handleUpload} type='file' accept="image/*" multiple hidden/>
        </label>

            <Stack direction="row" spacing={2}>
                {ad.photos?.map((file) => (
                        <Avatar
                            alt="Remy Sharp"
                            src={file?.Location}
                            sx={{width: 54, height: 54}}
                            className="mx-1"
                        />
                    )
                )}

            </Stack>

        </Box>
    )
}

export default ImageUpload;