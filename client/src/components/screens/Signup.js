import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Axios from 'axios';
import M from 'materialize-css'
function Signup() {
    const history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const sendData = () => {//this is for authhentication of email id 
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: 'Invalid email id !', classes: "#c62828 red darken-3" });
            setName("")
            setEmail("")
            setPassword("")
            return;
        }
        Axios.post('http://localhost:3001/signup',
            {
                name: name,
                email: email,
                password: password
            })
            .then((res) => {
                if (res.data) {
                    M.toast({ html: 'Signed up sucessfully !', classes: "#43a047 green darken-1" })
                }
                console.log(res.data);
                history.push("/login")
            })
            .catch((err) => {
                M.toast({ html: 'Please enter all the fields!', classes: "#c62828 red darken-3" })

            })
        setName("")
        setEmail("")
        setPassword("")
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 style={{ fontFamily: "Grand Hotel, cursive " }}>Devagram</h2>
                <input type="text" placeholder="Enter your Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light #fb8c00 orange darken-1" onClick={sendData} >
                    Signup
                </button>
                <p>
                    <Link to="/login">Already have an account ?</Link>
                </p>
            </div>

        </div>
    )
}

export default Signup