import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"
import { AuthProvider } from "./context/AuthContext"
import LoginPage from "./pages/LoginPage"
import ChatPage from "./pages/ChatPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import RegisterPage from "./pages/RegisterPage"
import EditProfileModal from "./components/EditProfileModal"

function App() {

  const [openProfileModal, setOpenProfileModal] = useState(false)

  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage setOpenProfileModal={setOpenProfileModal}/>
              </ProtectedRoute>
            }
          />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<LoginPage />} />

        </Routes>

        {/* Modal อยู่ตรงนี้ */}
        <EditProfileModal
          open={openProfileModal}
          onClose={() => setOpenProfileModal(false)}
        />

      </BrowserRouter>
    </AuthProvider>
  )
}

export default App