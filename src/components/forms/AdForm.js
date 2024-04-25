import {useState} from "react";
import axios from "axios";
import {debounce} from 'lodash';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CurrencyInput from "react-currency-input-field";

const accessToken = "pk.4f296a23888f1a1ab6eab41fe94fcbaf";
const AdForm = ({action, type}) => {
    const [ad, setAd] = useState({
        photos: [],
        uploading: false,
        price: "",
        address: "",
        bathrooms: "",
        bedrooms:"",
        carpark: "",
        landsize: "",
        type: "",
        title: "",
        description: "",
        loading: false
    })

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);


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
        setAd({...ad, address: value?.display_name || ''})
    };


    return (
        <div>
            <p>This ad create form</p>
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

            <button className="btn btn-primary">Submit</button>
            <pre>
                {JSON.stringify(ad, null, 4)}
            </pre>
        </div>
    )
}

export default AdForm;