import './App.css';	
import Navbar from "./components/Navbar/navbar";	
import Intro from "./components/Intro/intro";	
import About from "./components/about/about";	
import Skill from "./components/skill/skill";	
import Contact from "./components/contact/contact";	
import Footer from "./components/footer/footer";
import { useState , useEffect } from 'react';
import { HashLoader } from 'react-spinners';



function App() {	

  const [loading, SetLoading]= useState(false);

  useEffect(()=>{
  SetLoading(true);
  setTimeout(()=>{
    SetLoading(false)
  },5000)
},[])


  return (	
    <div className="App">	
    
    {
      loading ?
      <div  className='bg-blue-950 flex justify-center items-center w-full h-screen' >
            <HashLoader color={'#3644d6'}  loading={loading}  size={200} />
      </div>

      :
  
    <div>
      <Navbar/>	
       <Intro/>	
       <About/>	
       <Skill/>	
       <Contact/>	
       <Footer/>	
       </div>
      }

    </div>	
 
  );	
}	

export default App;
