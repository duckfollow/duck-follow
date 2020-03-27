import React from 'react';
import { HashRouter, Route, Link } from "react-router-dom";
import Main from './components/Main'
import Policy from './components/Policy'
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
function App() {
  return (
    <HashRouter basename="/">
      <ScrollToTop/>
      <div>
        <Route exact path="/" component={Main} />
        <Route path="/policy-privacy" component={Policy} />
      </div>
    </HashRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default App;
