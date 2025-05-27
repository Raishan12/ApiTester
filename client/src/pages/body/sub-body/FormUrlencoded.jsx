import React from 'react';
import { useOutletContext } from 'react-router-dom';

const FormUrlencoded = () => {
  const { formUrlencodedData = [{ key: '', value: '' }], setFormUrlencodedData = () => {} } = useOutletContext();

  const handleFormDataChange = (index, field, value) => {
    const newFormData = [...formUrlencodedData];
    newFormData[index][field] = value;
    setFormUrlencodedData(newFormData);

    // Add new row if typing in the last row
    if (index === formUrlencodedData.length - 1 && value) {
      setFormUrlencodedData([...newFormData, { key: '', value: '' }]);
    }
  };

  const handleDeleteRow = (index) => {
    if (index === 0) return; // Prevent deletion of first row
    setFormUrlencodedData(formUrlencodedData.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <h1 className="font-bold text-lg mb-2 text-white">x-www-form-urlencoded</h1>
      <table className="w-3/4 border-2 border-gray-600 bg-gray-800">
        <thead>
          <tr>
            <th className="border border-b-2 border-gray-600 p-2 text-white text-left">Key</th>
            <th className="border border-b-2 border-gray-600 p-2 text-white text-left">Value</th>
            <th className="border border-b-2 border-gray-600 p-2 text-white text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {formUrlencodedData.map((data, index) => (
            <tr key={index}>
              <td className="border border-gray-600">
                <input
                  type="text"
                  name="key"
                  className="w-full bg-gray-800 text-white focus:outline-none px-2 py-1"
                  placeholder="Key"
                  value={data.key || ''}
                  onChange={(e) => handleFormDataChange(index, 'key', e.target.value)}
                />
              </td>
              <td className="border border-gray-600">
                <input
                  type="text"
                  name="value"
                  className="w-full bg-gray-800 text-white focus:outline-none px-2 py-1"
                  placeholder="Value"
                  value={data.value || ''}
                  onChange={(e) => handleFormDataChange(index, 'value', e.target.value)}
                />
              </td>
              <td className="border border-gray-600 text-center hover:bg-gray-600"
                onClick={() => handleDeleteRow(index)}
              >
                {index !== 0 && (
                  <button
                    
                    className="px-2 py-1 rounded text-center"
                  >
                    🗑️
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

export default FormUrlencoded;