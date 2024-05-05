import {useState} from "react";
import {debounce} from 'lodash';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CurrencyInput from "react-currency-input-field";
import ImageUpload from "./ImageUpload";
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const AdForm = ({action, type}) => {
    const [ad, setAd] = useState({
        photos: [],
        uploading: false,
        price: "",
        address: "",
        bathrooms: "",
        bedrooms: "",
        carpark: "",
        landsize: "",
        title: "",
        description: "",
        loading: false,
        action,
        type,
        coordinates:{}
    })

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const navigate = useNavigate();
    const debouncedHandleChange = debounce(async (inputValue) => {
        if (inputValue.length > 3) {
            setLoading(true);
            const headers = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            };

            try {
                const response = await fetch(
                    `https://us1.locationiq.com/v1/autocomplete?key=pk.4f296a23888f1a1ab6eab41fe94fcbaf&q=${inputValue}&limit=5&dedupe=1`,
                    headers
                );

                const data = await response.json();
                console.log('data found :', data)

                setOptions(data);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        } else {
            //setOptions([]);
        }
    }, 3000);

    const handleChange = async (event, value) => {
        console.log('value :', value)
        //setQuery(value);
        setSelectedLocation(value);
        console.log('ad :', ad)
        setAd({...ad, address: value?.display_name || '', coordinates: {lat: value?.lat || '', lon: value?.lon || ''}})
    };

    const handleClick = async () => {
        try {
            setAd({...ad, loading: true})
            const {data} = await axios.post('/create', ad);
            console.log('ad create response', data)
            if (data?.error) {
                toast.error(data.error);
                setAd({...ad, loading: false})
            } else {
                toast.success('Ad created successfully');
                setAd({...ad, loading: false})
                //navigate("/dashboard")
            }
        } catch (err) {
            console.log('error :', err)
        }
    }


    return (
        <div>
            <div className="mb-2 form-control">
                <ImageUpload ad={ad} setAd={setAd}/>
            </div>
            <div className="mb-3 form-control">
                <Autocomplete
                    value={selectedLocation}
                    onChange={handleChange}
                    onInputChange={(event, newInputValue) => {
                        debouncedHandleChange(newInputValue);
                    }}
                    options={options}
                    getOptionLabel={(option) => option.display_name}
                    loading={loading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Location"
                            variant="outlined"
                        />
                    )}
                />
            </div>
            <CurrencyInput
                placeholder="Enter price"
                defaultValue={ad.price}
                className="form-control mb-3"
                onValueChange={(value) => {
                    setAd({...ad, price: value})
                }}
            />
            <input
                type="number"
                min="0"
                className="form-control mb-3"
                placeholder="Enter how many bedrooms"
                value={ad.bedrooms}
                onChange={(e) => {
                    setAd({...ad, bedrooms: e.target.value})
                }}
            />
            <input
                type="number"
                min="0"
                className="form-control mb-3"
                placeholder="Enter how many bathrooms"
                value={ad.bathrooms}
                onChange={(e) => {
                    setAd({...ad, bathrooms: e.target.value})
                }}
            />
            <input
                type="number"
                min="0"
                className="form-control mb-3"
                placeholder="Enter how many carparks"
                value={ad.carpark}
                onChange={(e) => {
                    setAd({...ad, carpark: e.target.value})
                }}
            />

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter size of land"
                value={ad.landsize}
                onChange={(e) => {
                    setAd({...ad, landsize: e.target.value})
                }}
            />

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter title"
                value={ad.title}
                onChange={(e) => {
                    setAd({...ad, title: e.target.value})
                }}
            />

            <textarea
                className="form-control mb-3"
                placeholder="Enter description"
                value={ad.description}
                onChange={(e) => {
                    setAd({...ad, description: e.target.value})
                }}
            />

            <button className="btn btn-primary" onClick={handleClick}>Submit</button>
            <pre>
                {JSON.stringify(ad, null, 4)}
            </pre>
        </div>
    )
}

export default AdForm;