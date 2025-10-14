import React from 'react';
import rytlogo from '../assets/rytlogo.png';

const Navbar = () => {
  return (
    <>
      <div className=" max-w-full">
        <div className="max-w-full h-[115px]  mx-auto px-25 py-[25px] flex justify-between items-center">
          <div className="w-[142px] h-[42px]">
            <img src={rytlogo} alt="logonotfound" />
          </div>
          <div className="w-[135px] h-[65px] grid gap-[5px]">
            <div>
              <button className="bg-[#7E3AF2] px-5 py-2.5 border-none rounded-md text-white">Log out</button>
            </div>
            <div>
              {' '}
              <p className="">lalman.gmailcom</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
