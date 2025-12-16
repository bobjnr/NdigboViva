import { db } from './firebase';
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  blogNotifications?: boolean;
  welcomeEmails?: boolean;
}

/**
 * Save user data to Firestore when they sign up
 */
export async function saveUserToFirestore(userData: {
  uid: string;
  email: string;
  displayName: string;
  blogNotifications?: boolean;
  welcomeEmails?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(db, 'users', userData.uid);
    
    const userDoc: UserData = {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      blogNotifications: userData.blogNotifications ?? true,
      welcomeEmails: userData.welcomeEmails ?? true,
    };

    await setDoc(userRef, userDoc, { merge: true });
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save user data' 
    };
  }
}

/**
 * Get user data from Firestore
 */
export async function getUserFromFirestore(uid: string): Promise<UserData | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Update user preferences in Firestore
 */
export async function updateUserPreferences(
  uid: string, 
  preferences: {
    blogNotifications?: boolean;
    welcomeEmails?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(db, 'users', uid);
    
    await setDoc(userRef, {
      ...preferences,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update preferences' 
    };
  }
}

