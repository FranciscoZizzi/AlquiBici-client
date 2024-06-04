import React, {useEffect, useState} from 'react';
import axios from "axios";
import {SERVER_HOSTNAME, SERVER_PORT} from "../utils/constants";
import {useNavigate} from "react-router-dom";

const BikeInfo = ({bike, client}) => {
    const [bikeInfo, setBikeInfo] = useState({ownerName: "loading", rented: true, renterEmail: ""});
    const [update, setUpdate] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const getBikeData = async () => {
            let res = await axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/bikes/get/${bike.id}`);
            setBikeInfo(res.data);
        }
        getBikeData().then(() => console.log('bikeData obtained'));
    }, [update]);

    const handleBookClick = () => {
        let email = localStorage.getItem("email");
        axios.post('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + '/bikes/rent', {email: email, bikeId: bike.id}).then(res => {
            setUpdate(!update);
            axios.get("http://" + SERVER_HOSTNAME + ":" + SERVER_PORT + `/users/get/${email}`).then(res => {
                let balance = res.data.balance;
                let price = bike.price;
                client.publish('alquibici/' + bike.id + '/rentstatus', `rent ${1000 * balance/price}`);
            })
            alert(res.data.message);
        }).catch(e => {
            setUpdate(!update);
            alert(e.response.data.message);
        });
    }

    const handleTitleClick = () => {
        navigate(`map/${bike.id}`);
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
                <span onClick={handleTitleClick} style={{cursor:"pointer"}}><h3>Owner: {bikeInfo.ownerName}</h3></span>
                <h4>Price: ${bike.price}/km</h4>
            </div>
            <div>
                {bikeInfo.rented ? <div></div> : <button onClick={handleBookClick}>Book</button>}
            </div>
        </div>
    );
}

export default BikeInfo;