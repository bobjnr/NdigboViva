// Simple in-memory subscriber management
// In production, you'd use a database like Firebase Firestore, Supabase, or MongoDB

interface Subscriber {
  email: string;
  name: string;
  blogNotifications: boolean;
  welcomeEmails: boolean;
  subscribedAt: string;
}

// In-memory storage (will reset when server restarts)
// In production, replace this with a real database
let subscribers: Subscriber[] = [];

// Add a new subscriber
export function addSubscriber(email: string, name: string, preferences: {
  blogNotifications?: boolean;
  welcomeEmails?: boolean;
} = {}) {
  const existingIndex = subscribers.findIndex(sub => sub.email === email);
  
  const subscriber: Subscriber = {
    email,
    name,
    blogNotifications: preferences.blogNotifications ?? true, // Default to true
    welcomeEmails: preferences.welcomeEmails ?? true, // Default to true
    subscribedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    // Update existing subscriber
    subscribers[existingIndex] = { ...subscribers[existingIndex], ...subscriber };
  } else {
    // Add new subscriber
    subscribers.push(subscriber);
  }

  console.log(`Subscriber added/updated: ${email}`);
  return subscriber;
}

// Get all subscribers who want blog notifications
export function getBlogNotificationSubscribers(): Subscriber[] {
  return subscribers.filter(sub => sub.blogNotifications);
}

// Get all subscribers who want welcome emails
export function getWelcomeEmailSubscribers(): Subscriber[] {
  return subscribers.filter(sub => sub.welcomeEmails);
}

// Get all subscribers
export function getAllSubscribers(): Subscriber[] {
  return subscribers;
}

// Get subscriber count
export function getSubscriberCount(): number {
  return subscribers.length;
}

// Update subscriber preferences
export function updateSubscriberPreferences(email: string, preferences: {
  blogNotifications?: boolean;
  welcomeEmails?: boolean;
}) {
  const subscriberIndex = subscribers.findIndex(sub => sub.email === email);
  
  if (subscriberIndex >= 0) {
    subscribers[subscriberIndex] = {
      ...subscribers[subscriberIndex],
      ...preferences
    };
    console.log(`Updated preferences for: ${email}`);
    return true;
  }
  
  return false;
}

// Remove subscriber
export function removeSubscriber(email: string): boolean {
  const initialLength = subscribers.length;
  subscribers = subscribers.filter(sub => sub.email !== email);
  
  if (subscribers.length < initialLength) {
    console.log(`Removed subscriber: ${email}`);
    return true;
  }
  
  return false;
}

// Get subscriber by email
export function getSubscriber(email: string): Subscriber | null {
  return subscribers.find(sub => sub.email === email) || null;
}
