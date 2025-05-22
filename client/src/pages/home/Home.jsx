import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Home = () => {
  const [method, setMethod] = useState('get');
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formUrlencodedData, setFormUrlencodedData] = useState([
    { key: '', value: '' },
    { key: '', value: '' },
  ]);

  const location = useLocation();

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    let config = {
      method: method.toLowerCase(),
      url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    if (location.pathname.includes('formurlencoded') && method.toLowerCase() === 'post') {
      const formData = new URLSearchParams();
      formUrlencodedData.forEach(({ key, value }) => {
        if (key && value) formData.append(key, value);
      });
      config.data = formData.toString();
    }

    try {
      const res = await axios(config);
      setResponse(res.data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4">
      <h1 className="text-white text-center text-2xl font-bold mb-4">API TESTER ONLINE</h1>
      <div className="flex justify-center gap-2 mb-4">
        <select
          name="method"
          id="method"
          className="border border-gray-600 bg-gray-800 text-white rounded p-2 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option className="text-red-600 font-bold" value="get">GET</option>
          <option className="text-green-600 font-bold" value="post">POST</option>
          <option className="text-yellow-500 font-bold" value="put">PUT</option>
          <option className="text-blue-600 font-bold" value="delete">DELETE</option>
          <option className="text-purple-600 font-bold" value="patch">PATCH</option>
        </select>
        <input
          type="text"
          name="url"
          id="url"
          className="border border-gray-600 bg-gray-800 text-white rounded p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter URL or paste text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="bg-blue-500 px-8 py-2 rounded text-white font-bold border border-gray-600 hover:bg-blue-600"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <div className="data mt-5">
        <ul className="flex gap-5 border-b border-gray-600 pb-2">
          <li><Link to="/params" className="hover:text-blue-400">Params</Link></li>
          <li><Link to="#" className="hover:text-blue-400">Authorization</Link></li>
          <li><Link to="#" className="hover:text-blue-400">Headers</Link></li>
          <li><Link to="/body/none" className="hover:text-blue-400">Body</Link></li>
          <li><Link to="#" className="hover:text-blue-400">Script</Link></li>
          <li><Link to="#" className="hover:text-blue-400">Settings</Link></li>
        </ul>
        <div className="outlet mt-3">
          <Outlet context={{ formUrlencodedData, setFormUrlencodedData }} />
        </div>
      </div>
      <div className="response bg-gray-800 text-white h-64 w-full rounded border border-gray-600 p-4 fixed bottom-0 left-0 overflow-auto">
        <h1 className="text-2xl ml-4 underline decoration-2 underline-offset-4">RESPONSE</h1>
        {loading && <p className="ml-4 mt-2">Loading...</p>}
        {error && <p className="ml-4 mt-2 text-red-500">{error}</p>}
        {response && (
          <pre className="ml-4 mt-2 text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Home;