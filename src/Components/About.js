import React from 'react'
import "../stylesheet/About.css"
export default function About() {
  return (
    <div>
       <section className="hero">
          <div className="heading-container">
            <div className="heading">
              <h1>About Us</h1>
            </div>
          </div>
          <div className="container">
            <div className="hero-content">
              <h2>Welcome To Our Website</h2>
              <p>
                Discover the latest trends and innovations in technology,
                design, and more. Our team of experts brings you the best
                content and insights to help you stay ahead of the curve
              </p>{" "}
              <button class="cta-button">Learn More</button>
            </div>
            <div className="hero-image">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1501290741922-b56c0d0884af?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzZWFyY2h8ZW58MHx8MHx8fDA%3D"
              />
            </div>
          </div>
        </section>
    </div>
  )
}
