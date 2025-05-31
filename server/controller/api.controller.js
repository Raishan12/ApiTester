import userSchema from "../models/user.model.js";
import Collection from "../models/collection.model.js";
import Folder from "../models/folder.model.js";
import Request from "../models/request.model.js";
import History from "../models/history.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!(name && email && password))
      return res.status(400).send("Incorrect email or password!");
    const userExist = await userSchema.findOne({ email });
    if (userExist)
      return res.status(400).send("User already exist");
    bcrypt.hash(password, 10).then(async (hashedpwd) => {
      const data = await userSchema.create({ name, email, password: hashedpwd });
      const token = await jwt.sign({ id: data._id }, process.env.JWT_KEY, { expiresIn: "20h" });
      res.status(201).send({ data, token });
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to save data!", error });
  }
};

export const authsignup = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userExist = await userSchema.findOne({ email });
    if (userExist) {
      if (userExist.auth0)
        return res.status(200).send({ message: "User loggedIn", userExist });
    }
    const data = await userSchema.create({ name, email, auth0: true });
    res.status(201).send({ message: "User LoggedIn", data });
  } catch (error) {
    res.status(500).send({ message: "failed to signup", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await userSchema.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "User not Found" });
    }
    const isPasswordMatch = await bcrypt.compare(password, userExist.password);
    if (!isPasswordMatch) {
      return res.status(402).json({ message: "Incorrect Password" });
    }
    const token = await jwt.sign({ id: userExist._id }, process.env.JWT_KEY, { expiresIn: "20h" });
    return res.status(200).json({ message: "User successfully Logged", token, user_id: userExist._id });
  } catch (error) {
    res.status(500).send("failed to fetch data!");
  }
};

export const getuser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await userSchema.findById(id);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("Failed to fetch data!");
  }
};

export const createCollection = async (req, res) => {
  try {
    const { collectionname, user } = req.body;
    const data = await Collection.create({ collectionname, user });
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({ message: "Failed to create collection", err });
  }
};

export const getCollections = async (req, res) => {
  try {
    const data = await Collection.find({ user: req.params.userId });
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send("Failed to get collections");
  }
};

export const createFolder = async (req, res) => {
  try {
    const { foldername, collection } = req.body;
    const data = await Folder.create({ foldername, collection });
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({ message: "Failed to create folder", err });
  }
};

export const getFolders = async (req, res) => {
  try {
    const data = await Folder.find({ collection: req.params.collectionId });
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send("Failed to get folders");
  }
};

export const saveRequest = async (req, res) => {
  try {
    const { collectionId, folderId, request } = req.body;
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return res.status(400).json({ message: "Invalid collection ID" });
    }
    if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: "Invalid folder ID" });
    }
    if (!request.method || !request.url) {
      return res.status(400).json({ message: "Method and URL are required" });
    }
    const newRequest = new Request({
      collection: collectionId,
      folder: folderId || null,
      user: userId,
      request,
    });
    await newRequest.save();
    res.status(201).json({ message: "Request saved successfully", data: newRequest });
  } catch (err) {
    console.error("Error saving request:", err);
    res.status(500).json({ message: "Error saving request", error: err.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({ folder: req.params.folderId });
    res.status(200).send(requests);
  } catch (err) {
    res.status(500).send("Failed to get requests");
  }
};

export const addHistory = async (req, res) => {
  try {
    const data = await History.create(req.body);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send("Failed to save history");
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.params.userId }).sort({ timestamp: -1 });
    res.status(200).send(history);
  } catch (err) {
    res.status(500).send("Failed to get history");
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const collections = await Collection.find({ user: userId }).populate('requests');
    const history = await History.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({
      collections,
      history,
    });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard fetch failed', error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.params.id;
    const user = await userSchema.findById(userId);
    if (!user) return res.status(404).send("User not found");
    if (email !== user.email) {
      const emailExists = await userSchema.findOne({ email });
      if (emailExists) return res.status(400).send("Email already in use");
    }
    user.name = name;
    user.email = email;
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: "Failed to update user", error: err.message });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userSchema.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });
    user.profilepicture = req.file.path;
    await user.save();
    res.status(200).json({ message: "Profile picture updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile picture", error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await userSchema.findById(userId);
    if (!user) return res.status(404).send("User not found");
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).send("Current password is incorrect");
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).send("Password changed successfully");
  } catch (err) {
    res.status(500).send({ message: "Failed to change password", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userSchema.findById(userId);
    if (!user) return res.status(404).send("User not found");
    await Collection.deleteMany({ user: userId });
    await Folder.deleteMany({ collection: { $in: await Collection.find({ user: userId }).select("_id") } });
    await Request.deleteMany({ user: userId });
    await History.deleteMany({ user: userId });
    await userSchema.findByIdAndDelete(userId);
    res.status(200).send("Account deleted successfully");
  } catch (err) {
    res.status(500).send({ message: "Failed to delete account", error: err.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const userId = req.user.id;
    const collection = await Collection.findOne({ _id: collectionId, user: userId });
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    const folders = await Folder.find({ collection: collectionId });
    const folderIds = folders.map(f => f._id);
    await Request.deleteMany({ folder: { $in: folderIds } });
    await Folder.deleteMany({ collection: collectionId });
    await Collection.deleteOne({ _id: collectionId });
    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting collection", error: err.message });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const userId = req.user.id;
    const folder = await Folder.findOne({ _id: folderId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    const collection = await Collection.findOne({ _id: folder.collection, user: userId });
    if (!collection) {
      return res.status(403).json({ message: "Unauthorized to delete this folder" });
    }
    await Request.deleteMany({ folder: folderId });
    await Folder.deleteOne({ _id: folderId });
    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting folder", error: err.message });
  }
};

export const clearHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to clear this history" });
    }
    await History.deleteMany({ user: userId });
    res.status(200).json({ message: "History cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing history", error: err.message });
  }
};