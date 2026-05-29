import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import "./styles.css";
import formatDate from "../../lib/formatDate";
import { buildImageUrl } from "../../lib/imageUrl";
import useModelData from "../../hooks/useModelData";

function CommentList({ comments = [] }) {
  if (comments.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        No comments.
      </Typography>
    );
  }

  return (
    <Box className="comment-list">
      {comments.map((comment) => {
        const user = comment.user || {};
        const name =
          [user.first_name, user.last_name].filter(Boolean).join(" ") ||
          "Unknown user";

        return (
          <Box className="comment-item" key={comment._id}>
            {user._id ? (
              <RouterLink to={`/users/${user._id}`} className="comment-user">
                {name}
              </RouterLink>
            ) : (
              <strong>Unknown user</strong>
            )}
            <Typography variant="caption" color="text.secondary" display="block">
              {formatDate(comment.date_time)}
            </Typography>
            <Typography variant="body2">{comment.comment}</Typography>
          </Box>
        );
      })}
    </Box>
  );
}

function PhotoBlock({ children, photo }) {
  return (
    <Box className="photo-block">
      <img
        src={buildImageUrl(photo.file_name)}
        alt={photo.file_name}
        className="photo-image"
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Posted: {formatDate(photo.date_time)}
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Comments
      </Typography>
      <CommentList comments={photo.comments} />
      {children}
    </Box>
  );
}

function AddCommentForm({ onSubmit }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(comment.trim());
      setComment("");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="add-comment" component="form" onSubmit={handleSubmit}>
      <TextField
        label="Add a comment"
        minRows={2}
        multiline
        onChange={(event) => setComment(event.target.value)}
        value={comment}
        fullWidth
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Button disabled={isSubmitting} type="submit" variant="contained">
        Add Comment
      </Button>
    </Box>
  );
}

function PhotoWithComments({ currentUser, onAddComment, photo }) {
  return (
    <PhotoBlock photo={photo}>
      {currentUser && (
        <AddCommentForm
          onSubmit={(comment) => onAddComment(photo._id, comment)}
        />
      )}
    </PhotoBlock>
  );
}

function UserPhotos({
  advancedEnabled,
  currentUser,
  onAddComment,
  onContextChange,
  refreshKey,
  scrollContainerRef,
}) {
  const { userId, photoIndex } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useModelData(
    `/photosOfUser/${userId}`,
    refreshKey
  );
  const { data: userInfo } = useModelData(`/user/${userId}`, refreshKey);
  const photos = data || [];

  const requestedIndex = Number.parseInt(photoIndex || "0", 10);
  const currentIndex = Number.isNaN(requestedIndex) ? 0 : requestedIndex;
  const activeIndex = useMemo(() => {
    if (photos.length === 0) {
      return 0;
    }
    return Math.min(Math.max(currentIndex, 0), photos.length - 1);
  }, [currentIndex, photos.length]);

  useEffect(() => {
    onContextChange("Photos");
  }, [onContextChange, userId]);

  useEffect(() => {
    if (userInfo) {
      onContextChange(`Photos of ${userInfo.first_name} ${userInfo.last_name}`);
    }
  }, [onContextChange, userInfo]);

  useEffect(() => {
    if (
      advancedEnabled &&
      photos.length > 0 &&
      currentIndex !== activeIndex
    ) {
      navigate(`/photos/${userId}/${activeIndex}`, { replace: true });
    }
  }, [
    activeIndex,
    advancedEnabled,
    currentIndex,
    navigate,
    photos.length,
    userId,
  ]);

  useEffect(() => {
    scrollContainerRef?.current?.scrollTo({ top: 0, left: 0 });
    window.scrollTo({ top: 0, left: 0 });
  }, [activeIndex, advancedEnabled, scrollContainerRef, userId]);

  if (isLoading) {
    return <CircularProgress size={28} />;
  }

  if (error) {
    return <Alert severity="error">Cannot load photos: {error.message}</Alert>;
  }

  if (photos.length === 0) {
    return <Alert severity="info">This user has no photos.</Alert>;
  }

  if (advancedEnabled) {
    const photo = photos[activeIndex];

    return (
      <Box className="photos-view">
        <Box className="photo-stepper">
          <Button
            variant="contained"
            disabled={activeIndex === 0}
            onClick={() => navigate(`/photos/${userId}/${activeIndex - 1}`)}
          >
            Back
          </Button>

          <Typography variant="h6">
            Photo {activeIndex + 1} of {photos.length}
          </Typography>

          <Button
            variant="contained"
            disabled={activeIndex === photos.length - 1}
            onClick={() => navigate(`/photos/${userId}/${activeIndex + 1}`)}
          >
            Next
          </Button>
        </Box>

        <PhotoWithComments
          currentUser={currentUser}
          onAddComment={onAddComment}
          photo={photo}
        />
      </Box>
    );
  }

  return (
    <Box className="photos-view">
      {photos.map((photo) => (
        <Fragment key={photo._id}>
          <PhotoWithComments
            currentUser={currentUser}
            onAddComment={onAddComment}
            photo={photo}
          />
          <Divider sx={{ my: 3 }} />
        </Fragment>
      ))}
    </Box>
  );
}

export default UserPhotos;
