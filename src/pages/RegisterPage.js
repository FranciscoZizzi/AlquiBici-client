import React, {useState} from 'react';
import axios from "axios";
import {SERVER_HOSTNAME, SERVER_PORT} from "../utils/constants";
import {useNavigate} from "react-router-dom";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!email || !username || !password) {
            alert("missing field");
            return;
        }
        axios.post('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + '/users/register', {email, username, password}).then(res => {
            if (res.data.success) {
                localStorage.setItem("email", email);
                navigate('/');
                window.location.reload();
            }
        }).catch(e => {
            alert(e);
        });
    }

    return(
        <div style={{
            marginLeft: "2.5%"
        }}>
            <h1>Register</h1>
            <form>
                <label>Email:</label><br></br>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/><br></br>
                <label>Name:</label><br></br>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/><br></br>
                <label>Password:</label><br></br>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/><br></br>
                <input type="submit" value="submit" onClick={handleSubmit}/>
            </form>
            <a href={'/login'}>Already have an account?</a>
        </div>
    )
}

export default RegisterPage;