import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './component/errorboundaries/ErrorBoundary';
import Home from './pages/home/Home';
import Params from './pages/Params/Params';
import Body from './pages/body/Body';
import FormData from './pages/body/sub-body/FormData';
import None from './pages/body/sub-body/None';
import FormUrlencoded from './pages/body/sub-body/FormUrlencoded';
import Raw from './pages/body/sub-body/Raw';

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="params" element={<Params />} />
            <Route path="body" element={<Body />}>
              <Route path="formdata" element={<FormData />} />
              <Route path="none" element={<None />} />
              <Route path="formurlencoded" element={<FormUrlencoded />} />
              <Route path="raw" element={<Raw />} />
            </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;