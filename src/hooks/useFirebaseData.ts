import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserData {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  createdAt: string;
  updatedAt: string;
  answers: Answer[];
  result: ResultData;
}

export interface Answer {
  questionId: string;
  value: string | number | boolean | string[];
}

export interface ResultData {
  emotionScore: number;
  functionScore: number;
  riskScore: number;
  profileType: string;
  profileLabel: string;
  triggers: string[];
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: string;
  benefit: string;
  steps: string[];
}

export interface CommunityMember {
  id: string;
  email: string;
  phone: string;
  joinedAt: string;
}

export function useFirebaseUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        
        const userData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserData[];
        
        setUsers(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return { users, loading, error, refetch: () => setLoading(true) };
}

export function useFirebaseCommunity() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommunity() {
      try {
        const communityRef = collection(db, "community");
        const q = query(communityRef, orderBy("joinedAt", "desc"));
        const snapshot = await getDocs(q);
        
        const communityData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CommunityMember[];
        
        setMembers(communityData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch community");
      } finally {
        setLoading(false);
      }
    }

    fetchCommunity();
  }, []);

  return { members, loading, error };
}