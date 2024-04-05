import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./assets/css/general.css"
import "./assets/css/index.css"
import "./assets/css/pages-icons.css"
import "./assets/css/pages-sidebar.css"

import Homepage from './components/home';
import { Toaster } from 'react-hot-toast';

import { MyProvider } from './contexts';
import PageLayout from './components/layouts/PageLayout';





function App() {


  return (
    <MyProvider>
      <div>
        <BrowserRouter>

          <Routes>
            <Route path="/" Component={Homepage} />
            <Route path="*" Component={PageLayout} />

            {/* <Route
              path="/doctor/*"
              element={
                <ProtectedRoute component={UserPortal} />}
            /> */}
            <Route render={() => <h1>Error 404. Page not found.</h1>} />
          </Routes>


        </ BrowserRouter>
        <Toaster />
      </div>
    </MyProvider>
  );
}

export default App;
