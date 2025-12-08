// VoiceGuard AI - Firestore Data Structure & Paths
// Defines document structures and helper functions for Firestore operations

import {
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  increment,
  onSnapshot,
} from "firebase/firestore";
import {
  userDocRef,
  analysisDocRef,
  analysisCollection,
} from "./firestoreRefs";

// ============================================================================
// User Document Structure
// ============================================================================
export const createUserProfile = (userId, email, displayName, authMethod) => ({
  uid: userId,
  email,
  displayName: displayName || email.split("@")[0],
  authMethod, // 'email', 'google', etc.
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  analysisCount: 0,
  preferences: {
    saveAnalyses: true,
  },
});

// ============================================================================
// Analysis Document Structure
// ============================================================================
export const createAnalysisRecord = (
  analysisData,
  filename,
  mediaType = "audio"
) => ({
  filename,
  prediction: analysisData.prediction,
  confidence: analysisData.confidence,
  explanation: analysisData.explanation || null,
  patterns: analysisData.patterns || [],
  metadata: {
    duration: analysisData.duration || null,
    sampleRate: analysisData.sampleRate || null,
    format: mediaType || analysisData.format || "audio",
  },
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

// ============================================================================
// User Operations
// ============================================================================

/**
 * Create or get user profile in Firestore
 * Called during signup or first login
 */
export const initializeUserProfile = async (
  userId,
  email,
  displayName,
  authMethod
) => {
  try {
    const userRef = userDocRef(userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userProfile = createUserProfile(
        userId,
        email,
        displayName,
        authMethod
      );
      await setDoc(userRef, userProfile);
      return userProfile;
    }
    return userSnap.data();
  } catch (error) {
    console.error("Error initializing user profile:", error);
    throw error;
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = userDocRef(userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = userDocRef(userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// ============================================================================
// Analysis Operations
// ============================================================================

/**
 * Save analysis result to Firestore
 * Automatically increments user's analysisCount
 */
export const saveAnalysisToFirestore = async (
  userId,
  analysisData,
  filename,
  mediaType = "audio"
) => {
  try {
    const analysisId = `analysis_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const analysisRef = analysisDocRef(userId, analysisId, mediaType);
    const analysisRecord = createAnalysisRecord(
      analysisData,
      filename,
      mediaType
    );

    // Save analysis
    await setDoc(analysisRef, analysisRecord);

    // Increment user's analysis count using Firestore increment
    const userRef = userDocRef(userId);
    await updateDoc(userRef, {
      analysisCount: increment(1),
      updatedAt: serverTimestamp(),
    });

    return { id: analysisId, ...analysisRecord };
  } catch (error) {
    console.error("Error saving analysis:", error);
    throw error;
  }
};

/**
 * Get all analyses for a user
 * Returns analyses sorted by creation date (newest first)
 */
export const getUserAnalyses = async (userId, mediaType = "audio") => {
  try {
    const analysesRef = analysisCollection(userId, mediaType);
    const q = query(analysesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const analyses = [];
    querySnapshot.forEach((doc) => {
      analyses.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return analyses;
  } catch (error) {
    console.error("Error getting analyses:", error);
    throw error;
  }
};

/**
 * Subscribe to user's analyses in realtime (single media type).
 * Calls onUpdate with the latest analyses array whenever the collection changes.
 * Returns an unsubscribe function.
 */
export const subscribeToUserAnalyses = (
  userId,
  mediaType = "audio",
  onUpdate,
  onError
) => {
  try {
    const analysesRef = analysisCollection(userId, mediaType);
    const q = query(analysesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const analyses = [];
        querySnapshot.forEach((doc) => {
          analyses.push({ id: doc.id, ...doc.data() });
        });
        onUpdate(analyses);
      },
      (error) => {
        console.error("Error in analyses subscription:", error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up analyses subscription:", error);
    if (onError) onError(error);
    // return a noop unsubscribe so callers can safely call it
    return () => {};
  }
};

/**
 * Subscribe to ALL user's analyses (both audio and video) in realtime.
 * Merges both collections, sorted by creation date (newest first).
 * Calls onUpdate with the merged analyses array whenever either collection changes.
 * Returns an unsubscribe function that stops both subscriptions.
 */
export const subscribeToAllUserAnalyses = (userId, onUpdate, onError) => {
  try {
    let audioAnalyses = [];
    let videoAnalyses = [];

    // Subscribe to audio analyses
    const audioRef = analysisCollection(userId, "audio");
    const audioQuery = query(audioRef, orderBy("createdAt", "desc"));
    const unsubAudio = onSnapshot(
      audioQuery,
      (querySnapshot) => {
        audioAnalyses = [];
        querySnapshot.forEach((doc) => {
          audioAnalyses.push({ id: doc.id, ...doc.data(), mediaType: "audio" });
        });
        // Merge and sort by createdAt (newest first)
        const merged = [...audioAnalyses, ...videoAnalyses].sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });
        onUpdate(merged);
      },
      (error) => {
        console.error("Error in audio analyses subscription:", error);
        if (onError) onError(error);
      }
    );

    // Subscribe to video analyses
    const videoRef = analysisCollection(userId, "video");
    const videoQuery = query(videoRef, orderBy("createdAt", "desc"));
    const unsubVideo = onSnapshot(
      videoQuery,
      (querySnapshot) => {
        videoAnalyses = [];
        querySnapshot.forEach((doc) => {
          videoAnalyses.push({ id: doc.id, ...doc.data(), mediaType: "video" });
        });
        // Merge and sort by createdAt (newest first)
        const merged = [...audioAnalyses, ...videoAnalyses].sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });
        onUpdate(merged);
      },
      (error) => {
        console.error("Error in video analyses subscription:", error);
        if (onError) onError(error);
      }
    );

    // Return a combined unsubscribe function
    return () => {
      unsubAudio();
      unsubVideo();
    };
  } catch (error) {
    console.error("Error setting up all analyses subscription:", error);
    if (onError) onError(error);
    return () => {};
  }
};

/**
 * Get single analysis by ID
 */
export const getAnalysisById = async (
  userId,
  analysisId,
  mediaType = "audio"
) => {
  try {
    const analysisRef = analysisDocRef(userId, analysisId, mediaType);
    const analysisSnap = await getDoc(analysisRef);
    return analysisSnap.exists()
      ? { id: analysisSnap.id, ...analysisSnap.data() }
      : null;
  } catch (error) {
    console.error("Error getting analysis:", error);
    throw error;
  }
};

/**
 * Delete analysis by ID
 * Automatically decrements user's analysisCount
 */
export const deleteAnalysis = async (
  userId,
  analysisId,
  mediaType = "audio"
) => {
  try {
    const analysisRef = analysisDocRef(userId, analysisId, mediaType);
    await deleteDoc(analysisRef);

    // Decrement user's analysis count using Firestore increment
    const userRef = userDocRef(userId);
    await updateDoc(userRef, {
      analysisCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error deleting analysis:", error);
    throw error;
  }
};

/**
 * Delete all analyses for a user
 * Used for clearing history
 */
export const deleteAllAnalyses = async (userId, mediaType = "audio") => {
  try {
    const analyses = await getUserAnalyses(userId, mediaType);
    const deletePromises = analyses.map((analysis) =>
      deleteDoc(analysisDocRef(userId, analysis.id, mediaType))
    );
    await Promise.all(deletePromises);

    // Update user profile
    const userRef = userDocRef(userId);
    await updateDoc(userRef, {
      analysisCount: 0,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error deleting all analyses:", error);
    throw error;
  }
};

/**
 * Update analysis (for future use if needed)
 */
export const updateAnalysis = async (
  userId,
  analysisId,
  updates,
  mediaType = "audio"
) => {
  try {
    const analysisRef = analysisDocRef(userId, analysisId, mediaType);
    await updateDoc(analysisRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating analysis:", error);
    throw error;
  }
};
