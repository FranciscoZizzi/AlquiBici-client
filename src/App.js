import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/homePage";
import RegisterPage from "./pages/loginPage";
import LoginPage from "./pages/loginPage";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<HomePage/>}/>
          <Route path={'/login'} element={<LoginPage/>}/>
            <Route path={'/register'} element={<RegisterPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
