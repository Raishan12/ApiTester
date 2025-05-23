import React from 'react';
import { Link, Outlet, useOutletContext } from 'react-router-dom';

const Body = () => {
  const context = useOutletContext() || {};

  return (
    <div className="p-4">
      <ul className="flex gap-3 border-b border-gray-600 pb-2">
        <li><Link to="none" className="hover:text-blue-400">none</Link></li>
        <li><Link to="formdata" className="hover:text-blue-400">form-data</Link></li>
        <li><Link to="formurlencoded" className="hover:text-blue-400">x-www-form-urlencoded</Link></li>
        <li><Link to="raw" className="hover:text-blue-400">raw</Link></li>
        <li><Link to="#" className="hover:text-blue-400">binary</Link></li>
        <li><Link to="#" className="hover:text-blue-400">GraphQL</Link></li>
      </ul>
      <div className="mt-3">
        <Outlet context={context} />
      </div>
    </div>
  );
};

export default Body;