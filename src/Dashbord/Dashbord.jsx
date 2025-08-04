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
      if (/android|iphone|ipad|mobile/i.test(userAgent) || window.innerWidth < 768) {
        setismobile(true);
      } else {
        setismobile(false);
      }
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (ismobile) {
    return (
      <>
        <div className='max-w-full h-screen grid justify-center items-center '>
          <div className='max-w-[95%] mx-auto p-4 bg-whitesmoke shadow-sm'>
             <div className='max-w-[90%] mx-auto justify-center items-center'>
            <img src={logo} alt='logo'/>
          </div>
            <h1 className='text-red-500 text-xl mt-4 text-center font-semibold'>This website is not available on mobile.Please use a desktop device.</h1>
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <Navbar />
      <Filter />
      <Topheadlines />

    </>
  )
}

export default Dashbord