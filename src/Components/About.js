import React from "react";
import "../stylesheet/About.css";
import image from "../Images/aboutImage.jpg";
import { motion } from "framer-motion";
export default function About() {
  return (
    <div style={{ position: "relative" }}>
      <section className="hero">
        <div className="heading-container">
          <div className="heading">
            <h1>
              {" "}
              <motion.div
                whileInView={{ translateX: 0 }}
                initial={{ translateX: -500 }}
                // animate={{ translateX: 0 }}
                transition={{ duration: 0.6 }}
              >
                About Us
              </motion.div>
            </h1>
          </div>
        </div>
        <motion.div
          initial={{ translateY: 100, opacity: 0 }}
          whileInView={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="containerAbout"
        >
          <div className="hero-image">
            <img alt="About Image" src={image} />
          </div>
          <motion.div className="hero-content">
            <h1>Welcome To Our Website hello bussy</h1>
            <p>
              Discover the latest trends and innovations in technology, design,
              and more. Our team of experts brings you the best content and
              insights to help you stay ahead of the curve
            </p>{" "}
            <div style={{ display: "flex", justifyContent: "end" }}>
              <button className="cta-button">Learn More</button>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
