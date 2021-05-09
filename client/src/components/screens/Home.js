import React, { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import { UserContext } from '../../App'
import { BsHeartFill } from "react-icons/bs"
import { BsHeart } from "react-icons/bs"
import { FaRegCommentAlt } from "react-icons/fa"
import { AiOutlineDelete } from "react-icons/ai"
import { Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { Link } from 'react-router-dom'

function Home() {
    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
    const { state, dispatch } = useContext(UserContext)
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    useEffect(() => {
        Axios.get('http://localhost:3001/allPost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then((result) => {
                setData(result.data)
                // console.log(result, "is result")
            })
            .catch((err) => {
                console.log(err)
            })
    }, [data])

    const likePost = (id) => {
        Axios.put('http://localhost:3001/like', {
            postId: id
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then((result) => {
                console.log(result, "and")
                const newData = data.map((item) => {
                    console.log(item, "is item")
                    if (item._id == result.data._id) {
                        return result.data
                    } else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const unlikePost = (id) => {
        Axios.put('http://localhost:3001/unlike', {
            postId: id
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then((result) => {
                const newData = data.map((item) => {
                    console.log(item, "is item")
                    if (item._id == result.data._id) {
                        return result.data
                    } else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        Axios.put('http://localhost:3001/comment', {
            text: text,
            postId: postId
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then((result) => {
                console.log(result)
            })
            .catch((err) => console.log(err))
        console.log(text, postId)
    }

    const deletePost = (postid) => {
        Axios.delete(`http://localhost:3001/deletepost/${postid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then((result) => {
                setOpen(true)
                console.log(result, "is the deleted post for the same ")
                const newData = data.filter(item => {
                    return item._id !== result.data.message._id
                })
                setData(newData);
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className="home-feed">
            {
                data.map((item) => {
                    return (
                        <div key={item._id} className="card home-card">
                            <img
                                style={{
                                    border: "2px solid black",
                                    maxWidth: "50px",
                                    height: "50px",
                                    borderRadius: "60%",
                                    margin: "5px 10px"
                                }} src="https://images.unsplash.com/photo-1541647376583-8934aaf3448a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"
                            />
                            <h5 style={{
                                display: "inline-block",
                                margin: "4px 0px"
                            }}>
                                <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>
                                    {item.postedBy.name}
                                </Link>
                            </h5>

                            {item.postedBy._id == state._id && <AiOutlineDelete style={{ float: "right", height: "40px", width: "40px", color: "red" }} onClick={() => deletePost(item._id)} />}
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                {
                                    item.like.includes(state._id)
                                        ?
                                        <BsHeartFill style={{ color: "red" }} onClick={() => { unlikePost(item._id) }} />
                                        :
                                        <BsHeart onClick={() => { likePost(item._id) }} />
                                }
                                <FaRegCommentAlt style={{ color: "green" }} />
                                <p>{item.like.length} Likes </p>
                                <h6>{item.title} </h6>
                                <p>{item.body} </p>
                                {
                                    item.comment.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: '700' }}>{record.postedBy.name} </span> {record.text} </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    const text = e.target[0].value;
                                    e.target[0].value = "";
                                    makeComment(text, item._id)
                                }}>
                                    <input placeholder="add a comment" type="text" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={"success"}>
                    {
                        "Post Deleted Sucessfully 🎉🎉"
                    }

                </Alert>
            </Snackbar>

        </div>
    )
}

export default Home

// 
// body: "This is the body for the post "
// photo: "http://res.cloudinary.com/devagram/image/upload/v1603657005/iybpbtwkvc2kkylnvgce.png"
// postedBy: {_id: "5f9595756a99ae15f0d86798", name: "uttkarsh"}
// title: "some title "
// __v: 0
// _id: "5f95dd2effffad33c87cfad2"