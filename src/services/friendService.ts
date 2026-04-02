import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Friendship {
  id: string;
  users: string[];
  status: 'pending' | 'accepted';
  requester_id: string;
  created_at: any;
}

const getFriendshipId = (uid1: string, uid2: string) => {
  return [uid1, uid2].sort().join('_');
};

export const sendFriendRequest = async (fromUid: string, toUid: string) => {
  const friendshipId = getFriendshipId(fromUid, toUid);
  const friendshipRef = doc(db, 'friendships', friendshipId);
  
  await setDoc(friendshipRef, {
    users: [fromUid, toUid],
    status: 'pending',
    requester_id: fromUid,
    created_at: serverTimestamp()
  });
};

export const acceptFriendRequest = async (friendshipId: string) => {
  const friendshipRef = doc(db, 'friendships', friendshipId);
  await updateDoc(friendshipRef, {
    status: 'accepted'
  });
};

export const cancelFriendRequest = async (friendshipId: string) => {
  const friendshipRef = doc(db, 'friendships', friendshipId);
  await deleteDoc(friendshipRef);
};

export const unfriend = async (friendshipId: string) => {
  const friendshipRef = doc(db, 'friendships', friendshipId);
  await deleteDoc(friendshipRef);
};

export const getFriendships = (uid: string, callback: (friendships: Friendship[]) => void) => {
  const q = query(collection(db, 'friendships'), where('users', 'array-contains', uid));
  return onSnapshot(q, (snapshot) => {
    const friendships = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Friendship));
    callback(friendships);
  });
};

export const getMutualFriends = async (uid1: string, uid2: string) => {
  const q1 = query(collection(db, 'friendships'), where('users', 'array-contains', uid1), where('status', '==', 'accepted'));
  const q2 = query(collection(db, 'friendships'), where('users', 'array-contains', uid2), where('status', '==', 'accepted'));
  
  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  
  const friends1 = new Set(snap1.docs.map(doc => {
    const data = doc.data();
    return data.users.find((u: string) => u !== uid1);
  }));
  
  const friends2 = snap2.docs.map(doc => {
    const data = doc.data();
    return data.users.find((u: string) => u !== uid2);
  });
  
  return friends2.filter(f => friends1.has(f));
};
