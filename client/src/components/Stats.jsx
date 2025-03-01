import React from "react";
import "../App.css";

const statsData = [
  {
    title: "Ultra Fast",
    value: "5,200",
    label: "TRANSACTIONS PER SECOND",
    color: "blue",
  },
  {
    title: "Highly Secure",
    value: "1,450",
    label: "VALIDATOR NODES",
    color: "red",
  },
  {
    title: "Scalability",
    value: "< $0.002",
    label: "AVG TRANSACTION FEE",
    color: "purple",
  },
  {
    title: "Energy Efficient",
    value: "0%",
    label: "NET CARBON IMPACT",
    color: "green",
  },
];

const StatsSection = () => {
  return (
    <div className='stats-section'>
      <div className='stats-container'>
        <h2 className='stats-title'>Built for Performance</h2>
        <p className='stats-subtitle'>Live Network Data</p>
        <div className='stats-grid'>
          {statsData.map((stat, index) => (
            <div key={index} className='stat-card'>
              <h3 className='stat-title'>{stat.title}</h3>
              <p className='stat-value stat-{stat.color}'>{stat.value}</p>
              <p className='stat-label'>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

export default StatsSection;
