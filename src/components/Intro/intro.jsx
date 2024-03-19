import React from "react";
import bg from "../../img/heroimg.png";
import hire from "../../img/hire.avif";
import "../Intro/intro.css";
import { Link } from "react-scroll";
import Fade from "react-reveal/Fade";

const Intro = () => {
  //   document.oncontextmenu = () => {
  //     alert('Right Click Kina Gareko hmm🤨?')
  //     return false
  // }

  // document.onkeydown = (e) => {

  //       if (e.ctrlKey && e.key == "U" || e.key == 'u') {
  //         alert('Uhh Chor Aayo Chor😡')
  //           return false
  //         }

  //     if (e.ctrlKey && e.shiftKey && e.key == "I") {
  //         alert('Mildenna haau sathi xoddeu !!')
  //         return false
  //     }
  //   }

  return (
    <section className="flex justify-between h-screen w-full " id="intro">
      <Fade left>
        <div
          id="wholetext"
          className="h-screen w-screen p-14 font-black gap-3 text-5xl flex flex-col justify-center"
        >
          <span className="text-3xl font-semibold">Hello,</span>
          <span className="">
            I'm
            <span className="text-yellow-400"> Sanchit </span>
            <br />A Web Developer
          </span>
          <span id="text" className="text-xs font-medium w-1/2 tracking-wider">
            A developer who crafts digital experiences. Welcome to a World of
            Creative Possibilities where Vision Meets Design.
          </span>

          <a className="cursor-pointer">
            <Link
              activeClass="active"
              to="contact"
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
              className=" bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 rounded-full text-xl font-bold text-center text-white  flex w-44 items-center justify-center"
            >
              <img
                src={hire}
                alt="hire"
                className="h-11 w-11 m-2 rounded-full"
              />
              Hire Me!
            </Link>
          </a>
        </div>
      </Fade>
      <img
        src={bg}
        alt="background"
        id="bg"
        className="absolute right-0 -z-10 grayscale-0 h-[38rem] "
      />
    </section>
  );
};

export default Intro;
