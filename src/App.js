import { useEffect, useRef, useState } from "react";
import { Alert, Grid, Toolbar } from "@mui/material";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import LoginRegister from "./components/LoginRegister";
import TopBar from "./components/TopBar";
import UserComments from "./components/UserComments";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import {
  postFormData,
  postJson,
  UNAUTHORIZED_EVENT,
} from "./lib/fetchModelData";
import { clearSession, loadCurrentUser, saveSession } from "./lib/session";

function getUserDisplayName(user) {
  return [user?.first_name, user?.last_name].filter(Boolean).join(" ");
}

function AppShell() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(loadCurrentUser);
  const [advancedEnabled, setAdvancedEnabled] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [appMessage, setAppMessage] = useState(null);
  const [contextText, setContextText] = useState(
    currentUser ? getUserDisplayName(currentUser) : "Please Login"
  );
  const contentRef = useRef(null);

  const refreshData = () => setDataVersion((version) => version + 1);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
      setCurrentUser(null);
      setAdvancedEnabled(false);
      setContextText("Please Login");
      setAppMessage({
        severity: "warning",
        text: "Your session expired. Please log in again.",
      });
      navigate("/");
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [navigate]);

  const handleLogin = async (credentials) => {
    const user = await postJson("/admin/login", credentials);

    saveSession(user);
    setCurrentUser(user);
    setContextText(getUserDisplayName(user));
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
      setContextText("Please Login");
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
        contextText={contextText}
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
                  element={
                    <UserDetail
                      onContextChange={setContextText}
                      refreshKey={dataVersion}
                    />
                  }
                />
                <Route
                  path="/comments/:userId"
                  element={
                    <UserComments
                      advancedEnabled={advancedEnabled}
                      onContextChange={setContextText}
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
                      onContextChange={setContextText}
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
                      onContextChange={setContextText}
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
