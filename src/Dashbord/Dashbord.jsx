import React from 'react'
import { useState, useEffect } from 'react'
import Navbar from '../Components/Navbar'
import Filter from '../Components/Filter'
import Topheadlines from '../Components/Topheadlines'
import logo from '../assets/rytlogo.png'


const Dashbord = () => {

  const [ismobile, setismobile] = useState(false)

 useEffect(() => {
  const checkMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android|iphone|ipad|ipod/i.test(userAgent)) {
      setismobile(true);
    } else {
      setismobile(false);
    }
  };

  checkMobile();
}, []);


  if (ismobile) {
    return (
      <>
        <div className="w-screen h-screen overflow-hidden bg-white flex flex-col justify-center items-center px-4">
          <img src={logo} alt="logo" className="w-32 h-auto mb-6" />
          <h1 className="text-red-500 text-xl text-center font-semibold">
            This website is not available on mobile.<br />Please use a desktop device.
          </h1>
        </div>
      </>
    )
  }
  return (
    <>
    <div className='w-full px-4 mx-auto'>
      <Navbar />
      <Filter />
      <Topheadlines />
    </div>
      
    </>
  )
}

export default Dashbord