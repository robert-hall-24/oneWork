// Client/apis/taskService.ts
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';

export interface Task {
  id?: string;
  name: string;
  description: string;
  createdAt?: Timestamp;
}

export async function fetchTasks(): Promise<Task[]> {
  const snapshot = await getDocs(collection(db, 'tasks'));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'tasks'), {
    ...task,
    createdAt: new Date(),
  });
  return docRef.id;
}
