import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';  // Ensure this path is correct
import ApplicationEntriesList from './ApplicationEntriesList';  // Import the component
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    const db = getFirestore();  // Get Firestore instance
    const appsCollection = collection(db, 'applications');  // Reference to 'applications' collection
    const appSnapshot = await getDocs(appsCollection);  // Get document snapshot
    const appList = appSnapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data() 
    }));
      // Map over documents and get passdata
    setApplications(appList);  // Set state
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, 'fake@gmail.com', password);
      setIsAuthenticated(true);
      fetchApplications();  // Fetch applications upon successful authentication
    } catch (error) {
      alert('Incorrect password or email');
    }
  };
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true);
        fetchApplications();  // Fetch applications when authenticated
      } else {
        setIsAuthenticated(false);
      }
    });
  
    return () => unsubscribe();  // Cleanup subscription on unmount
  }, []);
  

  return (
    <div>
      {isAuthenticated ? (
        <ApplicationEntriesList applications={applications} />  // Use the component here
      ) : (
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}


export default AdminPage;
