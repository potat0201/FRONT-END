import { useEffect, useMemo } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import "./styles.css";
import formatDate from "../../lib/formatDate";
import { buildImageUrl } from "../../lib/imageUrl";
import buildUserActivity from "../../lib/userActivity";
import useAllUserPhotos from "../../hooks/useAllUserPhotos";
import useModelData from "../../hooks/useModelData";

function UserComments({ advancedEnabled, onContextChange, refreshKey }) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const {
    data: userInfo,
    isLoading: isUserLoading,
    error: userError,
  } = useModelData(`/user/${userId}`, refreshKey);
  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = useModelData("/user/list", refreshKey);
  const users = useMemo(() => usersData || [], [usersData]);
  const {
    photosByUserId,
    isLoading: isPhotosLoading,
    error: photosError,
  } = useAllUserPhotos(users, true, refreshKey);

  useEffect(() => {
    onContextChange("Comments");
  }, [onContextChange, userId]);

  useEffect(() => {
    if (userInfo) {
      onContextChange(
        `Comments by ${userInfo.first_name} ${userInfo.last_name}`
      );
    }
  }, [onContextChange, userInfo]);

  const authoredComments = useMemo(() => {
    const activityByUserId = buildUserActivity(users, photosByUserId);
    const comments = activityByUserId[userId]?.comments || [];

    return [...comments].sort(
      (left, right) => new Date(right.date_time) - new Date(left.date_time)
    );
  }, [photosByUserId, userId, users]);
  const isWaitingForPhotos =
    users.length > 0 &&
    !photosError &&
    (isPhotosLoading || Object.keys(photosByUserId).length === 0);

  const openPhoto = (comment) => {
    const ownerId = comment.photo.owner_id || comment.photo.user_id;

    if (advancedEnabled) {
      navigate(`/photos/${ownerId}/${comment.photo.index}`);
      return;
    }

    navigate(`/photos/${ownerId}`);
  };

  if (isUserLoading || isUsersLoading || isWaitingForPhotos) {
    return <CircularProgress size={28} />;
  }

  const error = userError || usersError || photosError;
  if (error) {
    return <Alert severity="error">Cannot load comments: {error.message}</Alert>;
  }

  if (!userInfo) {
    return <Alert severity="warning">User not found.</Alert>;
  }

  return (
    <Box className="user-comments">
      <Typography variant="h4" gutterBottom>
        Comments by {userInfo.first_name} {userInfo.last_name}
      </Typography>

      {authoredComments.length === 0 ? (
        <Alert severity="info">This user has not written any comments.</Alert>
      ) : (
        <Box className="comment-results">
          {authoredComments.map((comment) => (
            <button
              className="comment-result"
              key={comment._id}
              onClick={() => openPhoto(comment)}
              type="button"
            >
              <img
                alt={comment.photo.file_name}
                className="comment-thumbnail"
                src={buildImageUrl(comment.photo.file_name)}
              />
              <span className="comment-result-body">
                <Typography variant="caption" color="text.secondary">
                  {formatDate(comment.date_time)}
                </Typography>
                <Typography variant="body1">{comment.comment}</Typography>
              </span>
            </button>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default UserComments;
