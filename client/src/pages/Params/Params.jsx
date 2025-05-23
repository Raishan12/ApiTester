import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Params = () => {
  const { params = [{ key: '', value: '' }], setParams = () => {} } = useOutletContext();

  const handleParamChange = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);


    if (index === params.length - 1 && value) {
      setParams([...newParams, { key: '', value: '' }]);
    }
  };

  const handleDeleteRow = (index) => {
    if (index === 0) return;
    setParams(params.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <h1 className="font-bold text-lg mb-2 text-white">Query Params</h1>
      <table className="w-3/4 border-2 border-gray-600 bg-gray-800">
        <thead>
          <tr>
            <th className="border border-b-2 border-gray-600 p-2 text-white text-left">Key</th>
            <th className="border border-b-2 border-gray-600 p-2 text-white text-left">Value</th>
            <th className="border border-b-2 border-gray-600 p-2 text-white text-left">Action</th>
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
                  value={param.key || ''}
                  onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                />
              </td>
              <td className="border border-gray-600">
                <input
                  type="text"
                  name="value"
                  className="w-full bg-gray-800 text-white focus:outline-none px-2 py-1"
                  placeholder="Value"
                  value={param.value || ''}
                  onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                />
              </td>
              <td className="border border-gray-600">
                {index !== 0 && (
                  <button
                    onClick={() => handleDeleteRow(index)}
                    className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Params;