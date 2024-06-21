import React from "react";
import "../stylesheet/About.css";
import image from "../Images/aboutImage.jpg";
import { motion } from "framer-motion";
export default function About() {
  return (
    <div>
      <section className="hero">
        <div className="heading-container">
          <div className="heading">
            <h1> <motion.div initial={{translateX:-500}} animate={{translateX:0}} transition={{duration:0.6}}>About Us</motion.div></h1>
          </div>
        </div>
        <div  className="containerAbout">
          
          <div className="hero-image">
            <img alt="About Image" src={image} />
          </div>
          <div className="hero-content">
            <h1>Welcome To Our Website hello bussy</h1>
            <p>
              Discover the latest trends and innovations in technology, design,
              and more. Our team of experts brings you the best content and
              insights to help you stay ahead of the curve
            </p>{" "}
            <div style={{display:"flex",justifyContent:"end"}}>
            <button class="cta-button">Learn More</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
