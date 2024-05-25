import React, {useState} from 'react';

const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(email + password)
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