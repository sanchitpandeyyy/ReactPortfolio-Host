import React from 'react'
import './skill.css'
import Fade from 'react-reveal/Fade';


const skill = () => {
  return (
 
    <section id='skill' className='gap-1 mt-3 overflow-hidden w-screen flex flex-col text-center my-0 mx-auto'>
         <Fade left>
       <span className='mt-5'>My Skills</span><br/>
       <span className='text-7xl font-black mb-5'>My Skills</span>
       <span className='px-12 py-2' >I own a diverse range of talents and expertise that I have developed over the years. From technical skills such as programming, and Web Development, to creative abilities like Graphics Design, UI/UX and Content Writing.</span>
     
     <div id='row1' className='gap-24 overflow-hidden w-screen flex justify-center p-20  '>
       <div className='bg-blue-950 w-fit h-20 rounded-full flex flex-col justify-center items-center p-5'>
       <div className='gap-1 flex justify-center font-bold text-yellow-400'>
       <input className='' type="range"  min={0}  max={100}  value={80}  disabled />
       <span>80%</span>
       </div>
       <p className='font-bold text-yellow-400'>HTML5</p>
      </div>

      <div className='bg-blue-950 w-fit h-20 rounded-full flex flex-col justify-center items-center p-5'>
       <div className='gap-1 flex justify-center font-bold text-yellow-400'>
       <input type="range"  min={0}  max={100}  value={70}  disabled />
       <span> 70%</span>
       </div>
       <p className='font-bold text-yellow-400'>CSS3</p>
      </div>

      <div className='bg-blue-950 w-fit h-20 rounded-full flex flex-col justify-center items-center p-5'>
       <div className='gap-1 flex justify-center font-bold text-yellow-400'>
       <input type="range"  min={0}  max={100}  value={50}  disabled />
       <span> 50%</span>
       </div>
       <p className='font-bold text-yellow-400'>Photoshop</p>
      </div>


      </div>

      <div id='row2' className='-mt-12 gap-24 overflow-hidden w-screen flex justify-center p-20 '>
      
      <div className='bg-blue-950 w-fit h-20 rounded-full flex flex-col justify-center items-center p-5'>
       <div className='gap-1 flex justify-center font-bold text-yellow-400'>
       <input type="range"  min={0}  max={100}  value={60}  disabled />
       <span> 60%</span>
       </div>
       <p className='font-bold text-yellow-400'>JavaScript</p>
      </div>
      
      
       <div className='bg-blue-950 w-fit h-20 rounded-full flex flex-col justify-center items-center p-5'>
       <div className='gap-1 flex justify-center font-bold text-yellow-400'>
       <input type="range"  min={0}  max={100}  value={65}  disabled />
       <span> 65%</span>
       </div>
       <p className='font-bold text-yellow-400'>ReactJS</p>
      </div>

      <div className='bg-blue-950 w-fit h-20 rounded-full flex flex-col justify-center items-center p-5'>
       <div className='gap-1 flex justify-center font-bold text-yellow-400'>
       <input type="range"  min={0}  max={100}  value={85}  disabled />
       <span> 85%</span>
       </div>
       <p className='font-bold text-yellow-400'>TailWind CSS</p>
      </div>


      </div>
  
      </Fade>

    </section>



  );
}

export default skill;