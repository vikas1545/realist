import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Auth";
import axios from "axios";
import AdCard from "../components/cards/AdCard";

const Home = () => {
    const [auth, setAuth] = useAuth();
    const [adsForSell, setAdsforSell] = useState([]);
    const [adsForRent, setAdsforRent] = useState([]);

    const fetchAds = async () => {
        try {
            const { data } = await axios.get('ads');
            console.log('Data from API:', data);
            setAdsforRent(data?.adsForRent);
            setAdsforSell(data?.adsForSell);
        } catch (err) {
            console.log('Error fetching ads:', err);
        }
    }

    useEffect(() => {
        fetchAds();
    }, []);

    console.log('Ads for sell:', adsForSell); // Logging adsForSell to ensure it's populated

    return (
        <div>
            <h1 className="display-1 bg-primary text-light p-5">For Sell</h1>
            <div className='display-1 bg-primary-text-light p5'>
                <div className='container '>
                    <div className='row'>
                        {adsForSell?.length > 0 && adsForSell.map(ad => (
                            <AdCard ad={ad} key={ad._id}/>
                        ))}
                    </div>
                </div>
            </div>

            <h1 className="display-1 bg-primary text-light p-5">For Rent</h1>
            <div className='display-1 bg-primary-text-light p5'>
                <div className='container '>
                    <div className='row'>
                        {adsForRent?.length > 0 && adsForRent.map(ad => (
                            <AdCard ad={ad} key={ad._id}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
