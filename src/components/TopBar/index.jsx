import React from "react";
import { AppBar, Toolbar, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { useLocation } from "react-router-dom";

function TopBar({ advancedEnabled, setAdvancedEnabled }) {
  const location = useLocation();
  
  let contextText = "";
  if (location.pathname.includes("/users/")) {
     contextText = "User Details"; 
  } else if (location.pathname.includes("/photos/")) {
     contextText = "Photos of User";
  }

  return (
    <AppBar position="absolute">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Le Dang Khoa</Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={advancedEnabled}
              onChange={(e) => setAdvancedEnabled(e.target.checked)}
              color="default"
            />
          }
          label="Enable Advanced Features"
          style={{ color: "white" }}
        />

        <Typography variant="h6">{contextText}</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;