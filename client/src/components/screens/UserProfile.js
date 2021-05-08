import React, { useEffect, useState, useContext } from 'react'
import Axios from 'axios'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
const UserPorfile = () => {

    const [userProfile, setUserProfile] = useState(null)
    const [pics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()

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
    }, [])


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
                                    <p>40 <b>Posts</b></p>
                                    <p>30 <b>Followers</b></p>
                                    <p>140 <b>Following</b></p>
                                </div>
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
