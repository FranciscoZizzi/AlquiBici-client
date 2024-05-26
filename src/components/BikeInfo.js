import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BASE_URL, PORT} from "../utils/constants";

const BikeInfo = ({bike}) => {
    const [bikeInfo, setBikeInfo] = useState({ownerName: "loading", rented: true, renterEmail: ""});

    useEffect(() => {
        const getBikeData = async () => {
            let res = await axios.get(BASE_URL + ':' + PORT + `/bikes/get/${bike.id}`);
            setBikeInfo(res.data);
        }
        getBikeData().then(() => console.log('bikeData obtained :D'));
    }, []);

    const handleBookClick = () => {
        let email = localStorage.getItem("email");
        axios.post(BASE_URL + ':' + PORT + '/bikes/rent', {email: email, bikeId: bike.id}).then(res => {
            alert(res.data.message);
        }).catch(e => {
            alert(e.response.data.message);
        });
    }

    const handleReturnClick = () => {
        axios.post(BASE_URL + ':' + PORT + '/bikes/return', {bikeId: bike.id})
            .then(() => alert("successfully returned"))
            .catch((e) => alert(e.response.data.message));
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
                {bikeInfo.rented ? <div></div> : <button onClick={handleBookClick}>Book</button>}
                {bikeInfo.renterEmail === localStorage.getItem("email") ? <button onClick={handleReturnClick}>Return</button> : <div></div>}
            </div>
        </div>
    )
}

export default BikeInfo;