import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBuyClick = async () => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    try {
      // Handle image URL properly for both static and dynamic crafts
      let imageUrl = craft.image;
      if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = `/${imageUrl}`;
      }

      await axios.post('http://localhost:5000/api/cart/add', {
        craftId: id.toString(),
        craftTitle: craft.title,
        craftPrice: craft.price,
        craftImage: imageUrl
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success('Item added to cart!');
      navigate('/cart');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Error adding item to cart: ' + (error.response?.data?.message || error.message));
    }
  };
  
  const craftDetails = {
    1: {
      title: "Warli Art",
      region: "Maharashtra",
      description: "Warli painting is a traditional tribal art form from Maharashtra. It uses geometric patterns to depict daily life, nature, and folklore of the Warli tribe.",
      fullDescription: "The Warli tribe is one of the largest tribes in India, located in the mountainous and coastal areas of Maharashtra-Gujarat border. Their art form dates back to 2500 BCE and is characterized by simple geometric shapes - circles, triangles, and lines. These paintings traditionally adorned the walls of tribal houses during festivals and special occasions.",
      image: "/warli_img.png",
      price: "$25",
      artist: "Tribal Community of Dahanu",
      materials: "Natural pigments on canvas",
      size: "12x16 inches"
    },
    2: {
      title: "Madhubani Painting",
      region: "Bihar",
      description: "Madhubani art is a folk painting practiced in the Mithila region of Bihar and Nepal.",
      fullDescription: "Also known as Mithila art, this traditional painting style originated in the Mithila region of Bihar. The paintings are characterized by complex geometrical patterns, vibrant colors, and themes from Hindu mythology, nature, and social events.",
      image: "/madhubani.png",
      price: "$35",
      artist: "Mithila Artists Collective",
      materials: "Natural dyes on handmade paper",
      size: "14x18 inches"
    },
    3: {
      title: "Gond Art",
      region: "Madhya Pradesh",
      description: "Vibrant tribal art with nature motifs from the Gond tribe.",
      fullDescription: "Gond art is a traditional folk painting practiced by the Gond tribe of Madhya Pradesh. This art form is characterized by vibrant colors and intricate patterns depicting nature, animals, and mythological stories. The paintings are created using natural pigments and showcase the rich cultural heritage of the Gond community.",
      image: "/gond_img.png",
      price: "$30",
      artist: "Gond Tribal Artists",
      materials: "Natural pigments on canvas",
      size: "16x20 inches"
    },
    4: {
      title: "Pattachitra",
      region: "Odisha",
      description: "Traditional cloth-based scroll painting from Odisha.",
      fullDescription: "Pattachitra is a traditional painting style from Odisha, known for its intricate details and mythological narratives. These paintings are done on cloth or dried palm leaves and depict stories from Hindu epics. The art form is characterized by bold lines, vibrant colors, and decorative borders.",
      image: "/pattchitra.jpeg",
      price: "$40",
      artist: "Odisha Traditional Artists",
      materials: "Natural colors on cloth",
      size: "18x24 inches"
    },
    5: {
      title: "Kalamkari",
      region: "Andhra Pradesh",
      description: "Hand-painted textile art with natural dyes.",
      fullDescription: "Kalamkari is an ancient textile painting art from Andhra Pradesh. The word Kalamkari means 'pen work' in Persian. This art involves hand-painting or block-printing fabrics with natural dyes, depicting mythological stories, floral patterns, and religious themes.",
      image: "/kalamkari.jpg",
      price: "$45",
      artist: "Andhra Pradesh Artisans",
      materials: "Natural dyes on cotton fabric",
      size: "20x30 inches"
    },
    6: {
      title: "Bhil Art",
      region: "Rajasthan",
      description: "Dot painting technique with tribal stories.",
      fullDescription: "Bhil art is a traditional painting style of the Bhil tribe from Rajasthan and Madhya Pradesh. This art form uses dots and dashes to create intricate patterns and tell stories of their daily life, festivals, and folklore. The paintings are vibrant and full of life, reflecting the rich cultural heritage of the Bhil community.",
      image: "/bhilart.jpeg",
      price: "$28",
      artist: "Bhil Tribal Community",
      materials: "Acrylic colors on canvas",
      size: "14x18 inches"
    },
    7: {
      title: "Mekhla Chandar",
      region: "Assam",
      description: "Traditional Assamese dress worn by women comprising two pieces.",
      fullDescription: "This is the traditional Assamese dress which is worn by women. It comprises two pieces one is mekhla that is draped around the lower half of body. Another portion of this dress is Chandar which is a piece of cloth worn on the upper portion of the body. It is prepared by the Mishi tribe of Assam.",
      image: "/mekhala.jpg",
      price: "$55",
      artist: "Mishi Tribe of Assam",
      materials: "Traditional handwoven silk",
      size: "One size fits all"
    },
    8: {
      title: "Cane and Bamboo Art",
      region: "North-Eastern India",
      description: "Traditional bamboo and cane crafts for daily use products.",
      fullDescription: "Human beings have an intricate relationship with plants. We are dependent on plants for many purposes be it food, shelter, medicines and other products. Tribal communities depend largely on plants. They because of living in the close proximity with various plants have identified and used different parts of plants for different purposes. For example coco-palm is used to make spears, knives, canoes, fuel, mats, baskets and hats etc. the North-Eastern states of India is rich in cane and bamboos and the tribal communities living in close association with the forests have been utilizing it as raw material for making many daily use products. The tribal communities of North-Eastern region have utilized the cane and bamboo to every possible extent and also have developed techniques unique to their community. There is a varied range of bamboo and cane products found among various states of North-Eastern region. Bamboo baskets are a common product which can be seen with every North-Eastern tribal people. These baskets are made according to various purposes in different shapes and sizes.",
      image: "/bamboo.png",
      price: "$20",
      artist: "North-Eastern Tribal Communities",
      materials: "Natural cane and bamboo",
      size: "Various sizes available"
    },
    9: {
      title: "Pottery",
      region: "Manipur",
      description: "Traditional tribal pottery with unique techniques.",
      fullDescription: "Apart from above mentioned crafts certain tribes make their own pottery by a technique unique to their community. The pottery includes vessels and utensils which are used for many purposes. The Longpi pottery is one of the famous tribal craft and is practiced by the Thankhul Naga tribe of Manipur. This pottery is a status symbol among this tribe as only rich people can afford to have it. It is used at special occasions like marriage, festivals and feasts.",
      image: "/poettry.png",
      price: "$35",
      artist: "Thankhul Naga Tribe of Manipur",
      materials: "Traditional clay and natural minerals",
      size: "Various vessel sizes"
    },
    10: {
      title: "Patola",
      region: "Gujarat",
      description: "Double Ikat weaving technique with intricate patterns.",
      fullDescription: "Ikat is a fabric with diverse histories owing to its multiple origins; however, the name is a Malay word literally for 'to tie'. It is a weaving technique where in the weft, the warp or both the yarns are dyed selectively through a resist-dye process so that the patterns emerge upon the criss cross of the yarns. Patan, the former capital of Gujarat is the home for double Ikat, which incorporates a very high level of intricacy and skill. It starts with dyeing both the warp and the weft and matching them to form motifs at regular intervals. This requires pre calculation of where the dye should come on the yarn (warp or weft), for it to accurately form an overlap with the same or different colored stretch on the second yarn (weft or warp), to weave a majestic double Ikat fabric called Patola. On a Patola, the square represents security in every aspect of life. The elephant, parrot, peacock and kalash (metal pot) are considered saubhagya & (good luck). To cater to more lovers of Patola, a simpler version with similar visual effect but lesser intricacy and therefore lower price range was invented. The Single Ikat Patola of Surendranagar and neighboring villages came to the rescue of the weavers, the technique and the buyers in the region.",
      image: "/Patan-Patola-3L.jpg",
      price: "$120",
      artist: "Gujarat Traditional Weavers",
      materials: "Silk with natural dyes",
      size: "6 yards"
    }
  };

  const craft = craftDetails[id] || craftDetails[1];

  return (
    <div className="product-details">
      <div className="product-container">
        <div className="product-image-section">
          <img src={craft.image} alt={craft.title} className="product-image" />
        </div>
        
        <div className="product-info-section">
          <h1>{craft.title}</h1>
          <p className="product-region">From {craft.region}</p>
          <p className="product-price">{craft.price}</p>
          
          <div className="product-description">
            <h3>About this Art</h3>
            <p>{craft.fullDescription}</p>
          </div>
          
          <div className="product-details-grid">
            <div className="detail-item">
              <strong>Artist:</strong> {craft.artist}
            </div>
            <div className="detail-item">
              <strong>Materials:</strong> {craft.materials}
            </div>
            <div className="detail-item">
              <strong>Size:</strong> {craft.size}
            </div>
          </div>
          
          <div className="product-actions">
            <button className="buy-button" onClick={handleBuyClick}>Buy Item</button>
            <Link to="/" className="back-button">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;