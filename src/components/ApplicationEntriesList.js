import { useEffect, useState } from 'react';
import { getDocs, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';  // adjust the path accordingly
import ApplicationEntry from './ApplicationEntry';
import Pagination from '@mui/material/Pagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import '../styles.css';  // adjust the import path accordingly


function ApplicationEntriesList({ applications }) {
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("all");
  const itemsPerPage = 5;
  const [favouritePostIds, setFavouritePostIds] = useState([]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === "favourites") {
      fetchFavourites();
    } else if (newValue === "all") {
      // fetchAllApplications(); // Call this if you have a separate function for fetching all applications.
    }
  };



  const fetchFavourites = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const favsQuery = query(
        collection(db, 'favourites'),
        where("userId", "==", userId)
      );
      const favsSnapshot = await getDocs(favsQuery);
      const userFavs = favsSnapshot.docs.map(doc => doc.data().postId);
      setFavouritePostIds(userFavs);
    }
  };

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const favsQuery = query(
      collection(db, 'favourites'),
      where("userId", "==", userId)
    );

    // This will fetch favorites in real-time
    const unsubscribe = onSnapshot(favsQuery, (snapshot) => {
      const userFavs = snapshot.docs.map(doc => doc.data().postId);
      setFavouritePostIds(userFavs);
    });

    return () => unsubscribe();
  }, []);


  const renderContent = () => {
    switch (selectedTab) {
      case 'all':
        return applications;
      case 'favourites':
        return applications.filter(app => favouritePostIds.includes(app.id));
      default:
        return applications;
    }
  };


  const applicationsToRender = renderContent();

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const applicationsToDisplay = applicationsToRender.slice(start, end);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-8 mb-3">Admin Dashboard</h1>
      <Box sx={{ width: '100%', mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="admin tabs"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#E9B10E'
            },
            '& .MuiTab-root': {  // Styles for default tabs
              color: 'grey',
            },
            '& .MuiTab-textColorSecondary.Mui-selected': {  // Styles for selected tab
              color: '#000000',
            }
          }}
        >
          <Tab value="all" label="All" />
          <Tab value="favourites" label="Favourites" />
        </Tabs>

      </Box>

      <div className="w-full lg:w-2/3 ml-auto lg:ml-0">
        <p className="text-gray-500 text-sm mb-3">FILTERS</p>
      </div>

      <div className="application-entries-list w-full lg:w-2/3 shadow-centered">
        {applicationsToDisplay.map((application, index) => (
          <ApplicationEntry key={application.name} application={application} />
        ))}


      </div>
      <div className="mt-5">
        <Pagination
          count={Math.ceil(applicationsToRender.length / itemsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              color: 'grey',  // Default color for all items
            },
            '& .MuiPaginationItem-page.Mui-selected': {
              backgroundColor: '#E9B10E',
              color: 'white',  // Text color for the selected page
              '&:hover': {
                backgroundColor: '#E9B10E',
                opacity: 0.9,
              },
            },
            '& .MuiPaginationItem-page.Mui-selected.Mui-focusVisible': {
              backgroundColor: '#E9B10E',
            },
          }}
        />
      </div>
    </div>
  );
}

export default ApplicationEntriesList;
