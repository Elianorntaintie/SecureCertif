import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAv5oOpsmp-_HPUXWpwexm0sIb9yjDC_bw",
  authDomain: "sercurecertif.firebaseapp.com",
  projectId: "sercurecertif",
  storageBucket: "sercurecertif.appspot.com",
  messagingSenderId: "11857109606",
  appId: "1:11857109606:web:b9cd78ca97ae6b5f2e83a7",
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage();

async function uploadToFirebase(file, fileName) {
  const storageRef = ref(storage, `OpepMedia/images/${fileName}`);
  const uploadTask = uploadBytes(storageRef, file);

  try {
    await uploadTask;
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image :", error);
    throw error;
  }
}

// Initialisation de l'application Firebase

const firestore = getFirestore(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseApp, firestore, db, uploadToFirebase };
