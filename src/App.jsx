import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"
import { AuthProvider } from "./context/AuthContext"
import { DarkModeProvider } from "./context/DarkModeContext"
import LoginPage from "./pages/LoginPage"
import ChatPage from "./pages/ChatPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import RegisterPage from "./pages/RegisterPage"
import EditProfileModal from "./components/EditProfileModal"
import AuthCallback from "./pages/AuthCallback"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import HomepageLayout from "./components/layout/HomepageLayout"

function App() {
  const [openProfileModal, setOpenProfileModal] = useState(false)

  return (
    <DarkModeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ✅ Google callback (สำคัญมาก) */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* ✅ หน้าแรกต้องกันไว้ */}
            {/* <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ChatPage setOpenProfileModal={setOpenProfileModal} />
                </ProtectedRoute>
              }
            /> */}
            <Route element={<HomepageLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* ✅ login */}
            <Route path="/login" element={<LoginPage />} />

            {/* ✅ chat */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage setOpenProfileModal={setOpenProfileModal} />
                </ProtectedRoute>
              }
            />

            {/* ✅ register */}
            <Route path="/register" element={<RegisterPage />} />

            {/* ✅ fallback route */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <ChatPage setOpenProfileModal={setOpenProfileModal} />
                </ProtectedRoute>
              }
            />

          </Routes>
          {/* modal */}
          <EditProfileModal
            open={openProfileModal}
            onClose={() => setOpenProfileModal(false)}
          />

        </BrowserRouter>
      </AuthProvider>
    </DarkModeProvider>
  )
}

export default App