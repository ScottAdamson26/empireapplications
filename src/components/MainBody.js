import React from 'react';
import JobApplicationsList from './JobApplicationsList';
import GeneralApplicationPrompt from './GeneralApplicationPrompt';  // Import the new component

function MainBody() {
  return (
    <div className="flex flex-col items-center pt-0 p-2 md:p-4 lg:p-8 font-montserrat">
      <JobApplicationsList />
      <GeneralApplicationPrompt />  {/* Add the new component here */}
    </div>
  );
}

export default MainBody;
