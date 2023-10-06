import React from 'react';
import jobListings from '../jobListings';  // adjust the import path accordingly
import JobApplication from './JobApplication';

function JobApplicationsList() {
  return (
    <div className="w-full lg:w-2/3 mx-auto flex flex-col pt-0 pb-0"> 
      <h1 className="text-4xl font-bold text-black text-center mt-10 mb-5">Open Positions</h1>
      <p className="text-center mb-10">Welcome to CSGOEmpire jobs. We are always on the look out for top tier talent in all capacaties.</p>
      <div>
        {jobListings.map((job) => (
          <JobApplication key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobApplicationsList;
