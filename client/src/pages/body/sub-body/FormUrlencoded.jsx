import React from 'react';
import { useOutletContext } from 'react-router-dom';

const FormUrlencoded = () => {
  const { formUrlencodedData = [{ key: '', value: '' }, { key: '', value: '' }], setFormUrlencodedData = () => {} } = useOutletContext();

  const handleFormDataChange = (index, field, value) => {
    const newFormData = [...formUrlencodedData];
    newFormData[index][field] = value;
    setFormUrlencodedData(newFormData);
  };

  return (
    <div className="p-4">
      <h1 className="font-bold text-lg mb-2 text-white">x-www-form-urlencoded</h1>
      <table className="w-3/4 border-2 border-gray-600 bg-gray-800">
        <thead>
          <tr>
            <th className="border border-b-2 border-gray-600 p-2 text-white text-left">Key</th>
            <th className="border border-b-2 border-gray-600 p-2 text-white text-left">Value</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormUrlencoded;