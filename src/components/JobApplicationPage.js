import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles.css';  // adjust the import path accordingly if necessary
import { db } from './firebase';  // adjust the import path accordingly
import { collection, addDoc } from 'firebase/firestore';

function JobApplicationPage() {
    const { jobTitle } = useParams();
    const isGeneralApplication = jobTitle === 'general';
    const [formData, setFormData] = useState({
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
      try {
          const docRef = await addDoc(collection(db, "applications"), {
              ...formData,
              jobTitle: jobTitle,
              created_at: new Date(),
          });
          
          console.log("Document written with ID: ", docRef.id);
  
          // Optionally, if you want to add the id into the document itself after it's created
          // (this step is not strictly necessary since Firebase already provides a unique id)
          // await setDoc(doc(docRef), { id: docRef.id }, { merge: true });
  
      } catch (e) {
          console.error("Error adding document: ", e);
      }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-montserrat">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Application Form
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Apply for: {jobTitle}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm">
            <div className='mb-4'>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="apply-button2 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobApplicationPage;
