// ============================================================
// CAMPUSLY — Firebase Config (Google Auth uniquement)
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBJCgCp26Y-9M1PHz2vvOQ8OyvxlwC-p3Y",
  authDomain:        "my-campusly-project-id.firebaseapp.com",
  projectId:         "my-campusly-project-id",
  storageBucket:     "my-campusly-project-id.firebasestorage.app",
  messagingSenderId: "830624589907",
  appId:             "1:830624589907:web:af57f0f65806fafdc77ea6"
};

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope("email");
provider.addScope("profile");

export { auth, provider, signInWithPopup };
