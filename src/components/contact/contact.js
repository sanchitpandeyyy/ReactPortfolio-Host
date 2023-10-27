import React,{useState} from 'react'	
import Fade from 'react-reveal/Fade';	
import './contact.css';	


        // firebase content start------	


const Contact = () => {	

  const [user, setUser] = useState({	
    name: '',	
    email: '',	
    message: '',	
  });	

  let name,value;	
  const getUserData =(event) => {	

    name = event.target.name;	
    value = event.target.value;	


    setUser({...user, [name]: value});	
  };	

  const postData = async(e) =>{	
     e.preventDefault();	

     const {name,email,message,} = user;	


     if(name && email && message){	


      const res = await fetch("https://portfoliocontact-55520-default-rtdb.firebaseio.com/sanchitpandey.json", {	
        method: 'POST',	
        headers: {	
          "Content-Type": "application/json",	
        },	
        body: JSON.stringify({	
          name,	
          email ,	
          message ,	
        }),	
      }	

      );	


      // data clear after sending	


      if(res){	
        setUser({	
          name: '',	
          email: '',	
          message: '',	
        });	

        alert("Your response was successfully sent ");	
      }	


     }	

     else{	
          alert("Please! Fill in all the fields");	
     }	
    };	

    // firebase content end------	






  return (	

    <section id='contact' className="mt-2">	
  <Fade left>	
    <span className='mb-4 text-7xl font-black flex justify-center  text-center'>Contact Me</span>	
    <div id='contactpage' className='flex justify-around p-8 '>	
        <div className="p-5 shadow-white rounded-md border-white border-2 bg-blue-950">	
            <span className='mb-10 text-2xl font-bold flex justify-center '>Get in Touch</span>	
            <p id='details' className=''> <b> Email: </b> sanchit2062@gmail.com</p>	
            <span id='details' className=' '  > <b>Phone:</b> +977 9841148149</span>	
            <div className="mt-5 flex justify-center">	
                <a href="https://www.facebook.com/Sanchit.Pandeyy/"  className="hover:text-yellow-400 font-black mr-3 bg-blue-900 p-2 rounded-full">Facebook</a>	
                <a href="https://github.com/Sanchit-Pandeyy" className="hover:text-yellow-400 font-black mr-3 bg-black p-2 rounded-full ">GitHub</a>	
                <a href="https://www.instagram.com/sanchit_pandeyy/" className="hover:text-black font-black mr-3 from-pink-500 bg-gradient-to-r to-yellow-500 p-2 rounded-full ">Instagram</a>	
            </div>	
        </div>	
        <form className=" rounded-md border-white border-2 p-5 bg-blue-950">	
            <h2 className='mb-3 text-2xl font-bold flex justify-center '>Contact Form</h2>	
            <input className='w-full mb-4 p-3 rounded-md border-white border-2' type="text" value={user.name} onChange={getUserData} name='name' placeholder="Your Name" required/>	
            <input className='w-full mb-4 p-3 rounded-md border-white border-2' type="email" value={user.email} onChange={getUserData} name='email' placeholder="Your Email" required/>	
            <textarea className='w-full mb-4 p-3 rounded-md border-white border-2' value={user.message} onChange={getUserData} name='message' placeholder="Your Message" required></textarea>	
            
            <button onClick={postData} type="submit" className='w-full mb-4 p-3 rounded-md bg-white text-black cursor-pointer hover:bg-yellow-500 font-semibold'>Submit</button>	
        </form> 	
        </div>	
        </Fade>	
    </section>	


  )	
}	

export default Contact;	
