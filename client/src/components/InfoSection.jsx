import React from "react";
import "../App.css";

const InfoSection = () => {
  return (
    <section className='info-section'>
      <div className='container'>
        <h2 className='section-title'>Nepali Blockchain Financial Market</h2>

        <div className='info-block'>
          <h3>1. Background</h3>
          <p>
            The Nepali financial market, while growing, lacks an efficient
            platform for public offerings and liquidity management. The stock
            market and IPO processes are often centralized and bureaucratic,
            leading to delays, inefficiencies, and a lack of accessibility for a
            broader segment of the population. Blockchain technology has the
            potential to transform this landscape by decentralizing the
            processes of issuing shares, tokenizing the Nepali Rupee (NPR), and
            providing an open and transparent platform for Initial Public
            Offerings (IPOs).
          </p>
        </div>

        <div className='info-block'>
          <h3>2. Problem Statement</h3>
          <p>
            The current financial system in Nepal, specifically for stock market
            transactions, is hindered by inefficiencies in share issuance,
            trading, and liquidity management. With the potential to improve
            transparency, reduce costs, and improve accessibility, blockchain
            can address these problems. This project aims to create an IPO
            platform on blockchain, tokenize NPR, and integrate liquidity pools
            on decentralized exchanges to provide a more efficient and scalable
            solution.
          </p>
        </div>

        <div className='info-block'>
          <h3>3. Objectives</h3>
          <ul>
            <li>
              Tokenization of NPR: Create a blockchain-based token representing
              the Nepali Rupee (NPR) that is pegged 1:1 to the actual currency.
            </li>
            <li>
              IPO Platform Development: Design and implement an Initial Public
              Offering (IPO) platform where companies can issue shares as tokens
              on the blockchain.
            </li>
            <li>
              Liquidity Pools and AMM Integration: Develop liquidity pools in
              Uniswap v3 to ensure liquidity for trading NPR and company tokens.
            </li>
            <li>
              Consortium Deployment: Deploy the blockchain solution on a
              consortium blockchain to ensure secure and controlled
              participation.
            </li>
          </ul>
        </div>

        <div className='info-block'>
          <h3>4. Scope</h3>
          <p>
            This project covers the tokenization of the Nepali Rupee, the
            development of an IPO platform, and integration with Uniswap v3 for
            liquidity pools. The solution will be deployed on a public
            blockchain in a consortium, with an emphasis on security,
            scalability, and accessibility. The project will also ensure
            compliance with regulatory frameworks for blockchain-based financial
            applications.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
