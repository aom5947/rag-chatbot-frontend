import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"
import { AuthProvider } from "./context/AuthContext"
import { DarkModeProvider } from "./context/DarkModeContext"
import LoginPage from "./pages/LoginPage"
import ChatPage from "./pages/ChatPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import RegisterPage from "./pages/RegisterPage"
import EditProfileModal from "./components/EditProfileModal"

function App() {

  const [openProfileModal, setOpenProfileModal] = useState(false)

  return (
    <DarkModeProvider>
      <AuthProvider>
        <BrowserRouter>

          <Routes>
            
            <Route path="/" element={<ChatPage setOpenProfileModal={setOpenProfileModal} />} />

            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage setOpenProfileModal={setOpenProfileModal} />
                </ProtectedRoute>
              }
            />

            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<ChatPage setOpenProfileModal={setOpenProfileModal} />} />

          </Routes>

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