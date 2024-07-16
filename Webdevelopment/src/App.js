import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PasswordResetPage from "./pages/PasswordResetPage";
import DeleteAccountPage from "./pages/DeleteAccountPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import AdminDashboard from "./pages/AdminDasboard";
import EditUserPage from "./pages/EditUser";
import UserDetailsPage from "./pages/UserDetails";
import HomePage from "./pages/HomePage";
import HowToUsePage from "./pages/HowToUse";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
            <Routes>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/dashboard" element={<DashboardPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/reset-password" element={<PasswordResetPage/>}/>
                <Route path="/delete" element={<DeleteAccountPage/>}/>
                <Route path="/update-profile" element={<UpdateProfilePage/>}/>
                <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
                <Route path="/edit-user/:userId" element={<EditUserPage />} />
                <Route path="/user-details/:userId" element={<UserDetailsPage />} />
                <Route path="/how-to-use" element={<HowToUsePage/>}/>
                <Route path="/" element={<HomePage/>}/>
            </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
