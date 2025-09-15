import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Provider} from 'react-redux'
import { useSelector } from "react-redux";
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';

import Login from './components/auth/SignIn.jsx'
import SignUp from './components/auth/SignUp.jsx'
import Dashboard from "./components/dashboard/Dashboard.jsx";
import store from './store/index.js';

import { useAuthInit } from "./custom_hooks/AuthHook.js";

import './App.css'


function PrivateRoute({ children }){
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  return isAuth ? children : <Login />
}

function App() {

  useAuthInit();

  return (
    <>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="bottom-right" />
    </>
  );
}


function AppWrapper(){

  const host = new URLSearchParams(window.location.search).get('host');
  const shop = new URLSearchParams(window.location.search).get('shop');

  const config = {
    apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
    host: host,
    shopOrigin: shop,
    forceRedirect: true,
  }

  return (
    <Provider store = {store}>
      <AppBridgeProvider config={config}>
        <App />
      </AppBridgeProvider>
    </Provider>
  );
}

export default AppWrapper;