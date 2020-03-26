import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FirebaseDatabaseProvider } from "@react-firebase/database";
import * as firebase from "firebase/app";
import 'swiper/css/swiper.css'
// import 'swiper/swiper.scss'
// import 'swiper/swiper.less'
// import "firebase/auth";
// import {
//   FirebaseAuthProvider,
//   FirebaseAuthConsumer,
//   IfFirebaseAuthed,
//   IfFirebaseAuthedAnd
// } from "@react-firebase/auth";

import { firebaseConfig } from "./FirebaseConfig";
// import Swiper from 'swiper';

ReactDOM.render(
  <React.StrictMode>
    <FirebaseDatabaseProvider {...firebaseConfig} firebase={firebase}>
        <App />
    </FirebaseDatabaseProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// new Swiper('.swiper-container', {
//   pagination: '.swiper-pagination',
//   slidesPerView: 4,
//   paginationClickable: true,
//   grabCursor: true,
//   paginationClickable: true,
//   nextButton: '.next-slide',
//   prevButton: '.prev-slide',
// }); 
