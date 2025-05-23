import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Raw = () => {
  const { rawBody = '', setRawBody = () => {} } = useOutletContext();

  return (
    <div className="p-4">
      <h1 className="font-bold text-lg mb-2 text-white">Raw JSON</h1>
      <textarea
        className="w-3/4 h-40 border-2 border-gray-600 bg-gray-800 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter JSON body (e.g., { 'key': 'value' })"
        value={rawBody}
        onChange={(e) => setRawBody(e.target.value)}
      />
    </div>
  );
};

export default Raw;