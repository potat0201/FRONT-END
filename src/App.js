import { useRef, useState } from "react";
import { Alert, Grid, Toolbar } from "@mui/material";
import { HashRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import "./App.css";
import LoginRegister from "./components/LoginRegister";
import TopBar from "./components/TopBar";
import UserComments from "./components/UserComments";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import { postFormData, postJson } from "./lib/fetchModelData";
import {
  clearSession,
  loadCurrentUser,
  saveSession,
} from "./lib/session";

function getLoginSession(loginResponse) {
  const user = loginResponse.user || loginResponse;
  const token = loginResponse.token || loginResponse.jwt || loginResponse.accessToken;

  return { user, token };
}

function AppShell() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(loadCurrentUser);
  const [advancedEnabled, setAdvancedEnabled] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [appMessage, setAppMessage] = useState(null);
  const contentRef = useRef(null);

  const refreshData = () => setDataVersion((version) => version + 1);

  const handleLogin = async (credentials) => {
    const loginResponse = await postJson("/admin/login", credentials);
    const { user, token } = getLoginSession(loginResponse);

    saveSession(user, token);
    setCurrentUser(user);
    setAppMessage(null);
    refreshData();
    return user;
  };

  const handleRegister = (registration) => postJson("/user", registration);

  const handleLogout = async () => {
    try {
      await postJson("/admin/logout", {});
    } finally {
      clearSession();
      setCurrentUser(null);
      setAdvancedEnabled(false);
      setAppMessage(null);
      navigate("/");
    }
  };

  const handleAddComment = async (photoId, comment) => {
    await postJson(`/commentsOfPhoto/${photoId}`, { comment });
    refreshData();
  };

  const handlePhotoUpload = async (file) => {
    const formData = new FormData();
    formData.append("uploadedphoto", file);

    try {
      await postFormData("/photos/new", formData);
      refreshData();
      setAppMessage({ severity: "success", text: "Photo uploaded." });
      navigate(`/photos/${currentUser._id}`);
    } catch (uploadError) {
      setAppMessage({ severity: "error", text: uploadError.message });
    }
  };

  return (
    <div className="app-root">
      <TopBar
        advancedEnabled={advancedEnabled}
        currentUser={currentUser}
        onLogout={handleLogout}
        onPhotoUpload={handlePhotoUpload}
        setAdvancedEnabled={setAdvancedEnabled}
      />
      <Toolbar />
      <Grid container spacing={0}>
        {currentUser && (
          <Grid item xs={12} sm={3} className="main-grid-item main-sidebar">
            <UserList advancedEnabled={advancedEnabled} refreshKey={dataVersion} />
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sm={currentUser ? 9 : 12}
          className="main-grid-item main-content"
          ref={contentRef}
        >
          {appMessage && (
            <Alert
              severity={appMessage.severity}
              sx={{ mb: 2 }}
              onClose={() => setAppMessage(null)}
            >
              {appMessage.text}
            </Alert>
          )}
          <Routes>
            {!currentUser ? (
              <Route
                path="*"
                element={
                  <LoginRegister
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                  />
                }
              />
            ) : (
              <>
                <Route
                  path="/"
                  element={<Navigate to={`/users/${currentUser._id}`} replace />}
                />
                <Route
                  path="/users/:userId"
                  element={<UserDetail refreshKey={dataVersion} />}
                />
                <Route
                  path="/comments/:userId"
                  element={
                    <UserComments
                      advancedEnabled={advancedEnabled}
                      refreshKey={dataVersion}
                    />
                  }
                />
                <Route
                  path="/photos/:userId/:photoIndex"
                  element={
                    <UserPhotos
                      advancedEnabled={advancedEnabled}
                      currentUser={currentUser}
                      onAddComment={handleAddComment}
                      refreshKey={dataVersion}
                      scrollContainerRef={contentRef}
                    />
                  }
                />
                <Route
                  path="/photos/:userId"
                  element={
                    <UserPhotos
                      advancedEnabled={advancedEnabled}
                      currentUser={currentUser}
                      onAddComment={handleAddComment}
                      refreshKey={dataVersion}
                      scrollContainerRef={contentRef}
                    />
                  }
                />
                <Route
                  path="*"
                  element={<Navigate to={`/users/${currentUser._id}`} replace />}
                />
              </>
            )}
          </Routes>
        </Grid>
      </Grid>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}

export default App;
