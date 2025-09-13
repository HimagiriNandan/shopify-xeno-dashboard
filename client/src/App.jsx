import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Provider} from 'react-redux'
import store from './store/index.js'

import Login from './components/auth/SignIn.jsx'
import SignUp from './components/auth/SignUp.jsx'

import { useAuthInit } from "./custom_hooks/AuthHook.js";

import './App.css'

function App() {

  useAuthInit();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="bottom-right" />
    </>
  );
}


function AppWrapper(){
  return (
    <Provider store = {store}>
      <App />
    </Provider>
  );
}

export default AppWrapper;