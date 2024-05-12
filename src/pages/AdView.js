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
            {/*<div className='container' style={{display: "flex", flexDirection: "column", alignItems: "start"}}>*/}

            {/*    <button className='btn btn-primary disabled mt-2'>{ad?.type} for {ad?.action}</button>*/}
            {/*    <h2>{ad?.address}</h2>*/}
            {/*</div>*/}

            <Flex>
                <div className='container' style={{display: "flex", flexDirection: "column"}}>

                    <button className='btn btn-primary disabled mt-2'>{ad?.type} for {ad?.action}</button>
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
        </>


    )
}
export default AdView;