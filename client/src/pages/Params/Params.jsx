import React, { useState } from 'react';

const Params = () => {
  const [params, setParams] = useState([
    { key: '', value: '' },
    { key: '', value: '' },
  ]);

  const handleParamChange = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  return (
    <div className="p-4">
      <h1 className="font-bold text-lg mb-2">Query Params</h1>
      <table className="w-3/4 border-2 border-gray-600">
        <thead>
          <tr>
            <th className="border border-b-2 border-gray-600 p-2 border-gray-600 ">Key</th>
            <th className="border border-b-2 border-gray-600 p-2 border-gray-600">Value</th>
          </tr>
        </thead>
        <tbody>
          {params.map((param, index) => (
            <tr key={index}>
              <td className="border border-gray-600">
                <input
                  type="text"
                  name="key"
                  className="w-full bg-gray-800 text-white focus:outline-none px-2 py-1"
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                />
              </td>
              <td className="border border-gray-600">
                <input
                  type="text"
                  name="value"
                  className="w-full bg-gray-800 text-white focus:outline-none px-2 py-1"
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Params;