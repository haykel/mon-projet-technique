import React from 'react';

// Footer component with custom styles
const myStyles = {
  backgroundColor:"#00008f",
  textAlign:"center", 
  color:"white", 
  padding:"10px", 
  position: "fixed", 
  left:0, 
  bottom:0, 
  width:"100%"
}

export default function Footer() {
  return (
    <footer style={myStyles} className="bg-gray-800 text-white p-4 text-center fixed bottom-0 w-full">
      <p>©2024 AXA Tous droits réservés</p>
    </footer>
  );
}
