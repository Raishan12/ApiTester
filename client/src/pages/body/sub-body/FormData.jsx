import React from 'react';
import { useOutletContext } from 'react-router-dom';

const FormData = () => {
  const { formData = [{ key: '', value: '' }], setFormData = () => {} } = useOutletContext();

  const handleFormDataChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);

    // Add new row if typing in the last row
    if (index === formData.length - 1 && value) {
      setFormData([...newFormData, { key: '', value: '' }]);
    }
  };

  const handleDeleteRow = (index) => {
    if (index === 0) return; // Prevent deletion of first row
    setFormData(formData.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <h1 className="font-bold text-lg mb-2 text-white">Form-Data</h1>
      <table className="w-3/4 border-2 border-gray-600 bg-gray-800">
        <thead>
          <tr>
            <th className="border border-b-2 border-gray-600 p-2 text-white text-left">Key</th>
            <th className="border border-b-2 border-gray-600 p-2 text-white text-left">Value</th>
            <th className="border border-b-2 border-gray-600 p-2 text-white text-left">Action</th>
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
                    
                    className="px-2 py-1 rounded text-center hover:bg-gray-600"
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

export default FormData;