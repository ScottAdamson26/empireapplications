import React from 'react';
import { Link } from 'react-router-dom';
import glassIcon from '../assets/glass.png';  // Adjust the import path accordingly

function GeneralApplicationPrompt() {
    return (
        <div className="general-application-prompt flex flex-col items-center justify-center p-4 md:p-8 mt-0">
        <img src={glassIcon} alt="Magnifying Glass Icon" className="w-8 h-8 mb-4" />
        <div>
          Can't find the job you're looking for?{' '}
          <Link to="/apply/General" style={{ color: '#E9B10E' }} className="underline">
            Apply anyway!
          </Link>
        </div>
      </div>
    );
  }
  
  export default GeneralApplicationPrompt;