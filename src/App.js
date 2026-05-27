import React, { useState } from "react";
import { Grid } from "@mui/material";
import { HashRouter, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";

function App() {
  // Trạng thái bật/tắt tính năng nâng cao
  const [advancedEnabled, setAdvancedEnabled] = useState(false);

  return (
    <HashRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Truyền state xuống TopBar */}
            <TopBar 
              advancedEnabled={advancedEnabled} 
              setAdvancedEnabled={setAdvancedEnabled} 
            />
          </Grid>
          <Grid item sm={3}>
            <UserList />
          </Grid>
          <Grid item sm={9} style={{ marginTop: '80px' }}>
            <Routes>
              <Route path="/users/:userId" element={<UserDetail />} />
              <Route 
                path="/photos/:userId/:photoIndex" 
                element={<UserPhotos advancedEnabled={advancedEnabled} />} 
              />
              <Route 
                path="/photos/:userId" 
                element={<UserPhotos advancedEnabled={advancedEnabled} />} 
              />
            </Routes>
          </Grid>
        </Grid>
      </div>
    </HashRouter>
  );
}

export default App;