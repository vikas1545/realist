import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Image, List, Card, Flex} from 'antd';
import {Box, Typography} from "@mui/material";
import {IoBedOutline} from "react-icons/io5";
import {TbBath} from "react-icons/tb";
import {BiArea} from "react-icons/bi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LikeUnlike from "../components/misc/LikeUnlike";
import Map from "../components/misc/Map";

dayjs.extend(relativeTime);// fromNow()
const AdView = () => {
    const params = useParams();
    const [ad, setAd] = useState({});
    const [related, setRelated] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (params?.slug) {
            fetchAd()
        }
    }, [params?.slug]);

    const fetchAd = async () => {
        setLoading(true)
        try {
            const {data} = await axios.get(`/ad/${params?.slug}`)
            setAd(data?.ad);
            setRelated(data?.related)
        } catch
            (e) {
            console.log("err :", e)
        }
        setLoading(false)
    }

    return (
        <>

            <Flex>{console.log('ad :', ad)}
                <div className='container' style={{display: "flex", flexDirection: "column"}}>
                    <Flex justify='space-between' style={{marginBottom: 5}}>
                        <button className='btn btn-primary disabled mt-2'>{ad?.type} for {ad?.action}</button>
                        {/*<button className='btn btn-primary disabled mt-2'>{ad?.type}</button>*/}
                        <LikeUnlike ad={ad}/>
                    </Flex>

                    <h3>{ad?.address}</h3>

                    <Typography variant="body2" color="text.secondary">
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                            {ad?.bedrooms ? (
                                <span><IoBedOutline/> {ad?.bedrooms}</span>
                            ) : ""}
                            {ad?.bathrooms ? (
                                <span><TbBath/> {ad?.bathrooms}</span>
                            ) : ""}
                            {ad?.landsize ? (
                                <span><BiArea/> {ad?.landsize}</span>
                            ) : ""}

                        </Box>
                    </Typography>

                    <Typography gutterBottom variant="h5" component="div">
                        Rs : {ad?.price?.toLocaleString('en-IN')}
                    </Typography>

                    <Typography gutterBottom variant="p" component="div" color="text.secondary">
                        {dayjs(ad?.createdAt).fromNow()}
                    </Typography>
                </div>

                <div className='container'>
                    <List
                        loading={loading}
                        dataSource={ad?.photos}
                        grid={{xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3}}
                        renderItem={(item, index) => (
                            <List.Item key={index}>
                                <Card style={{height: '100%', margin: '5px'}}>
                                    <Image src={item.Location} style={{height: '100%', objectFit: 'cover'}}/>
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
            </Flex>


            <div className='container mb-5'>
                <div className='row'>
                    <div className='col-lg-8 offset-lg-2 mt-3'>

                        <Map latitude={Number(ad?.location?.coordinates?.[1])}
                             longitude={Number(ad?.location?.coordinates?.[0])}/>
                        <br/>
                        <h5>{ad?.type} in {ad?.address} for {ad?.action} ${ad?.price}</h5>
                        <hr/>
                        <h3 className='fw-bold'>{ad?.title}</h3>
                        <p className='lead'>{ad?.description}</p>
                    </div>
                </div>

            </div>

            <div className='container-fluid'>
                    <h3 className='d-flex justify-content-center'>Related Ads</h3>
                <List
                    loading={loading}
                    dataSource={related[0]?.photos}
                    grid={{xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3}}
                    renderItem={(item, index) => (
                        <List.Item key={index}>
                            <Card style={{height: '100%', margin: '5px'}}>
                                <Image src={item.Location} style={{height: '100%', objectFit: 'cover'}}/>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        </>


    )
}
export default AdView;