import { useRef, useState } from "react";
import {
  AppBar,
  Button,
  Checkbox,
  FormControlLabel,
  Toolbar,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";

function getContextText(pathname) {
  if (pathname.includes("/users/")) {
    return "User Details";
  }

  if (pathname.includes("/comments/")) {
    return "Comments";
  }

  if (pathname.includes("/photos/")) {
    return "Photos";
  }

  return "Welcome";
}

function TopBar({
  advancedEnabled,
  currentUser,
  onLogout,
  onPhotoUpload,
  setAdvancedEnabled,
}) {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const contextText = getContextText(location.pathname);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      await onPhotoUpload(file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
        <Typography variant="h6" noWrap>
          Le Dang Khoa
        </Typography>

        {currentUser ? (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={advancedEnabled}
                  onChange={(event) => setAdvancedEnabled(event.target.checked)}
                  color="default"
                />
              }
              label="Enable Advanced Features"
              sx={{ color: "white", marginLeft: "auto" }}
            />
            <input
              accept="image/*"
              hidden
              onChange={handleFileChange}
              ref={fileInputRef}
              type="file"
            />
            <Button
              color="inherit"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? "Uploading..." : "Add Photo"}
            </Button>
            <Typography variant="body1" noWrap>
              Hi {currentUser.first_name}
            </Typography>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Typography variant="body1" sx={{ marginLeft: "auto" }} noWrap>
            Please Login
          </Typography>
        )}

        <Typography variant="h6" noWrap>
          {contextText}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
