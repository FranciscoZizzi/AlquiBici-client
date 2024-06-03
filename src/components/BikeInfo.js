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
        getBikeData().then(() => console.log('bikeData obtained :D'));
    }, [update]);

    const handleBookClick = () => {
        let email = localStorage.getItem("email");
        axios.post('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + '/bikes/rent', {email: email, bikeId: bike.id}).then(res => {
            setUpdate(!update);
            client.publish('alquibici/' + bike.id + '/rent-status', 'rent');
            alert(res.data.message);
        }).catch(e => {
            setUpdate(!update);
            alert(e.response.data.message);
        });
    }

    const handleReturnClick = () => {
        client.subscribe("alquibici/" + bike.id + "/return");
        axios.post('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + '/bikes/return', {bikeId: bike.id})
            .then(() => {
                setUpdate(!update);
                client.publish('alquibici/' + bike.id + '/rent-status', 'return');
                alert("successfully returned");
            })
            .catch((e) => {
                setUpdate(!update);
                alert(e.response.data.message);
            });
        client.on("message", (topic, message) => {
            if (topic === 'alquibici/' + bike.id + '/return') {
                let json = toJson(message);
                console.log(JSON.stringify(json))
                const modifyBalance = async () => {
                    let bikeRes = await axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/bikes/get/${bike.id}`).catch((e) => console.log("error"));
                    let price = bikeRes.data.price
                    let funds = json.distance * price / 1000;
                    await axios.post('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + '/users/add-funds', {email: localStorage.getItem("email"), funds: -funds});
                }
                modifyBalance();
            }
        });
    }

    const toJson = (byteArray) => {
        let jsonString = Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
        console.log(jsonString)
        return JSON.parse(jsonString);
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
                <span onClick={handleTitleClick}><h3>Owner: {bikeInfo.ownerName}</h3></span>
                <h4>Price: ${bike.price}/km</h4>
            </div>
            <div>
                {bikeInfo.rented ? <div></div> : <button onClick={handleBookClick}>Book</button>}
                {bikeInfo.renterEmail === localStorage.getItem("email") ? <button onClick={handleReturnClick}>Return</button> : <div></div>}
            </div>
        </div>
    );
}

export default BikeInfo;