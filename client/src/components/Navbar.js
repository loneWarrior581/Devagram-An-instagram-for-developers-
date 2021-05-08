import React, { useContext } from 'react'
import '../App.css'
import { UserContext } from '../App'
import { CgAddR } from "react-icons/cg"
import { FaRegUser } from "react-icons/fa"
import { RiUserAddLine } from "react-icons/ri"
import { FiLogOut, FiLogIn } from "react-icons/fi"
import { Link, useHistory } from 'react-router-dom' //this is for preventing the loading the page when we click the routers 
import { Avatar } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
function Navbar() {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  const renderList = () => {
    if (localStorage.getItem("user")) {
      return [
        <li key='home' className="homePage"><Link to="/"><HomeOutlinedIcon fontSize='large' /></Link></li>,
        <li key='createpost' className="addPost"><Link to="/createpost"><AddCircleOutlineOutlinedIcon fontSize={'large'} /></Link></li>,
        <li key='profile'><Link to="/profile"><FaRegUser style={{ width: "30px", height: "30px" }} /></Link></li>,
        <li key='profile'><Link to="/profile"><SettingsIcon /> </Link></li>,
        <li key='logout'>
          <FiLogOut style={{ width: "30px", height: "30px", color: "black" }} onClick={
            () => {
              localStorage.clear()
              dispatch({ type: "CLEAR" })
              history.push('/login')
            }
          } />

        </li>
      ]
    } else {
      return [
        <li key='signup'><Link to="/signup"><RiUserAddLine style={{ width: "30px", height: "30px", color: "black" }} /></Link></li>,
        <li key='login'><Link to="/login"><FiLogIn style={{ width: "30px", height: "30px", color: "black" }} /></Link></li>
      ]
    }
  }
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={localStorage.getItem("user") ? '/' : '/login'} className="brand-logo left" style={{ fontFamily: "Grand Hotel, cursive ", margin: '0px 15px' }}>Devegram</Link>
        <ul id="nav-mobile" className="right navbar">
          {renderList()}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
