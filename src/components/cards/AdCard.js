import {Box, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {IoBedOutline} from "react-icons/io5";
import {TbBath} from "react-icons/tb";
import {BiArea} from "react-icons/bi";
import {Badge, Space} from 'antd';
import {Link} from "react-router-dom";

const AdCard = ({ad}) => {

    return (
        <Badge.Ribbon text={`${ad?.type} for ${ad?.action}`} color={ad?.action === 'Sell' ? "blue" : 'red'}>
            <Link to={`/ad/${ad.slug}`}>
                <Card sx={{width: 345, margin: '15px'}} className='hoverable'>
                    <CardMedia
                        sx={{height: 140}}
                        alt={`{ad?.type}-{ad?.address}-{ad?.action}-{ad?.price}`}
                        image={ad?.photos?.[0].Location}
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {ad?.price.toLocaleString('en-IN')}
                        </Typography>
                        <Typography component="p" variant="body2" color="text.secondary"
                                    sx={{marginBottom: '10px', fontWeight: 500}}>
                            {ad?.address}
                        </Typography>
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

                    </CardContent>

                </Card>
            </Link>
        </Badge.Ribbon>
    )
}

export default AdCard;