import React, {useState} from 'react';
import axios from "axios";
import {SERVER_HOSTNAME, SERVER_PORT} from "../utils/constants";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    let navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + "/users/login", {email: email, password: password}).then(res => {
            if (res.data.success) {
                localStorage.setItem("email", res.data.email);
                navigate('/');
                window.location.reload();
            }
        }).catch(e => {
            alert(e);
        });
    }

    return(
        <div style={{
            marginLeft:"2.5%"
        }}>
            <h1>Login</h1>
            <form>
                <label>Email:</label><br></br>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/><br></br>
                <label>Password:</label><br></br>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/><br></br>
                <input type="submit" value="submit" onClick={handleSubmit}/>
            </form>
        </div>
    )
}

export default LoginPage;