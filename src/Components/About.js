import React, { useState } from "react";
import "../stylesheet/About.css";
import image from "../Images/aboutImage.jpg";
import { motion, AnimatePresence } from "framer-motion";
export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div style={{ position: "relative" }}>
      <section className="hero">
        <div className="heading-container">
          <div className="heading">
            <h1>
              {" "}
              <motion.div
                initial={{ translateX: -200 }}
                whileInView={{ translateX: 0 }}
                transition={{ duration: 0.6 }}
                className="color-contact"
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
            <h1>Welcome to Our Dynamic and Innovative Hub</h1>
            <p>
            Discover the latest trends and innovations in technology, design, and more. 
            Our team of experts brings you the best content and insights to help you stay ahead of the curve. 
            
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: "block" }}
                  >
                    Dive into our comprehensive analyses and expert opinions that shape the future. 
                    Join our community to engage with thought leaders and industry pioneers.
                  </motion.span>
                )}
              </AnimatePresence>
            </p>
            <div className="learnMoreButton">
              <button className="cta-button" onClick={toggleExpand}>
                {isExpanded ? "Show Less" : "Learn More"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
