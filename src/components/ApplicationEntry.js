import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';  // adjust the path accordingly
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import '../styles.css';  // adjust the import path accordingly
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

// Define job title colors
const jobTitleColors = {
    'Software Engineer': '#007BFF', // Blue
    'Cult Manager': '#28a745', // Green
    'Manager': '#ff5722', // Deep orange
    // ... add other job titles and colors
};

function getShades(color) {
    // Compute the dark and light shades for the text and background. 
    // This is a simple manipulation. For complex color manipulations, consider using libraries like 'polished' or 'color'.
    return {
        dark: color, // Use the base color for dark
        light: `${color}33` // Append '33' for 20% opacity for a lighter shade
    };
}

function ApplicationEntry({ application }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const color = jobTitleColors[application.jobTitle] || '#000'; // Default to black if no color found for the job title
    const { dark, light } = getShades(color);

    const handleDeleteClick = () => {
        setOpenDialog(true);
    };


    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmDelete = async () => {
        try {
            const docRef = doc(db, "applications", application.id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                console.error("No document found with the given name:", application.id);
                return;
            }

            await deleteDoc(docRef);
            handleCloseDialog(); // Close the dialog after successful deletion

            console.log("Application deleted successfully!");
            // Optionally, you can also add some mechanism to refresh the list or indicate to the user that the deletion was successful.
        } catch (error) {
            console.error("Error deleting application:", error);
            // You can also show a user-friendly message if you prefer.
        }
    };


    useEffect(() => {
        // Check if the post is already liked by the user
        const checkLikedStatus = async () => {
            const docRef = doc(db, "favourites", `${auth.currentUser.uid}_${application.id}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setIsLiked(true);
            } else {
                setIsLiked(false);
            }
        };

        if (auth.currentUser) {
            checkLikedStatus();
        }
    }, [application.id]);

    const handleLikeToggle = async () => {
        const userId = auth.currentUser.uid;
        const postId = application.id;

        if (!postId || postId === undefined) {
            console.error("Invalid post ID:", postId);
            return;
        }

        const docRef = doc(db, "favourites", `${userId}_${postId}`);

        try {
            if (isLiked) {
                // If it's already liked, remove the favorite from Firestore
                await deleteDoc(docRef);
                setIsLiked(false);
            } else {
                // Else, add to Firestore
                await setDoc(docRef, {
                    userId: userId,
                    postId: postId,
                });
                setIsLiked(true);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };


    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };



    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            let truncationPoint = text.lastIndexOf(' ', maxLength);
            if (truncationPoint === -1) truncationPoint = maxLength;
            return text.slice(0, truncationPoint) + '...';
        }
        return text;
    };

    const iconStyle = {
        fontSize: '1.5rem',
    };

    const iconLikeStyle = {
        fontSize: '1.25rem',
    };

    const iconBinStyle = {
        fontSize: '1.35rem',
    };


    const iconButtonStyle = {
        padding: '8px',
        margin: '0 10px'
    };

    function NewlineText({ text }) {
        const newText = text.split('\n').map(str => <p key={str}>{str}</p>);
        return <>{newText}</>;
    }

    function convertNewlinesToBreaks(text) {
        return text.split('\n').map((str, index, array) => {
            if (index === array.length - 1) {
                return str; // Don't append a <br /> for the last line
            }
            return <>
                {str}
                <br />
            </>;
        });
    }


    return (
        <div className={`application-entry bg-white p-3 ${isExpanded ? 'expanded' : ''}`}>

            <div className="flex justify-between items-center">
                <div className="flex items-center flex-grow">
                    <p className="font-bold text-sm mr-4">{application.name}</p>
                    <div style={{ backgroundColor: light, color: dark }} className="rounded-full px-2 py-1 mr-4">
                        <p className='text-xs'>{application.jobTitle}</p>
                    </div>

                    {!isExpanded && <p className='text-sm hide-on-mobile'>{truncateText(application.message, 50)}</p>}
                </div>
                <div className="flex items-center">
                    <IconButton onClick={handleLikeToggle} style={iconButtonStyle} aria-label="like">
                        {isLiked ? <StarIcon style={{ ...iconLikeStyle, color: '#E9B10E' }} /> : <StarBorderIcon style={{ ...iconLikeStyle, color: 'grey' }} />}
                    </IconButton>

                    <IconButton onClick={handleDeleteClick} style={iconButtonStyle} aria-label="delete">
                        <DeleteIcon style={iconBinStyle} />
                    </IconButton>
                    <IconButton onClick={handleToggle} style={{ ...iconButtonStyle, transform: 'translateX(0)', transition: 'transform 0.3s' }} className="hover:translate-x-2" aria-label="expand">
                        {isExpanded ? <KeyboardArrowLeftIcon style={iconStyle} /> : <KeyboardArrowRightIcon style={iconStyle} />}
                    </IconButton>
                </div>
            </div>
            {isExpanded &&
                <div className='text-sm mb-3'>
                    {convertNewlinesToBreaks(application.message)}
                </div>

            }


            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Delete Application"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you wish to delete this application permanently?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        No
                    </Button>
                    <Button onClick={handleConfirmDelete} style={{ backgroundColor: '#f44336', color: 'white' }} autoFocus>
                        Yes
                    </Button>
                </DialogActions>

            </Dialog>
        </div>
    );

}

export default ApplicationEntry;
