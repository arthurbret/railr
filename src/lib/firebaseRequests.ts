import { ref, child, get } from "firebase/database";
import { db } from "./firebaseConfig";

export interface HeaderMessageType {
  message: string;
  link?: string;
}

export async function getHeaderMessage(): Promise<HeaderMessageType | null> {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, "header_message"));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}