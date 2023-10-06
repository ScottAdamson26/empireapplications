import React, { useState } from 'react';
import icon from '../assets/ICON.png';
import pinIcon from '../assets/pin.png';  // Import the pin icon
import moneyIcon from '../assets/briefcase.png';  // Import the pin icon
import caseIcon from '../assets/money.png';  // Import the pin icon
import '../styles.css';  // adjust the import path accordingly
import { db } from './firebase'
import { Link } from 'react-router-dom';
import arrowIcon from '../assets/arrow.png';  // Import the arrow icon
import arrow2Icon from '../assets/arrow2.png';  // Import the arrow icon



function JobApplication({ job }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    subject: job.title,
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.collection('applications').add(formData);
    setIsFormVisible(false);
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      let truncationPoint = text.lastIndexOf(' ', maxLength);
      if (truncationPoint === -1) truncationPoint = maxLength;
      return text.slice(0, truncationPoint) + '...';
    }
    return text;
  };

  return (
    <div className="job-application-container relative border p-4 mb-4 rounded-lg p-5 shadow-centered">
      <div className="flex items-center">
        <img src={icon} alt="Job Icon" className="w-12 h-12 mr-4" />
        <div>
          <h2 className="text-xl font-bold text-black">{job.title}</h2>
          <div className="flex space-x-4 text-gray-600">
            <div className="flex items-center">
              <img src={pinIcon} alt="Location Icon" className="w-4 h-4 mr-1" />
              {job.location}
            </div>
            <div className="flex items-center">
              <img src={caseIcon} alt="Pay Icon" className="w-4 h-4 mr-1" />
              {job.pay}
            </div>
            <div className="flex items-center">
              <img src={moneyIcon} alt="Hours Icon" className="w-4 h-4 mr-1" />
              {job.hours}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p>{isExpanded ? job.description : truncateText(job.description, 150)}</p>
      </div>
      {isExpanded && job.requirements && (
        <div className="mt-4">
          <h3 className="font-bold">Requirements:</h3>
          <ul className="list-disc pl-5">
            {job.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleToggle} className="flex items-center mt-2 group">
        <span>{isExpanded ? "See Less" : "See More"}</span>
        {isExpanded ? (
          <img
            src={arrow2Icon}
            alt="Arrow Icon"
            className="arrow-icon ml-2 transition-transform transform group-hover:translate-x-2 w-5 h-5"
          />
        ) : (
          <img
            src={arrowIcon}
            alt="Arrow Icon"
            className="arrow-icon ml-2 transition-transform transform group-hover:translate-x-2 w-5 h-5"
          />
        )}
      </button>

      {isExpanded && (
        <Link to={`/apply/${job.title}`} className="apply-button text-white font-bold py-2 px-4 border rounded absolute bottom-4 right-4">Apply</Link>

      )}
    </div>
  );
}

export default JobApplication;
