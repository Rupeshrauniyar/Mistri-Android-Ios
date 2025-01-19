import { initializeApp } from "firebase/app";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCBDHapTQ8n70tANpa6oYuBaYysYtLnbQ0",
    authDomain: "mistri-2024.firebaseapp.com",
    projectId: "mistri-2024",
    storageBucket: "mistri-2024.appspot.com",
    messagingSenderId: "167499942364",
    appId: "1:167499942364:web:406c45ce32a7b8184ba719"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);