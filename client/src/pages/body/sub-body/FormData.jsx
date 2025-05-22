import React, { useState } from 'react';

const FormData = () => {
  const [formData, setFormData] = useState([
    { key: '', value: '' },
    { key: '', value: '' },
  ]);

  const handleFormDataChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);
  };

  return (
    <div className="p-4">
      <h1 className="font-bold text-lg mb-2">Form-Data</h1>
      <table className="w-3/4 border-2 border-gray-600 bg-gray-800">
        <thead>
          <tr>
            <th className="border border-b-2 border-gray-600 p-2 text-white">Key</th>
            <th className="border border-b-2 border-gray-600 p-2 text-white">Value</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((data, index) => (
            <tr key={index}>
              <td className="border border-gray-600">
                <input
                  type="text"
                  name="key"
                  className="w-full bg-gray-800 text-white focus:outline-none px-2 py-1"
                  placeholder="Key"
                  value={data.key}
                  onChange={(e) => handleFormDataChange(index, 'key', e.target.value)}
                />
              </td>
              <td className="border border-gray-600">
                <input
                  type="text"
                  name="value"
                  className="w-full bg-gray-800 text-white focus:outline-none px-2 py-1"
                  placeholder="Value"
                  value={data.value}
                  onChange={(e) => handleFormDataChange(index, 'value', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormData;