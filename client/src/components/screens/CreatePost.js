import React, { useState,useEffect } from 'react'
import Axios from 'axios'
import M from 'materialize-css'
function CreatePost() {
    const [title,setTitle]=useState("")
    const [body,setBody]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
    useEffect(()=>{
        if(url){
            Axios.post("http://localhost:3001/createPost",{
                 title:title,
                 body:body,
                 photo:url
             },{
                 headers:{
                     'Content-Type': 'application/json',
                     "Authorization":"Bearer "+ localStorage.getItem("jwt")
                 }
             })
             .then((res)=>{
                 if(res.data){
                     M.toast({html: 'Post upoaded sucessfully !',classes:"#43a047 green darken-1"})
                 }
             })
             .catch((err)=>{
                 console.log(err)
                 M.toast({html:"Check ypur network or fields !",classes:"#c62828 red darken-3"})
             })
     }
    },[url])

    const UploadPost=()=>{
        const data =new FormData()
        data.append("file",image)
        data.append("upload_preset","devagram")
        data.append("cloud_name","devagram")
        Axios.post("https://api.cloudinary.com/v1_1/devagram/image/upload",data)
            .then((res)=>{
                console.log(res.data.url)
                setUrl(res.data.url)
                 
        })
        .catch((err)=>console.log(err));


        // Axios.post("http://localhost:3001/createPost",{
        //     title:title,
        //     body:body,
        //     photo:url
        // })
        // .then((res)=>{
        //     if(res.data){
        //         M.toast({html: 'Signed up sucessfully !',classes:"#43a047 green darken-1"})
        //     }
        // })
        // .catch((err)=>{
        //     M.toast({html:"All the fields are required !",classes:"#c62828 red darken-3"})
        // })
    }
    return (
        <div className="card input-field" style={{
            margin:"20px auto",
            maxWidth:"700px",
            padding:"50px",
            textAlign:"center",
        }}>
            <h3 className="post" >Create Post</h3>
            <input type="text" placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <input type="text" placeholder="body" value={body} onChange={(e)=>setBody(e.target.value)}/>
            <div className="file-field input-field" >
                <div className="btn #fb8c00 orange darken-1">
                    <span>File</span>
                    <input type="file"  onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
                <button className="btn waves-effect waves-light #fb8c00 orange darken-1" onClick={UploadPost} >
                    Create Post
                </button>
        </div>
    )
}

export default CreatePost
