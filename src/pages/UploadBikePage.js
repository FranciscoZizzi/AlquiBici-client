import React, {useEffect, useState} from 'react';
import axios from "axios";
import {SERVER_HOSTNAME, SERVER_PORT} from "../utils/constants";

const UploadBikePage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [bikeId, setBikeId] = useState("");
    const [price, setPrice] = useState();

    useEffect(() => {
        axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/users/get/${localStorage.getItem("email")}`).then(res => setIsAdmin(res.data.isAdmin));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!bikeId || !price) {
            alert("missing field");
        }
        axios.post('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + '/bikes/create', {bikeId: bikeId, price: price, ownerEmail: localStorage.getItem("email")}).then(() => {
            alert("bike uploaded");
            setBikeId("");
            setPrice(undefined);
        });
    }

    if (isAdmin) {
        return (
            <div style={{margin:"5%"}}>
                <h1>Upload Bike</h1>
                <form>
                    <label>Set Bike Id:</label><br></br>
                    <input type="text" value={bikeId} onChange={e => setBikeId(e.target.value)}/><br></br>
                    <label>Set Price/km:</label><br></br>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)}/>
                    <label> /km</label><br></br>
                    <input type="submit" onClick={handleSubmit}/>
                </form>
            </div>
        );
    }
}

export default UploadBikePage;