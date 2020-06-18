import React from 'react';
import { HashRouter, Route, Link } from "react-router-dom";
import Main from './components/Main'
import Policy from './components/Policy'
import Game from './components/Game'
import lamp from './components/lamp'
import shop from './components/Shop'
import shopcart from './components/ShopCart'
import shopinvoice from './components/ShopInvoice'
import ShopUserLogin from './components/ShopUserLogin'
import ShopUser from './components/ShopUser'
import ShopUserRegisterSuccess from './components/ShopUserRegisterSuccess'
import Dashboard from './components/Dashboard'
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
function App() {
  return (
    <HashRouter basename="/">
      <ScrollToTop/>
      <div>
        <Route exact path="/" component={Main} />
        <Route path="/policy-privacy" component={Policy} />
        <Route path="/ป้ายไฟ" component={lamp} />
        <Route path="/game/:handle" component={Game} />
        <Route path="/shop" component={shop} />
        <Route path="/shop-login" component={ShopUserLogin} />
        <Route path="/shop-regiter-success/:id" component={ShopUserRegisterSuccess} />
        <Route path="/shop-cart" component={shopcart} />
        <Route path="/invoice/:orderid" component={shopinvoice} />
        <Route path="/profile" component={ShopUser} />
        <Route path="/dashboard" component={Dashboard} />
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
