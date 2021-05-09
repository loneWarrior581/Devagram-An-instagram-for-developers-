import React, { useEffect, useState, useContext } from 'react'
import Axios from 'axios'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
const UserPorfile = () => {

    const [userProfile, setUserProfile] = useState(null)
    const [pics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [follow, setFollow] = useState(state ? !state.following.includes(userid) : true) // this solves the issue for the local state for follow/unfollow button

    useEffect(() => {
        fetch(`http://localhost:3001/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)

                setUserProfile({ ...result })
            })
    }, [userProfile])


    const followUser = () => {
        fetch("http://localhost:3001/follow", {
            method: "put",
            headers: {
                "Content-type": "Application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                // setUserProfile((prevState) => {
                //     return {
                //         ...prevState,
                //         user: {
                //             ...prevState.user,
                //             followers: [...prevState.user[0].followers, data._id]
                //         }
                //     }
                // })
                setFollow(false)
            })
    }

    const unfollowUser = () => {
        fetch("http://localhost:3001/unfollow", {
            method: "put",
            headers: {
                "Content-type": "Application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                // setUserProfile((prevState) => {
                //     return {
                //         ...prevState,
                //         user: {
                //             ...prevState.user,
                //             followers: [...prevState.user[0].followers, data._id]
                //         }
                //     }
                // })
                setFollow(true)
            })
    }

    return (
        <>
            {
                userProfile
                    ?
                    <div style={{ maxWidth: "800px", margin: "0px auto" }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-around",
                            margin: "25px auto",
                            borderBottom: "2px solid grey",

                        }}>
                            <div>
                                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src="https://images.unsplash.com/photo-1547624643-3bf761b09502?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60" />
                            </div>
                            <div>
                                {/* <h4>{state ? state.name : null} </h4> */}
                                <h4>{userProfile.user[0].name} </h4>
                                <h5>{userProfile.user[0].email}</h5>
                                <div style={{ display: "flex", justifyContent: "space-between", width: "109%" }} >
                                    <p>{userProfile.posts.length} <b>Posts</b></p>
                                    <p>{userProfile.user[0].followers.length} <b>Followers</b></p>
                                    <p>{userProfile.user[0].following.length} <b>Following</b></p>
                                </div>
                                {
                                    follow
                                        ?
                                        <button className="btn waves-effect waves-light #fb8c00 orange darken-1" onClick={() => followUser()} >
                                            Follow
                                        </button>
                                        :
                                        <button className="btn waves-effect waves-light #fb8c00 orange darken-1" onClick={() => unfollowUser()} >
                                            UnFollow
                                        </button>

                                }
                            </div>
                        </div>
                        <div className="gallery" >
                            {
                                userProfile.posts.map(item => {
                                    return (
                                        <img key={item._id} className="item" src={item.photo} alt={item.title} />
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    <h2>Loading.... </h2>
            }
        </>


    )
}

export default UserPorfile
