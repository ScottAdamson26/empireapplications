import React from 'react';
import Logo from './Logo';
// Import the CSS file at the top of your component file or App.js
import '../App.css';

function Hero() {
  return (
    <div className={`bg-gray-800 md:h-[75vh] h-screen w-full flex items-center justify-center hero-background`}>
      <Logo className="w-32 h-32 md:w-64 md:h-64" />
    </div>
  );
}

export default Hero;
