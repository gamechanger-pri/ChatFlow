import React, { useEffect } from 'react'

import {user} from "../Join/Join";

import socketIo from "socket.io-client";
import "./Chat.css";
import sendlogo from "../../images/send.png";

const ENDPOINT="http://localhost:4500/";




const Chat = () => {

  const socket=socketIo(ENDPOINT,{ transports:['websocket'] });
  
useEffect(() => {
  socket.on('connect',()=>{
    alert("connected");
   })
  socket.emit('joined',{user})

  socket.on('welcome',(data)=>{
    console.log(data.user,data.message);
  })

socket.on('user joined',(data)=>{
  console.log(data.user,data.message);
})

  return () => {
    socket.emit('disconnect',()=>{
      
    })
    socket.off();
  }
}, [])

 
 
 
   
 
 

  return (
    <div className="chatPage">
        <div className='chatContainer'>
            <div className='header'></div>
            <div className='chatBox'></div>
            <div className='inputBox'>
              <input type="text" id="chatInput" />
              <button className='sendbtn'><img src={sendlogo} alt="Send" /> </button>
            </div>
        </div>
    </div>
  )
}

export default Chat