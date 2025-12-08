// VoiceGuard AI - Firestore References
// Centralized collection and document references for Firestore

import { getFirestore, collection, doc } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);

// Collections
export const usersCollection = collection(db, "users");

// Analysis collections are modularized by media type to keep audio and video separate.
// Default collection names: 'analyses_audio' and 'analyses_video'
export const analysisCollection = (userId, mediaType = "audio") => {
  const collName = mediaType === "video" ? "analyses_video" : "analyses_audio";
  return collection(doc(db, "users", userId), collName);
};

// User document reference
export const userDocRef = (userId) => doc(db, "users", userId);

// Individual analysis document reference
export const analysisDocRef = (userId, analysisId, mediaType = "audio") => {
  const collName = mediaType === "video" ? "analyses_video" : "analyses_audio";
  return doc(db, "users", userId, collName, analysisId);
};

// Get Firestore instance
export const getDb = () => db;

export default db;
