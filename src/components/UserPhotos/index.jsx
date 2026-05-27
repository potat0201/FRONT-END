import React, { useState, useEffect } from "react";
import { Typography, Divider, Button, Box } from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserPhotos({ advancedEnabled }) {
  const { userId, photoIndex } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState(null);

  const currentIndex = parseInt(photoIndex || "0", 10);

  useEffect(() => {
    fetchModel("/photo/photosOfUser/" + userId)
      .then((data) => setPhotos(data))
      .catch((err) => console.error(err));
  }, [userId]);

  if (!photos) return <Typography>Loading...</Typography>;
  if (photos.length === 0) return <Typography>User has no photos.</Typography>;

  const handleStep = (newIndex) => {
    navigate(`/photos/${userId}/${newIndex}`);
  };

  if (advancedEnabled) {
    const photo = photos[currentIndex] || photos[0];
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button 
            variant="contained" 
            disabled={currentIndex === 0} 
            onClick={() => handleStep(currentIndex - 1)}
          >
            Back
          </Button>
          
          <Typography variant="h6">
            Photo {currentIndex + 1} of {photos.length}
          </Typography>

          <Button 
            variant="contained" 
            disabled={currentIndex === photos.length - 1} 
            onClick={() => handleStep(currentIndex + 1)}
          >
            Next
          </Button>
        </Box>

        <img 
          src={"/images/" + photo.file_name} 
          alt="User" 
          style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: "8px" }} 
        />
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Posted on: {new Date(photo.date_time).toLocaleString()}
        </Typography>

        <Typography variant="h6" align="left" sx={{ mt: 3 }}>Comments:</Typography>
        {photo.comments ? photo.comments.map((c) => (
          <Box key={c._id} textAlign="left" bgcolor="#f9f9f9" p={1} mt={1}>
            <Link to={`/users/${c.user._id}`}>
              <strong>{c.user.first_name} {c.user.last_name}</strong>
            </Link>
            <Typography variant="caption" display="block">{new Date(c.date_time).toLocaleString()}</Typography>
            <Typography variant="body1">{c.comment}</Typography>
          </Box>
        )) : <Typography align="left">No comments.</Typography>}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {photos.map((photo) => (
        <div key={photo._id} style={{ marginBottom: "40px" }}>
          <img src={"/images/" + photo.file_name} alt="User" style={{ width: "400px" }} />
          <Typography variant="body2">Posted: {new Date(photo.date_time).toLocaleString()}</Typography>
          <Divider sx={{ my: 2 }} />
        </div>
      ))}
    </div>
  );
}

export default UserPhotos;