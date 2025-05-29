import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [method, setMethod] = useState('get');
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formUrlencodedData, setFormUrlencodedData] = useState([{ key: '', value: '' }]);
  const [formData, setFormData] = useState([{ key: '', value: '' }]);
  const [params, setParams] = useState([{ key: '', value: '' }]);
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [rawBody, setRawBody] = useState('');
  const [responseTime, setResponseTime] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const location = useLocation();
  const navigate = useNavigate()

  const openparams = ()=>{
    navigate("/params")
  }

  useEffect(()=>{
    if(location.pathname==="/")
      openparams()
  },[])


  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setResponseTime(null);
    setStatusCode(null);

    let config = { method: method.toLowerCase(), url };
    const startTime = performance.now();

    // Add query parameters
    if (params.some(({ key, value }) => key && value)) {
      const queryString = params
        .filter(({ key, value }) => key && value)
        .map(({ key, value }) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      config.url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
    }

    // Add headers
    config.headers = headers.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {});

    // Handle body based on route
    if (location.pathname.includes('formurlencoded') && ['post', 'put', 'patch'].includes(method.toLowerCase())) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      const formData = new URLSearchParams();
      formUrlencodedData.forEach(({ key, value }) => {
        if (key && value) formData.append(key, value);
      });
      config.data = formData.toString();
    } else if (location.pathname.includes('formdata') && ['post', 'put', 'patch'].includes(method.toLowerCase())) {
      config.headers['Content-Type'] = 'multipart/form-data';
      const formDataObj = new FormData();
      formData.forEach(({ key, value }) => {
        if (key && value) formDataObj.append(key, value);
      });
      config.data = formDataObj;
    } else if (location.pathname.includes('raw') && ['post', 'put', 'patch'].includes(method.toLowerCase())) {
      try {
        config.headers['Content-Type'] = 'application/json';
        config.data = JSON.parse(rawBody || '{}');
      } catch (e) {
        setError('Invalid JSON format in raw body');
        setLoading(false);
        return;
      }
    }

    try {
      console.log(config)
      const res = await axios(config);
      setResponse(res.data);
      setStatusCode(res.status);
      setResponseTime((performance.now() - startTime).toFixed(2));
      setResponseHeaders(res.headers);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setStatusCode(err.response?.status || null);
      setResponseHeaders(err.response?.headers || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-4">
        <h1 className="text-white text-center text-2xl font-bold my-4">API TESTER ONLINE</h1>
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
            <li><Link to="/headers" className="hover:text-blue-400">Headers</Link></li>
            <li><Link to="/body/none" className="hover:text-blue-400">Body</Link></li>
            <li><Link to="#" className="hover:text-blue-400">Authorization</Link></li>
            <li><Link to="#" className="hover:text-blue-400">Script</Link></li>
            <li><Link to="#" className="hover:text-blue-400">Settings</Link></li>
          </ul>
          <div className="outlet mt-3">
            <Outlet context={{ formUrlencodedData, setFormUrlencodedData, formData, setFormData, params, setParams, headers, setHeaders, rawBody, setRawBody }} />
          </div>
        </div>
        <div className="response bg-gray-800 text-white h-64 w-full rounded border border-gray-600 p-4 mt-52 left-0 overflow-auto">
          <h1 className="text-2xl ml-4 underline decoration-2 underline-offset-4">RESPONSE</h1>
          {loading && <p className="ml-4 mt-2">Loading...</p>}
          {/* {error && <p className="ml-4 mt-2 text-red-500">{error}</p>} */}
          {response && (
            <div className="ml-4 mt-2">
              <p><strong>Status:</strong> {statusCode || 'N/A'}</p>
              <p><strong>Response Time:</strong> {responseTime ? `${responseTime} ms` : 'N/A'}</p>
              <p><strong>Headers:</strong></p>
              <pre className="text-sm">{JSON.stringify(response.headers || {}, null, 2)}</pre>
              <p><strong>Body:</strong></p>
              <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;