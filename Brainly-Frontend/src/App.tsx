import { Dashboard } from "./pages/Dashboard"
import { LandingPage } from "./pages/LandingPage"
import SharedBrainView from "./pages/SharedBrainView"
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"
import { BrowserRouter, Routes, Route } from "react-router-dom"



function App() {
  return <BrowserRouter>
      <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/share/:shareLink" element={<SharedBrainView/>} />
          {/* This route is for the shared brain view */}
          <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
  </BrowserRouter>
}

export default App
