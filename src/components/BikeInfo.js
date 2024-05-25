import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BASE_URL, PORT} from "../utils/constants";

const BikeInfo = ({bike}) => {
    const [bikeInfo, setBikeInfo] = useState({ownerName: "loading"});

    useEffect(() => {
        const getBikeData = async () => {
            let res = await axios.get(BASE_URL + ':' + PORT + `/bikes/get/${bike.id}`);
            setBikeInfo(res.data);
        }
        getBikeData().then(() => console.log(''));
    }, []);

    localStorage.getItem("email")

    const handleClick = () => {
        const bookBike = async () => {
            await axios.post(BASE_URL + ':' + PORT + '/rent', {email: localStorage.getItem("email"), bikeId: bike.id});
        }
        bookBike();
    }

    return(
        <div style={{
            borderRadius:15,
            width: "30%",
            paddingLeft: "1%",
            paddingBottom: "1%",
            backgroundColor: "lightgray",
            display:"inline-block",
        }}>
            <div>
                <h3>Owner: {bikeInfo.ownerName}</h3>
                <h4>Price: ${bike.price}/km</h4>
            </div>
            <div>
                <button onClick={handleClick}>Book</button>
            </div>
        </div>
    )
}

export default BikeInfo;