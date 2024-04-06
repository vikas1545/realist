import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {AuthProvider} from "./context/Auth";
import Main from "./components/nav/Main";
import {Toaster} from "react-hot-toast";
import AccountActivate from "./pages/auth/AccountActivate";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AccessAccount from "./pages/auth/AccessAccount";
import Dashboard from "./pages/user/Dashboard";
import AdCreate from "./pages/user/Ad/AdCreate";
import PrivateRoute from "./components/routes/PrivateRoute";
import SellLand from "./pages/user/Ad/SellLand";
import SellHouse from "./pages/user/Ad/SellHouse";
import RentLand from "./pages/user/Ad/RentLand";
import RentHouse from "./pages/user/Ad/RentHouse";
function App() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <Main/>
                <Toaster/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/auth/account-activate/:token" element={<AccountActivate/>}/>
                    <Route path="/auth/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/auth/access-account/:token" element={<AccessAccount/>}/>

                    <Route path="/" element={<PrivateRoute/>}>
                        <Route path="dashboard" element={<Dashboard/>}/>
                        <Route path="ad/create" element={<AdCreate/>}/>
                        <Route path="ad/create/sell/house" element={<SellHouse/>}/>
                        <Route path="ad/create/sell/land" element={<SellLand/>}/>
                        <Route path="ad/create/rent/house" element={<RentHouse/>}/>
                        <Route path="ad/create/rent/land" element={<RentLand/>}/>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>

    );
}

export default App;
