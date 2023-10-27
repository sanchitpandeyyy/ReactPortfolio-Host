import React from 'react'
import Fade from 'react-reveal/Fade';
import UI from "../../img/uiux.jpg";
import Graphics from "../../img/graphics.jpg";
import Web from "../../img/web.jpg";

const skill = () => {
  return (

    <section id='about' className=" gap-1 overflow-hidden w-screen flex flex-col text-center my-0 mx-auto">
      <Fade left> 
       <span className=''>About Me</span><br/>
       <span className='text-7xl font-black'>What I do</span><br/>
       <span className='px-12 py-2' >Namaste! I'm Sanchit Pandey a skilled Front-End Developer, transforming designs into captivating web experiences. Proficient in HTML, CSS, JavaScript, React and Tailwind, I merge aesthetics with functionality to craft user-centric sites. Let's create a digital masterpiece together! </span>


       <div className="mt-7 gap-6 flex flex-col items-center">



       <div className= " cursor-pointer gap-4 flex justify-center items-center bg-blue-950 w-96 h-20 rounded-full hover:bg-yellow-600 ">
        <img className="h-14 w-14 rounded-full" src={Graphics} alt='' />
        <div className="">
            <h2 className='text-2xl font-bold'>Graphics Design</h2>
            <p className=' font-medium '>रंगिन अनुभव प्रदान गर्दै</p>
        </div>
       </div>


       <div className="cursor-pointer gap-4 flex justify-center items-center bg-blue-950 w-96 h-20 rounded-full hover:bg-yellow-600">
        <img className="h-14 w-14 rounded-full" src={UI} alt='' />
        <div className="">
            <h2 className='text-2xl font-bold'>UI/UX Design</h2>
            <p className=' font-medium '>रंग र रूपले नयाँ कथा बोलाउँदै</p>
        </div>
       </div>



       <div className="cursor-pointer gap-4 flex justify-center items-center bg-blue-950 w-96 h-20 rounded-full hover:bg-yellow-600">
        <img className="h-14 w-14 rounded-full" src={Web} alt='' />
        <div className="">
            <h2 className='text-2xl font-bold'>Web Development</h2>
            <p className=' font-medium '>वेब विकासमा भविष्य निर्माण गर्दै |</p>
        </div>
       </div>



      </div>
       </Fade>
    </section>
  )
}

export default skill;