import React from 'react'
import logo from '../../img/logoo.png';
import email from '../../img/email.png';
import phone from '../../img/phone.jpg';
import loc from '../../img/location.jpg';
import './footer.css';


const footer = () => {
  return (
   <div className='bg-black'>
    <div className='bg-black flex justify-around '>
       <div className='flex justify-center items-center'>
        <img src={logo} alt='' className='w-28 h-28 '/>
       </div>
       <div className=''>
       
       <div id='footerbox' className='rounded-xl bg-white border-2 text-black flex h-12 p-4 mt-4 justify-stretch  items-center'>
         <img src={loc} alt='' className= 'mr-1 h-8 w-8'/>Butwal, Rupandehi
       </div>

       <div id='footerbox' className='rounded-xl bg-white border-2 text-black flex h-12 p-4 mt-4 justify-stretch items-center'>
         <img src={phone} alt='' className='mr-3 h-7 w-7'/>9841148149
       </div>

       <div id='footerbox' className=' rounded-xl bg-white border-2 text-black flex h-12 p-4 mt-4 justify-stretch items-center'>
         <img src={email} alt='' className='h-7 w-7 mr-3'/>admin@sanchitpandey.com.np
       </div>



       </div>
  


    </div>
    <div className='pt-8'>
    <hr/>
    <span id='copy'  className=' pt-5 flex justify-center text-2xl'> Copyright &copy;  All Rights Reserved-2023 </span>
    <span id='design' className='pt-5 flex justify-center gap-2'>Designed and Developed By <a className='font-bold text-yellow-400 ' href='https://github.com/Sanchit-Pandeyy'> Sanchit Pandey.</a> </span>
   </div>
    </div>
    

  )
}

export default footer