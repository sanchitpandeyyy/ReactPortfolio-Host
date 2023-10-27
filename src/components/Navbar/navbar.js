import React from 'react';
import './nav.css';
import logo from '../../img/logoo.png';
import contactimg from '../../img/contact1.png';
import { Link } from 'react-scroll';



import { useState } from "react";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div id='nav' className=" h-20 w-screen py-4 px-8 flex  justify-between sticky top-0 z-10">
   <Link to="intro" spy={true} smooth={true} offset={-100} duration={500} className='cursor-pointer'> <img src={logo} alt='logo' className=' w-12 h-12'/></Link>
      <nav>
        <section className="MOBILE-MENU flex lg:hidden">
          <div
            className="HAMBURGER-ICON space-y-2"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <span className="block h-0.5 w-8 animate-pulse bg-white"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-white"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-white"></span>
          </div>

          <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
            <div
              className="absolute top-0 right-0 px-8 py-8"
              onClick={() => setIsNavOpen(false)}
            >
              <svg
                className="h-8 w-8 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            
            <Link activeClass="active" to="intro" spy={true} smooth={true} offset={-100} duration={500} className='hover:text-yellow-400 font-black  text-black  cursor-pointer'>Home</Link>
          <Link activeClass="active" to="about" spy={true} smooth={true} offset={-100} duration={500} className='hover:text-yellow-400 font-black text-black  cursor-pointer'>About</Link>           
          <Link activeClass="active" to="skill" spy={true} smooth={true} offset={-100} duration={500} className='hover:text-yellow-400 font-black text-black  cursor-pointer'>Skills</Link>
           
           <Link activeClass="bg-blue-600" to="contact" spy={true} smooth={true} offset={-100} duration={500} className="bg-yellow-500 hover:bg-blue-600 hover:text-white text-white font-black   flex justify-between items-center py-0 px-3 h-12 rounded-full cursor-pointer ">
        <img src={contactimg} alt='' className='h-6 w-6 m-2 rounded-full'/> <p className='w-28 font-semibold   '> Contact Me </p>
       </Link>
          </div>
        </section>

        <div className="DESKTOP-MENU hidden items-center space-x-44  lg:flex ">
        
           <Link activeClass="active" to="intro" spy={true} smooth={true} offset={-100} duration={500} className=' hover:text-yellow-400 font-black  cursor-pointer mr-5'>Home</Link>
           <Link activeClass="active" to="about" spy={true} smooth={true} offset={-80} duration={500} className=' hover:text-yellow-400 font-black   cursor-pointer mr-5'>About</Link>
           <Link activeClass="active" to="skill" spy={true} smooth={true} offset={-80} duration={500} className='  hover:text-yellow-400 font-black  cursor-pointer mr-5'>Skills</Link>
           
          
           <Link activeClass="bg-yellow-400" to="contact" spy={true} smooth={true} offset={-80} duration={500} className="bg-white hover:bg-yellow-500 text-black font-black   flex justify-between items-center py-0 px-3 h-12 rounded-full cursor-pointer">
        <img src={contactimg} alt='' className='h-6 w-6 m-2 rounded-full '/> <p className='w-28'> Contact Me </p>
       </Link>
        </div>
      
      </nav>
    
    

    </div>
  );
}