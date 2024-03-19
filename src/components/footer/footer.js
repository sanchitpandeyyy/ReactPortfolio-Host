import React from 'react'
import logo from '../../img/Sanchit Pandey.png';
import email from '../../img/email.png';
import phone from '../../img/phone.jpg';
import loc from '../../img/location.jpg';
import './footer.css'


const footer = () => {
  return (
    <div className='bg-black'>
      <div className='bg-black flex justify-around '>
        <div className='flex justify-center items-center'>
          <img src={logo} alt='' className='w-36 h-36 ' />
        </div>
        <div className=''>

          <div id='footerbox' className='rounded-xl bg-white border-2 text-black flex h-12 p-4 mt-4 justify-stretch  items-center'>
            <img src={loc} alt='' className='mr-1 h-8 w-8' />Butwal, Rupandehi
          </div>

          <div
            id='footerbox'
            className='rounded-xl bg-white border-2 text-black flex h-12 p-4 mt-4 justify-stretch items-center'>

            <img
              src={phone}
              alt=''
              className='mr-3 h-7 w-7' />
            <a href={`tel:9841148149`}>
              9841148149
            </a>

          </div>

          <div
            id='footerbox'
            className=' rounded-xl bg-white border-2 text-black flex h-12 p-4 mt-4 justify-stretch items-center'>

            <img
              src={email}
              alt=''
              className='h-7 w-7 mr-3' /><a href="mailto:admin@sanchitpandey.com.np">
              admin@sanchitpandey.com.np
            </a>
          </div>



        </div>



      </div>
      <div className='pt-8'>
        <hr />
        <span id='copy' className=' pt-5 flex justify-center text-2xl'> Copyright &copy;  All Rights Reserved-2023 </span>
        <span id='design' className='pt-5 flex justify-center flex-col items-center gap-2'>Designed and Developed By
         <a  className='font-bold text-yellow-400 ' href="https://www.linkedin.com/in/sanchitpandeyyy/"> Sanchit Pandey.</a> </span>
      </div>
    </div>


  )
}

export default footer;
