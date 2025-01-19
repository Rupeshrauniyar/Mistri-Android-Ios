const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
    authDomain: "mistri-2024.firebaseapp.com",
    projectId: "mistri-2024",
    storageBucket: "mistri-2024.appspot.com",
    messagingSenderId: "167499942364",
    appId: "1:167499942364:web:406c45ce32a7b8184ba719"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // Ensure `app` is passed here

module.exports = storage;
