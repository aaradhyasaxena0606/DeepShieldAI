// VoiceGuard AI - Firestore References
// Centralized collection and document references for Firestore

import { getFirestore, collection, doc } from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);

// Collections
export const usersCollection = collection(db, 'users');
export const analysisCollection = (userId) => collection(doc(db, 'users', userId), 'analyses');

// User document reference
export const userDocRef = (userId) => doc(db, 'users', userId);

// Individual analysis document reference
export const analysisDocRef = (userId, analysisId) =>
  doc(db, 'users', userId, 'analyses', analysisId);

// Get Firestore instance
export const getDb = () => db;

export default db;
