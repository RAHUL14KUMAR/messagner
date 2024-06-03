import React, { useEffect } from 'react'
import Text from './Login/TextField'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        const a=  JSON.parse(localStorage.getItem("user"))

        if(!a){
            alert("you are not logged in")
            navigate('/login');
            return;
        }
    },[])
  return (
    <div>
      <h1>you are in home</h1>
    </div>
  )
}

export default Home
