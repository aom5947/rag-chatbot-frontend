import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import LoginPage from "./pages/LoginPage"
import ChatPage from "./pages/ChatPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<LoginPage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App