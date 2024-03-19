
import React from 'react'
import './skill.css'
import Fade from 'react-reveal/Fade';
import photoshop from '../../img/photoshop.png';
import bootstrap from '../../img/bootstrap.png';


const skill = () => {
  return (

    <section id='skill' className='gap-1 mt-3 overflow-hidden w-screen flex flex-col text-center my-0 mx-auto justify-center items-center'>
      <Fade left>
        <span className='mt-5'>My Skills & Tools</span><br />
        <span className='text-7xl font-black mb-5'>My Skills</span>
        <span className='px-12 py-2' > I own a diverse range of talents and expertise that I have developed over the years. From technical skills such as programming, and Web Development, to creative abilities like Graphics Design, UI/UX and Content Writing. </span>
        


           <div className='tools'>
            
              <img className=' '        
                    src={bootstrap}
                     alt="bootstrap"
             />


              <img className='  '
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg"
                   alt="css3"
              />
            

            

              <img className='  '
                src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg"

                  alt="firebase"
              />
            
            

              <img className='  '
                src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg"
                 alt="git"
              />
            
            

              <img className='  '
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg"
                alt="html5"
              />
            

              <img className='  '
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"
                alt="js"
              />
            
            

              <img className='  '
                src={photoshop}
                alt="photoshop"
              />
            
            

              <img className='  '
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg"
                alt="react"
              />
            
            

              <img className='  '
                src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg"
                alt="tailwind"
              />

         </div>


      </Fade>

    </section>



  );
}

export default skill;
