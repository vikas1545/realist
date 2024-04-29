
import Resizer from "react-image-file-resizer";
import axios from "axios";
const ImageUpload = ({ad,setAd})=> {

    const handleUpload = async (e) => {
        try {
            let files = e.target.files;
            files = [...files];
            if (files?.length) {
                setAd({ ...ad, uploading: true });
                files.map((file) => {
                     new Promise(() => {
                        Resizer.imageFileResizer(
                            file,
                            1080,
                            720,
                            "JPEG",
                            100,
                            0,
                            async (uri) => {
                                try {
                                    const { data } = await axios.post("/upload-image", {
                                        image: uri
                                    });
                                    setAd(prev => ({
                                        ...prev,
                                        photos: [data, ...prev.photos],
                                        uploading: false
                                    }));
                                } catch (e) {
                                    console.log('error in image resize :',e);
                                    setAd({ ...ad, uploading: true });
                                }
                            },
                            "base64"
                        );
                    });
                });

                // Use Promise.all for mapping async operations
                // await Promise.all(files.map((file) => {
                //     return new Promise((resolve, reject) => {
                //         Resizer.imageFileResizer(
                //             file,
                //             1080,
                //             720,
                //             "JPEG",
                //             100,
                //             0,
                //             async (uri) => {
                //                 try {
                //                     const { data } = await axios.post("/upload-image", {
                //                         image: uri
                //                     });
                //                     resolve(data); // Resolve with uploaded data
                //                 } catch (e) {
                //                     reject(e); // Reject with error
                //                 }
                //             },
                //             "base64"
                //         );
                //     });
                // }));

                // Once all uploads are done
                setAd((prev) => ({
                    ...prev,
                    uploading: false
                }));
            }
        } catch (err) {
            console.log('error :', err);
            setAd({ ...ad, uploading: false });
        }
    };
    const handleDelete = async ()=> {
        try {
            setAd({...ad,uploading:true})
        }catch (err) {
            setAd({...ad,uploading:false})
        }
    }

    return(
        <label className='btn btn-secondry'>
            Upload photos
            <input onChange={handleUpload} type='file' accept="image/*" multiple hidden/>
        </label>
    )
}

export default ImageUpload;