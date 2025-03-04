import React, { useEffect, useState } from "react";
import "../InfoSection.css";

const InfoSection = () => {
  const [flippedCards, setFlippedCards] = useState([false, false, false, false]);
  
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      const newFlippedCards = [...flippedCards];
      newFlippedCards[currentIndex] = !newFlippedCards[currentIndex];
      setFlippedCards(newFlippedCards);
      currentIndex = (currentIndex + 1) % 4;
    }, 3000);
    
    return () => clearInterval(interval);
  }, [flippedCards]);
  
  const handleCardClick = (index) => {
    const newFlippedCards = [...flippedCards];
    newFlippedCards[index] = !newFlippedCards[index];
    setFlippedCards(newFlippedCards);
  };
  
  return (
    <div className="page-container">
      <h1 className="page-title"> SECURITIES EXCHANGE PLATFORM</h1>
      
      <div className="flashcards-container">
        {/* Card 1 */}
        <div 
          className={`flashcard ${flippedCards[0] ? "flipped" : ""}`} 
          onClick={() => handleCardClick(0)}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <h2 className="card-title">DECENTRALIZED TRADING</h2>
              {/* <p>Click Here</p> */}
            </div>
            <div className="flashcard-back">
              <h3 className="card-title">DECENTRALIZED TRADING</h3>
              <p className="card-content">
              Peer-to-peer transactions without intermediaries, ensuring faster, cheaper, and transparent trades on an immutable ledger.
              </p>
            </div>
          </div>
        </div>
        
        {/* Card 2 */}
        <div 
          className={`flashcard ${flippedCards[1] ? "flipped" : ""}`} 
          onClick={() => handleCardClick(1)}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <h2 className="card-title">ENHANCED SECURITY</h2>
              {/* <p>Click Here</p> */}
            </div>
            <div className="flashcard-back">
              <h3 className="card-title">ENHANCED SECURITY</h3>
              <p className="card-content">
              Blockchain's cryptography and decentralization protect against hacking and fraud, eliminating single points of failure.
              </p>
            </div>
          </div>
        </div>
        
        {/* Card 3 */}
        <div 
          className={`flashcard ${flippedCards[2] ? "flipped" : ""}`} 
          onClick={() => handleCardClick(2)}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <h2 className="card-title">TOKENIZED ASSETS</h2>
              {/* <p>Click Here</p> */}
            </div>
            <div className="flashcard-back">
              <h3 className="card-title">TOKENIZED ASSETS</h3>
              <div className="card-content">
                <p>
                Traditional securities (stocks, bonds, etc.) are digitized into tokens, enabling seamless trading and broader investment options.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card 4 */}
        <div 
          className={`flashcard ${flippedCards[3] ? "flipped" : ""}`} 
          onClick={() => handleCardClick(3)}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <h2 className="card-title">REAL-TIME SETTLEMENT</h2>
              {/* <p>Click Here</p> */}
            </div>
            <div className="flashcard-back">
              <h3 className="card-title">REAL-TIME SETTLEMENT</h3>
              <p className="card-content">
              Smart contracts automate and settle trades instantly, reducing delays and counterparty risk compared to traditional systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;