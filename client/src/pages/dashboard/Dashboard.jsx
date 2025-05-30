import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [collections, setCollections] = useState([]);
  const [folders, setFolders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [history, setHistory] = useState([]);
  const [historySearch, setHistorySearch] = useState("");
  const [folderName, setFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [stats, setStats] = useState({ totalCollections: 0, totalFolders: 0, collectionFolders: 0, collectionRequests: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        if (!userId || !token) {
          toast.error("Please log in to view dashboard", { toastId: "auth-error" });
          setCollections([]);
          setHistory([]);
          return;
        }

        const toastId = toast.loading("Loading dashboard...");
        // Fetch collections
        const colRes = await axios.get(`http://localhost:5000/api/collections/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const colData = Array.isArray(colRes.data) ? colRes.data : []; // Fixed: Use colRes.data
        setCollections(colData);

        // Fetch total folders
        let totalFolders = 0;
        for (const collection of colData) {
          const foldersRes = await axios.get(`http://localhost:5000/api/folders/${collection._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          totalFolders += Array.isArray(foldersRes.data) ? foldersRes.data.length : 0;
        }

        // Fetch history
        const histRes = await axios.get(`http://localhost:5000/api/history/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const histData = Array.isArray(histRes.data) ? histRes.data : [];
        setHistory(histData);

        setStats((prev) => ({
          ...prev,
          totalCollections: colData.length,
          totalFolders,
        }));
        toast.update(toastId, {
          render: "Dashboard loaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        toast.error(`Failed to fetch data: ${err.response?.data?.message || err.message}`, {
          toastId: "fetch-error",
        });
        setCollections([]);
        setHistory([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFoldersAndStats = async () => {
      if (!selectedCollection) {
        setFolders([]);
        setStats((prev) => ({ ...prev, collectionFolders: 0, collectionRequests: 0 }));
        return;
      }
      try {
        const toastId = toast.loading("Fetching folders...");
        const res = await axios.get(`http://localhost:5000/api/folders/${selectedCollection}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const folderData = Array.isArray(res.data) ? res.data : [];
        setFolders(folderData);

        // Fetch request count for selected collection
        let requestCount = 0;
        for (const folder of folderData) {
          const requestsRes = await axios.get(`http://localhost:5000/api/requests/${folder._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          requestCount += Array.isArray(requestsRes.data) ? requestsRes.data.length : 0;
        }

        setStats((prev) => ({
          ...prev,
          collectionFolders: folderData.length,
          collectionRequests: requestCount,
        }));
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

    fetchFoldersAndStats();
  }, [selectedCollection]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!selectedFolder) {
        setRequests([]);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/api/requests/${selectedFolder}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const requestData = Array.isArray(res.data) ? res.data : [];
        setRequests(requestData);
      } catch (err) {
        console.error("Error fetching requests:", err.response?.data || err.message);
        toast.error(`Failed to fetch requests: ${err.response?.data?.message || err.message}`, {
          toastId: "fetch-requests-error",
        });
        setRequests([]);
      }
    };

    fetchRequests();
  }, [selectedFolder]);

  const handleCreateCollection = async () => {
    const name = prompt("Enter collection name:");
    if (!name?.trim()) {
      toast.warn("Collection name cannot be empty", { toastId: "collection-warn" });
      return;
    }
    try {
      const toastId = toast.loading("Creating collection...");
      const res = await axios.post(
        `http://localhost:5000/api/collections`,
        { collectionname: name, user: localStorage.getItem("id") },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCollections((prev) => [...prev, res.data]);
      setStats((prev) => ({ ...prev, totalCollections: prev.totalCollections + 1 }));
      toast.update(toastId, {
        render: "Collection created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error creating collection:", err.response?.data || err.message);
      toast.error(`Failed to create collection: ${err.response?.data?.message || err.message}`, {
        toastId: "collection-error",
      });
    }
  };

  const handleCreateFolder = async () => {
    if (!selectedCollection) {
      toast.warn("Please select a collection", { toastId: "no-collection" });
      return;
    }
    if (!folderName.trim()) {
      toast.warn("Please enter a folder name", { toastId: "no-folder-name" });
      return;
    }
    try {
      const toastId = toast.loading("Creating folder...");
      const res = await axios.post(
        `http://localhost:5000/api/folders`,
        { foldername: folderName, collection: selectedCollection },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setFolders((prev) => [...prev, res.data]);
      setFolderName("");
      setShowFolderInput(false);
      setStats((prev) => ({
        ...prev,
        totalFolders: prev.totalFolders + 1,
        collectionFolders: prev.collectionFolders + 1,
      }));
      toast.update(toastId, {
        render: "Folder created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error creating folder:", err.response?.data || err.message);
      toast.error(`Failed to create folder: ${err.response?.data?.message || err.message}`, {
        toastId: "folder-error",
      });
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!confirm("Are you sure you want to delete this collection and all its folders/requests?")) return;
    try {
      const toastId = toast.loading("Deleting collection...");
      await axios.delete(`http://localhost:5000/api/collections/${collectionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCollections((prev) => prev.filter((col) => col._id !== collectionId));
      if (selectedCollection === collectionId) {
        setSelectedCollection("");
        setFolders([]);
        setRequests([]);
        setStats((prev) => ({ ...prev, collectionFolders: 0, collectionRequests: 0 }));
      }
      // Update stats
      const foldersRes = await axios.get(`http://localhost:5000/api/folders/${collectionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const folderCount = Array.isArray(foldersRes.data) ? foldersRes.data.length : 0;
      setStats((prev) => ({
        ...prev,
        totalCollections: prev.totalCollections - 1,
        totalFolders: prev.totalFolders - folderCount,
      }));
      toast.update(toastId, {
        render: "Collection deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error deleting collection:", err.response?.data || err.message);
      toast.error(`Failed to delete collection: ${err.response?.data?.message || err.message}`, {
        toastId: "delete-collection-error",
      });
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm("Are you sure you want to delete this folder and its requests?")) return;
    try {
      const toastId = toast.loading("Deleting folder...");
      await axios.delete(`http://localhost:5000/api/folders/${folderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFolders((prev) => prev.filter((folder) => folder._id !== folderId));
      if (selectedFolder === folderId) {
        setSelectedFolder("");
        setRequests([]);
      }
      setStats((prev) => ({
        ...prev,
        totalFolders: prev.totalFolders - 1,
        collectionFolders: prev.collectionFolders - 1,
      }));
      toast.update(toastId, {
        render: "Folder deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error deleting folder:", err.response?.data || err.message);
      toast.error(`Failed to delete folder: ${err.response?.data?.message || err.message}`, {
        toastId: "delete-folder-error",
      });
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear all API history?")) return;
    try {
      const toastId = toast.loading("Clearing history...");
      await axios.delete(`http://localhost:5000/api/history/${localStorage.getItem("id")}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setHistory([]);
      toast.update(toastId, {
        render: "History cleared successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error clearing history:", err.response?.data || err.message);
      toast.error(`Failed to clear history: ${err.response?.data?.message || err.message}`, {
        toastId: "clear-history-error",
      });
    }
  };

  const filteredHistory = history.filter(
    (item) =>
      item.url?.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.method?.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="p-4 max-w-screen-lg mx-auto dark:bg-gray-900 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">API Tester Dashboard</h1>

      {/* Stats */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.totalCollections}</p>
            <p className="text-gray-600 dark:text-gray-300">Total Collections</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.totalFolders}</p>
            <p className="text-gray-600 dark:text-gray-300">Total Folders</p>
          </div>
          {selectedCollection && (
            <>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.collectionFolders}</p>
                <p className="text-gray-600 dark:text-gray-300">Folders in Selected Collection</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.collectionRequests}</p>
                <p className="text-gray-600 dark:text-gray-300">Requests in Selected Collection</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Collection Management */}
      <div className="flex gap-2">
        <button
          onClick={handleCreateCollection}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
        >
          + Collection
        </button>
        <button
          onClick={() => setShowFolderInput(!showFolderInput)}
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
        >
          {showFolderInput ? "Cancel" : "+ Folder"}
        </button>
      </div>

      {showFolderInput && (
        <div className="mt-2">
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            className="border px-2 py-1 rounded w-full mb-2 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
          <button
            onClick={handleCreateFolder}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Create Folder
          </button>
        </div>
      )}

      {/* Collection Selector */}
      <div>
        <label className="block mb-1 font-medium text-gray-800 dark:text-gray-100">Select Collection:</label>
        <select
          className="border px-2 py-1 rounded w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          onChange={(e) => {
            setSelectedCollection(e.target.value);
            setSelectedFolder("");
          }}
          value={selectedCollection}
        >
          <option value="">-- Select Collection --</option>
          {collections.length > 0 ? (
            collections.map((col) => (
              <option key={col._id} value={col._id}>
                {col.collectionname}
              </option>
            ))
          ) : (
            <option disabled>No collections available</option>
          )}
        </select>
      </div>

      {/* Collections List */}
      <div>
        <h2 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-100">Collections</h2>
        {collections.length > 0 ? (
          <ul className="space-y-2">
            {collections.map((col) => (
              <li key={col._id} className="flex justify-between items-center">
                <span>{col.collectionname}</span>
                <button
                  onClick={() => handleDeleteCollection(col._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No collections available</p>
        )}
      </div>

      {/* Folders List */}
      {selectedCollection && (
        <div>
          <h2 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-100">Folders</h2>
          <select
            className="border px-2 py-1 rounded w-full mb-2 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            onChange={(e) => setSelectedFolder(e.target.value)}
            value={selectedFolder}
          >
            <option value="">-- Select Folder --</option>
            {folders.length > 0 ? (
              folders.map((folder) => (
                <option key={folder._id} value={folder._id}>
                  {folder.foldername}
                </option>
              ))
            ) : (
              <option disabled>No folders available</option>
            )}
          </select>
          {folders.length > 0 ? (
            <ul className="space-y-2">
              {folders.map((folder) => (
                <li key={folder._id} className="flex justify-between items-center">
                  <span>{folder.foldername}</span>
                  <button
                    onClick={() => handleDeleteFolder(folder._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No folders available</p>
          )}
        </div>
      )}

      {/* Requests List */}
      {selectedFolder && (
        <div>
          <h2 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-100">Requests</h2>
          {requests.length > 0 ? (
            <ul className="space-y-2">
              {requests.map((req) => (
                <li key={req._id}>
                  <span className="font-medium">{req.method}</span> {req.url}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No requests available</p>
          )}
        </div>
      )}

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-100">API History</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            placeholder="Search by URL or method"
            className="border px-2 py-1 rounded w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
          <button
            onClick={handleClearHistory}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Clear History
          </button>
        </div>
        {filteredHistory.length > 0 ? (
          <ul className="space-y-2">
            {filteredHistory.map((item) => (
              <li key={item._id}>
                <span className="font-medium">{item.method}</span> {item.url}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No history available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;