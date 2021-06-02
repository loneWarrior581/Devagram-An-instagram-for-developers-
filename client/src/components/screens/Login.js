import React,{useState,useContext} from 'react'
import { Link ,useHistory} from 'react-router-dom'
import Axios from 'axios';
import M from 'materialize-css'
import {UserContext} from '../../App'
function Login() {
    const {state,dispatch} =useContext(UserContext)
    const history=useHistory()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const Login=()=>{//this is for authhentication of email id 
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:'Invalid email id !',classes:"#c62828 red darken-3"});
            setEmail("")
            setPassword("")
            return ;
        }
        Axios.post('http://localhost:3001/signin',
        {
            email:email,
            password:password
        })
        .then((res)=>{
            if(res.data){
                M.toast({html: 'Logged in sucessfully !',classes:"#43a047 green darken-1"})
                localStorage.setItem("jwt",res.data.token)
                localStorage.setItem("user",JSON.stringify(res.data.user))
                dispatch({type:"USER",payload:res.data.user}) //this has no use of today 
            }
            history.push("/")
            console.log(res.data);
        })
        .catch((err)=>{
            M.toast({html: 'Incorrect Email id or password !',classes:"#c62828 red darken-3"})
            console.log(err)

        })
        setEmail("")
        setPassword("")
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 style={{fontFamily:"Grand Hotel, cursive "}}>Devagram</h2>
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your Email"/>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password"/>
                <button className="btn waves-effect waves-light #fb8c00 orange darken-1" onClick={Login} >
                    Login
                </button>
                <p>
                    <Link to="/signup">Dont have account ?</Link>
                </p>
            </div>

        </div>
    )
}

export default Login
