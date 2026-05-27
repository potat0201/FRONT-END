import { useMemo } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.css";
import buildUserActivity from "../../lib/userActivity";
import useAllUserPhotos from "../../hooks/useAllUserPhotos";
import useModelData from "../../hooks/useModelData";

function CountBubble({ className, count, label, onClick }) {
  return (
    <button
      aria-label={label}
      className={`count-bubble ${className}`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {count}
    </button>
  );
}

function UserList({ advancedEnabled, refreshKey }) {
  const navigate = useNavigate();
  const { data, isLoading, error } = useModelData("/user/list", refreshKey);
  const users = useMemo(() => data || [], [data]);
  const {
    photosByUserId,
    isLoading: isActivityLoading,
    error: activityError,
  } = useAllUserPhotos(users, advancedEnabled, refreshKey);

  const activityByUserId = useMemo(
    () => buildUserActivity(users, photosByUserId),
    [photosByUserId, users]
  );
  const isWaitingForActivity =
    users.length > 0 &&
    !activityError &&
    (isActivityLoading || Object.keys(photosByUserId).length === 0);

  if (isLoading) {
    return <CircularProgress size={28} />;
  }

  if (error) {
    return <Alert severity="error">Cannot load users: {error.message}</Alert>;
  }

  return (
    <div className="user-list">
      <Typography variant="h6" className="user-list-title">
        Users
      </Typography>
      <List component="nav" disablePadding>
        {users.map((user) => {
          const activity = activityByUserId[user._id] || {};
          const fullName = `${user.first_name} ${user.last_name}`;

          return (
            <ListItemButton
              className="user-list-row"
              divider
              key={user._id}
              onClick={() => navigate(`/users/${user._id}`)}
            >
              <ListItemText primary={fullName} />
              {advancedEnabled && (
                <Box className="user-counts">
                  <CountBubble
                    className="photo-count"
                    count={isWaitingForActivity ? "-" : activity.photoCount || 0}
                    label={`Photos by ${fullName}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/photos/${user._id}`);
                    }}
                  />
                  <CountBubble
                    className="comment-count"
                    count={
                      isWaitingForActivity ? "-" : activity.commentCount || 0
                    }
                    label={`Comments by ${fullName}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/comments/${user._id}`);
                    }}
                  />
                </Box>
              )}
            </ListItemButton>
          );
        })}
      </List>
      {advancedEnabled && activityError && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Cannot load activity counts: {activityError.message}
        </Alert>
      )}
      {users.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          No users found. Run the backend dbLoad script to add sample data.
        </Typography>
      )}
    </div>
  );
}

export default UserList;
