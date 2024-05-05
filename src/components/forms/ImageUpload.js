import Resizer from "react-image-file-resizer";
import axios from "axios";
import {Avatar, Box, Stack} from "@mui/material";

const ImageUpload = ({ad, setAd}) => {


    // const handleUpload = async (e) => {
    //     try {
    //         let files = e.target.files;
    //         files = [...files];
    //         if (files?.length) {
    //             setAd({...ad, uploading: true});
    //             files.forEach((file) => {
    //                 Resizer.imageFileResizer(
    //                     file,
    //                     1080,
    //                     720,
    //                     "JPEG",
    //                     100,
    //                     0,
    //                     async (uri) => {
    //                         try {
    //                             const {data} = await axios.post("/upload-image", {
    //                                 image: uri
    //                             });
    //                             setAd(prev => ({
    //                                 ...prev,
    //                                 photos: [data, ...prev.photos],
    //                                 uploading: false
    //                             }));
    //                         } catch (e) {
    //                             console.log('error in image resize :', e);
    //                             setAd(prev => ({...prev, uploading: false}));
    //                         }
    //
    //                     },
    //                     "base64"
    //                 );
    //             });
    //         }
    //     } catch (err) {
    //         console.log('error :', err);
    //         setAd({...ad, uploading: false});
    //     }
    // };

    const handleUpload = async (e) => {
        try {
            let files = e.target.files;
            files = [...files];
            if (files?.length) {
                setAd({...ad, uploading: true});
                const updates = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    try {
                        const uri = await resizeImage(file);
                        const {data} = await axios.post("/upload-image", {image: uri});
                        updates.push(data);
                    } catch (e) {
                        console.log(`Error uploading file ${file.name}:`, e);
                    }
                }
                setAd(prev => ({
                    ...prev,
                    photos: [...updates, ...prev.photos],
                    uploading: false
                }));
            }
        } catch (err) {
            console.log('Error:', err);
            setAd({...ad, uploading: false});
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
            setAd({...ad, uploading: true})
            const {data} = await axios.delete('/remove-image', {data: file});
            if (data?.ok) {
                setAd((prev) => ({
                    ...prev,
                    photos: prev.photos.filter((p) => p.Key !== file.Key),
                    uploading:false
                }))
            }
        } catch (err) {
            setAd({...ad, uploading: false})
        }
    }

    return (
        <Box display={'flex'}>
            <label className='btn btn-secondry mr-1'>
                {ad.uploading ? "processing..." : "Upload photos"}
                <input onChange={handleUpload} type='file' accept="image/*" multiple hidden/>
            </label>

            <Stack direction="row" spacing={2}>
                {ad.photos?.map((file,index) => (
                        <Avatar
                            key={index}
                            alt="Remy Sharp"
                            src={file?.Location}
                            sx={{width: 54, height: 50}}
                            className="mx-1"
                            variant="rounded"
                            onClick={() => handleDelete(file)}
                        />
                    )
                )}

            </Stack>

        </Box>
    )
}

export default ImageUpload;