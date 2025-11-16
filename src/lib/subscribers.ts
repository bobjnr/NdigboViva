// Subscriber management using Firebase Firestore
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

interface Subscriber {
  email: string;
  name: string;
  blogNotifications: boolean;
  welcomeEmails: boolean;
  subscribedAt: string;
}

// In-memory cache (optional, for faster access)
let subscribersCache: Subscriber[] = [];
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60000; // 1 minute

// Add a new subscriber to Firestore
export async function addSubscriber(email: string, name: string, preferences: {
  blogNotifications?: boolean;
  welcomeEmails?: boolean;
} = {}) {
  try {
    const subscriberRef = doc(db, 'subscribers', email);
    
    const subscriberData = {
      email,
      name,
      blogNotifications: preferences.blogNotifications ?? true,
      welcomeEmails: preferences.welcomeEmails ?? true,
      subscribedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(subscriberRef, subscriberData, { merge: true });
    
    // Update cache
    const subscriber: Subscriber = {
      email,
      name,
      blogNotifications: subscriberData.blogNotifications,
      welcomeEmails: subscriberData.welcomeEmails,
      subscribedAt: new Date().toISOString(),
    };
    
    const existingIndex = subscribersCache.findIndex(sub => sub.email === email);
    if (existingIndex >= 0) {
      subscribersCache[existingIndex] = subscriber;
    } else {
      subscribersCache.push(subscriber);
    }
    
    console.log(`Subscriber added/updated in Firestore: ${email}`);
    return subscriber;
  } catch (error) {
    console.error('Error adding subscriber to Firestore:', error);
    // Fallback to in-memory storage if Firestore fails
    const subscriber: Subscriber = {
      email,
      name,
      blogNotifications: preferences.blogNotifications ?? true,
      welcomeEmails: preferences.welcomeEmails ?? true,
      subscribedAt: new Date().toISOString(),
    };
    
    const existingIndex = subscribersCache.findIndex(sub => sub.email === email);
    if (existingIndex >= 0) {
      subscribersCache[existingIndex] = subscriber;
    } else {
      subscribersCache.push(subscriber);
    }
    
    return subscriber;
  }
}

// Get all subscribers who want blog notifications
export async function getBlogNotificationSubscribers(): Promise<Subscriber[]> {
  try {
    const subscribers = await getAllSubscribers();
    return subscribers.filter(sub => sub.blogNotifications);
  } catch (error) {
    console.error('Error getting blog notification subscribers:', error);
    return subscribersCache.filter(sub => sub.blogNotifications);
  }
}

// Get all subscribers who want welcome emails
export async function getWelcomeEmailSubscribers(): Promise<Subscriber[]> {
  try {
    const subscribers = await getAllSubscribers();
    return subscribers.filter(sub => sub.welcomeEmails);
  } catch (error) {
    console.error('Error getting welcome email subscribers:', error);
    return subscribersCache.filter(sub => sub.welcomeEmails);
  }
}

// Get all subscribers from Firestore
export async function getAllSubscribers(): Promise<Subscriber[]> {
  try {
    // Check cache first
    const now = Date.now();
    if (subscribersCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
      return subscribersCache;
    }

    const subscribersRef = collection(db, 'subscribers');
    const snapshot = await getDocs(subscribersRef);
    
    const subscribers: Subscriber[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      subscribers.push({
        email: data.email,
        name: data.name,
        blogNotifications: data.blogNotifications ?? true,
        welcomeEmails: data.welcomeEmails ?? true,
        subscribedAt: data.subscribedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    // Update cache
    subscribersCache = subscribers;
    cacheTimestamp = now;
    
    return subscribers;
  } catch (error) {
    console.error('Error getting subscribers from Firestore:', error);
    return subscribersCache; // Return cache as fallback
  }
}

// Get subscriber count
export async function getSubscriberCount(): Promise<number> {
  try {
    const subscribers = await getAllSubscribers();
    return subscribers.length;
  } catch (error) {
    console.error('Error getting subscriber count:', error);
    return subscribersCache.length;
  }
}

// Update subscriber preferences
export async function updateSubscriberPreferences(email: string, preferences: {
  blogNotifications?: boolean;
  welcomeEmails?: boolean;
}): Promise<boolean> {
  try {
    const subscriberRef = doc(db, 'subscribers', email);
    
    await setDoc(subscriberRef, {
      ...preferences,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Update cache
    const subscriberIndex = subscribersCache.findIndex(sub => sub.email === email);
    if (subscriberIndex >= 0) {
      subscribersCache[subscriberIndex] = {
        ...subscribersCache[subscriberIndex],
        ...preferences
      };
    }
    
    console.log(`Updated preferences for: ${email}`);
    return true;
  } catch (error) {
    console.error('Error updating subscriber preferences:', error);
    return false;
  }
}

// Remove subscriber
export async function removeSubscriber(email: string): Promise<boolean> {
  try {
    const subscriberRef = doc(db, 'subscribers', email);
    const subscriberDoc = await getDoc(subscriberRef);
    
    if (subscriberDoc.exists()) {
      // In Firestore, we can mark as deleted or actually delete
      // For now, we'll just remove from cache
      subscribersCache = subscribersCache.filter(sub => sub.email !== email);
      console.log(`Removed subscriber: ${email}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error removing subscriber:', error);
    return false;
  }
}

// Get subscriber by email
export async function getSubscriber(email: string): Promise<Subscriber | null> {
  try {
    const subscriberRef = doc(db, 'subscribers', email);
    const subscriberDoc = await getDoc(subscriberRef);
    
    if (subscriberDoc.exists()) {
      const data = subscriberDoc.data();
      return {
        email: data.email,
        name: data.name,
        blogNotifications: data.blogNotifications ?? true,
        welcomeEmails: data.welcomeEmails ?? true,
        subscribedAt: data.subscribedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting subscriber:', error);
    return subscribersCache.find(sub => sub.email === email) || null;
  }
}
