import React from 'react';

import mySpinner from '../assets/Svgs/spinner.svg';

export default function Spinner() {
  return (
    <div>
      <img src={mySpinner} alt="Loading..." className="m-auto h-16 w-16" />
    </div>
  );
}
