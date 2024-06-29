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
              insights to help you stay ahead of the curve.
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: "block" }}
                  >
                    Here is some more content that will be shown when "Learn
                    More" is clicked. This part is expandable.
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
