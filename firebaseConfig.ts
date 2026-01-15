import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC8yMNLmhpVQxFdmWgdTjpN3PL3SnjrEHI',
  authDomain: 'my-wib-bb757.firebaseapp.com',
  projectId: 'my-wib-bb757',
  storageBucket: 'my-wib-bb757.firebasestorage.app',
  messagingSenderId: '1004620207542',
  appId: '1:1004620207542:web:baef815a5a7f53ae489d17',
  measurementId: 'G-28X6Q69WND'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };