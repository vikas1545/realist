import {useState} from "react";
import axios from "axios";
//import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {debounce} from 'lodash';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {CircularProgress} from "@mui/material";

//const GOOGLE_PLACES_KEY = "";
const accessToken = "pk.4f296a23888f1a1ab6eab41fe94fcbaf";
const AdForm = ({action, type}) => {
    const [ad, setAd] = useState({
        photos: [],
        uploading: false,
        price: "",
        address: "",
        bathrooms: "",
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
            setOptions([]);
        }
    }, 3000);

    const handleChange = async (event, value) => {
        console.log('value :', value)
        //setQuery(value);
         setSelectedLocation(value)
    };


    return (
        <>
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

            <p>{selectedLocation && selectedLocation.display_name}</p>
        </>
    )
}

export default AdForm;