import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const KeyValueTable = ({ data, setData }) => {
  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const addRow = () => setData([...data, { key: "", value: "" }]);
  const removeRow = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
  };

  return (
    <div>
      {data.map((row, index) => (
        <div key={index} className="flex space-x-2 mb-1">
          <input
            type="text"
            value={row.key}
            placeholder="Key"
            onChange={(e) => handleChange(index, "key", e.target.value)}
            className="border px-2 py-1 rounded w-1/2 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
          <input
            type="text"
            value={row.value}
            placeholder="Value"
            onChange={(e) => handleChange(index, "value", e.target.value)}
            className="border px-2 py-1 rounded w-1/2 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
          <button onClick={() => removeRow(index)} className="text-red-600 font-bold">×</button>
        </div>
      ))}
      <button onClick={addRow} className="text-sm text-blue-600 mt-1">+ Add</button>
    </div>
  );
};

const Home = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [queryParams, setQueryParams] = useState([{ key: "", value: "" }]);
  const [bodyType, setBodyType] = useState("none");
  const [jsonBody, setJsonBody] = useState("{\n  \n}");
  const [formData, setFormData] = useState([{ key: "", value: "" }]);
  const [urlEncoded, setUrlEncoded] = useState([{ key: "", value: "" }]);
  const [response, setResponse] = useState(null);
  const [resTime, setResTime] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [resHeaders, setResHeaders] = useState(null);
  const [error, setError] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const userId = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        if (!userId || !token) {
          toast.error("Please log in to view collections", { toastId: "auth-error-collections" });
          setCollections([]);
          return;
        }

        const toastId = toast.loading("Fetching collections...");
        const res = await axios.get(`http://localhost:5000/api/collections/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(res.data) ? res.data : [];
        setCollections(data);
        toast.update(toastId, {
          render: "Collections loaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (err) {
        console.error("Error fetching collections:", err.response?.data || err.message);
        toast.error(`Failed to fetch collections: ${err.response?.data?.message || err.message}`, {
          toastId: "fetch-collections-error",
        });
        setCollections([]);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    const fetchFolders = async () => {
      if (!selectedCollection) {
        setFolders([]);
        return;
      }
      try {
        const toastId = toast.loading("Fetching folders...");
        const res = await axios.get(`http://localhost:5000/api/folders/${selectedCollection}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = Array.isArray(res.data) ? res.data : [];
        setFolders(data);
        toast.update(toastId, {
          render: "Folders loaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (err) {
        console.error("Error fetching folders:", err.response?.data || err.message);
        toast.error(`Failed to fetch folders: ${err.response?.data?.message || err.message}`, {
          toastId: "fetch-folders-error",
        });
        setFolders([]);
      }
    };

    fetchFolders();
  }, [selectedCollection]);

  const handleSend = async () => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      toast.error("Please log in to send API requests", { toastId: "auth-error-send" });
      return;
    }

    if (!url.trim()) {
      toast.warn("Please enter a valid URL", { toastId: "url-warn" });
      return;
    }
    try {
      setResponse(null);
      setError(null);
      setStatusCode(null);
      setResHeaders(null);

      const headersObj = {};
      headers.forEach(({ key, value }) => {
        if (key) headersObj[key] = value;
      });

      const queryString = queryParams
        .filter(({ key }) => key)
        .map(({ key, value }) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");

      const fullUrl = queryString ? `${url}?${queryString}` : url;

      let body = null;
      if (!["GET", "DELETE"].includes(method)) {
        if (bodyType === "raw") {
          try {
            body = JSON.parse(jsonBody || "{}");
          } catch (e) {
            toast.error("Invalid JSON body", { toastId: "json-error" });
            return;
          }
        } else if (bodyType === "form-data") {
          body = new FormData();
          formData.forEach(({ key, value }) => key && body.append(key, value));
        } else if (bodyType === "x-www-form-urlencoded") {
          const encoded = new URLSearchParams();
          urlEncoded.forEach(({ key, value }) => key && encoded.append(key, value));
          body = encoded;
          headersObj["Content-Type"] = "application/x-www-form-urlencoded";
        }
      }

      const toastId = toast.loading("Sending request...");
      const start = performance.now();
      const res = await axios({
        method,
        url: fullUrl,
        headers: headersObj,
        data: body,
      });
      const end = performance.now();

      setResponse(res.data);
      setStatusCode(res.status);
      setResTime(Math.round(end - start));
      setResHeaders(res.headers);

      // Save to history
      await axios.post(
        "http://localhost:5000/api/history",
        {
          url: fullUrl,
          method,
          statusCode: res.status,
          responseTime: Math.round(end - start),
          responseData: res.data,
          user: localStorage.getItem("id"),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.update(toastId, {
        render: "Request sent successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      const end = performance.now();
      setError(err.response?.data || err.message);
      setStatusCode(err.response?.status || "Error");
      setResHeaders(err.response?.headers || {});
      setResTime(Math.round(end - start));

      // Save error to history
      await axios.post(
        "http://localhost:5000/api/history",
        {
          url: fullUrl,
          method,
          statusCode: err.response?.status || 0,
          responseTime: Math.round(end - start),
          responseData: err.response?.data || err.message,
          user: localStorage.getItem("id"),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.error(`Failed to send request: ${err.response?.data?.message || err.message}`, {
        toastId: "send-error",
      });
    }
  };

  const handleSaveRequest = async () => {
    if (!selectedCollection) {
      toast.warn("Please select a collection", { toastId: "no-collection" });
      return;
    }
    if (!url.trim()) {
      toast.warn("Please enter a valid URL", { toastId: "no-url" });
      return;
    }
    try {
      const payload = {
        collectionId: selectedCollection,
        folderId: selectedFolder || null,
        request: {
          method,
          url,
          headers: headers.filter(h => h.key),
          params: queryParams.filter(q => q.key),
          bodyType,
          body:
            bodyType === "raw"
              ? jsonBody
              : bodyType === "form-data"
              ? formData.filter(f => f.key)
              : bodyType === "x-www-form-urlencoded"
              ? urlEncoded.filter(u => u.key)
              : null,
        },
      };

      const res = await axios.post("http://localhost:5000/api/requests", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.update(toastId, {
        render: "Request saved successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      console.log("Saved request:", res.data);
    } catch (err) {
      console.error("Failed to save request:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error(`Failed to save request: ${err.response?.data?.message || err.message}`, {
        toastId: "save-request-error",
      });
    }
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto dark:bg-gray-900">
      {/* <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">API Tester</h2> */}

      {/* Collection & Folder Selector */}
      <div className="flex space-x-4 mb-4">
        <select
          value={selectedCollection}
          onChange={(e) => {
            setSelectedCollection(e.target.value);
            setSelectedFolder("");
          }}
          className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        >
          <option value="">Select Collection</option>
          {Array.isArray(collections) && collections.length > 0 ? (
            collections.map((col) => (
              <option key={col._id} value={col._id}>{col.collectionname}</option>
            ))
          ) : (
            <option disabled>No collections available</option>
          )}
        </select>

        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          disabled={!folders.length}
        >
          <option value="">Select Folder (Optional)</option>
          {folders.map((folder) => (
            <option key={folder._id} value={folder._id}>{folder.foldername}</option>
          ))}
        </select>

        <button
          onClick={handleSaveRequest}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          disabled={!selectedCollection}
        >
          Save Request
        </button>
      </div>

      {/* Method & URL */}
      <div className="flex space-x-2 mb-4">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </select>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Request URL"
          className="flex-1 border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>

      {/* Headers */}
      <div className="mb-4">
        <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-100">Headers</h3>
        <KeyValueTable data={headers} setData={setHeaders} />
      </div>

      {/* Query Params */}
      <div className="mb-4">
        <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-100">Query Parameters</h3>
        <KeyValueTable data={queryParams} setData={setQueryParams} />
      </div>

      {/* Body Type */}
      {!(method === "GET" || method === "DELETE") && (
        <div className="mb-4">
          <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-100">Body Type</h3>
          <select
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
            className="border px-2 py-1 rounded mb-2 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="raw">Raw (JSON)</option>
            <option value="none">None</option>
            <option value="form-data">Form-Data</option>
            <option value="x-www-form-urlencoded">x-www-form-urlencoded</option>
          </select>

          {bodyType === "raw" && (
            <textarea
              className="w-full border rounded p-2 font-mono dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              rows={8}
              value={jsonBody}
              onChange={(e) => setJsonBody(e.target.value)}
            />
          )}
          {bodyType === "form-data" && (
            <KeyValueTable data={formData} setData={setFormData} />
          )}
          {bodyType === "x-www-form-urlencoded" && (
            <KeyValueTable data={urlEncoded} setData={setUrlEncoded} />
          )}
        </div>
      )}

      {/* Response */}
      {(response || error) && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">Response</h3>

          <div className="flex space-x-4 mb-2 text-sm">
            <div>
              <strong>Status:</strong>{" "}
              <span className={statusCode >= 200 && statusCode < 300 ? "text-green-600" : "text-red-600"}>{statusCode}</span>
            </div>
            <div>
              <strong>Time:</strong> {resTime} ms
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-100">Headers</h4>
            <div className="bg-gray-800 p-2 rounded overflow-auto text-sm text-gray-100">
              <pre>{JSON.stringify(resHeaders, null, 2)}</pre>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-100">Body</h4>
            {error ? (
              <pre className="bg-gray-800 text-red-700 p-4 rounded whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
            ) : (
              <pre className="bg-gray-800 p-4 rounded whitespace-pre-wrap text-gray-100">{JSON.stringify(response, null, 2)}</pre>
            )}
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={localStorage.getItem("theme") || "light"}
      />
    </div>
  );
};

export default Home;