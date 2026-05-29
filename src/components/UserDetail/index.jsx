import { useEffect } from "react";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";

import "./styles.css";
import useModelData from "../../hooks/useModelData";

function UserDetail({ onContextChange, refreshKey }) {
  const { userId } = useParams();
  const { data: userInfo, isLoading, error } = useModelData(
    `/user/${userId}`,
    refreshKey
  );

  useEffect(() => {
    onContextChange("User Details");
  }, [onContextChange, userId]);

  useEffect(() => {
    if (userInfo) {
      onContextChange(
        `User Details: ${userInfo.first_name} ${userInfo.last_name}`
      );
    }
  }, [onContextChange, userInfo]);

  if (isLoading) {
    return <CircularProgress size={28} />;
  }

  if (error) {
    return <Alert severity="error">Cannot load user: {error.message}</Alert>;
  }

  if (!userInfo) {
    return <Alert severity="warning">User not found.</Alert>;
  }

  return (
    <Box className="user-detail">
      <Typography variant="h4" gutterBottom>
        {userInfo.first_name} {userInfo.last_name}
      </Typography>

      <Typography variant="body1">
        <strong>Location:</strong> {userInfo.location}
      </Typography>
      <Typography variant="body1">
        <strong>Occupation:</strong> {userInfo.occupation}
      </Typography>
      <Typography variant="body1">
        <strong>Description:</strong> {userInfo.description}
      </Typography>

      <Button
        component={RouterLink}
        to={`/photos/${userId}`}
        variant="contained"
        sx={{ mt: 3 }}
      >
        View Photos
      </Button>
    </Box>
  );
}

export default UserDetail;
