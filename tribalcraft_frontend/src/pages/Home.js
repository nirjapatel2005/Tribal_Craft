import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [approvedCrafts, setApprovedCrafts] = useState([]);
  const tribalCrafts = [
    {
      id: 1,
      title: "Warli Art",
      region: "Maharashtra",
      description: "Traditional tribal art form with geometric patterns",
      image: "/warli_img.png",
      price: "$25"
    },
    {
      id: 2,
      title: "Madhubani Painting",
      region: "Bihar",
      description: "Colorful folk art with mythological themes",
      image: "/madhubani.png",
      price: "$35"
    },
    {
      id: 3,
      title: "Gond Art",
      region: "Madhya Pradesh",
      description: "Vibrant tribal art with nature motifs",
      image: "/gond_img.png",
      price: "$30"
    },
    {
      id: 4,
      title: "Pattachitra",
      region: "Odisha",
      description: "Traditional cloth-based scroll painting",
      image: "/pattchitra.jpeg",
      price: "$40"
    },
    {
      id: 5,
      title: "Kalamkari",
      region: "Andhra Pradesh",
      description: "Hand-painted textile art with natural dyes",
      image: "/kalamkari.jpg",
      price: "$45"
    },
    {
      id: 6,
      title: "Bhil Art",
      region: "Rajasthan",
      description: "Dot painting technique with tribal stories",
      image: "/bhilart.jpeg",
      price: "$28"
    },
    {
      id: 7,
      title: "Mekhla Chandar",
      region: "Assam",
      description: "Traditional Assamese dress worn by women",
      image: "/mekhala.jpg",
      price: "$55"
    },
    {
      id: 8,
      title: "Cane and Bamboo Art",
      region: "North-Eastern India",
      description: "Traditional bamboo and cane crafts for daily use",
      image: "/bamboo.png",
      price: "$20"
    },
    {
      id: 9,
      title: "Pottery",
      region: "Manipur",
      description: "Traditional tribal pottery with unique techniques",
      image: "/poettry.png",
      price: "$35"
    },
    {
      id: 10,
      title: "Patola",
      region: "Gujarat",
      description: "Double Ikat weaving technique with intricate patterns",
      image: "/Patan-Patola-3L.jpg",
      price: "$120"
    }
  ];

  // Fetch approved crafts from backend
  useEffect(() => {
    const fetchApprovedCrafts = async () => {
      try {
        const response = await axios.get('/api/crafts/approved');
        const craftsWithIds = response.data.map((craft, index) => ({
          id: tribalCrafts.length + index + 1,
          title: craft.itemName,
          region: craft.region,
          description: craft.description,
          image: craft.imageUrl,
          price: craft.price
        }));
        setApprovedCrafts(craftsWithIds);
      } catch (error) {
        console.error('Error fetching approved crafts:', error);
      }
    };

    fetchApprovedCrafts();
  }, [tribalCrafts.length]);

  // Combine static and approved crafts
  const allCrafts = [...tribalCrafts, ...approvedCrafts];

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Discover Authentic Tribal Crafts</h1>
        <p>Explore unique art and crafts from tribal communities across India</p>
        <div className="hero-buttons">
          <Link to="/sell-craft" className="sell-button">
            Sell Crafts
          </Link>
          <Link to="/cart" className="buy-button">
            Buy Crafts
          </Link>
        </div>
      </div>
      
      <div className="crafts-container">
        <h2>Featured Tribal Crafts</h2>
        <div className="slider-container">
          <button className="slider-btn prev-btn" onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}>
            &#8249;
          </button>
          <div className="crafts-slider">
            <div className="crafts-track" style={{transform: `translateX(-${currentSlide * 100}%)`}}>
              {Array.from({length: Math.ceil(allCrafts.length / 3)}, (_, slideIndex) => (
                <div key={slideIndex} className="slide">
                  {allCrafts.slice(slideIndex * 3, slideIndex * 3 + 3).map(craft => (
                    <div key={craft.id} className="craft-card">
                      <img src={craft.image} alt={craft.title} className="craft-image" />
                      <div className="craft-content">
                        <h3>{craft.title}</h3>
                        <p className="craft-region">{craft.region}</p>
                        <p className="craft-description">{craft.description}</p>
                        <div className="craft-footer">
                          <span className="craft-price">{craft.price}</span>
                          <Link to={`/product/${craft.id}`} className="explore-button">
                            Explore More
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button className="slider-btn next-btn" onClick={() => setCurrentSlide(Math.min(Math.ceil(allCrafts.length / 3) - 1, currentSlide + 1))}>
            &#8250;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;