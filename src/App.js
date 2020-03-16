import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
function App() {

  const [user,setUser]=useState({
    isSignedIn:false,
    name:'',
    email:'',
    photo:''
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(result =>{
      const {displayName,photoURL,email}=result.user;
      const signedInUser ={
        isSignedIn:true,
        name:displayName,
        email:email,
        photo:photoURL

      }
      setUser(signedInUser);
      console.log(displayName,photoURL,email);
    })
    .catch(error =>{
      console.log(error);
      console.log(error.message);
    })
  }

  const handleSignOut= () =>{
    firebase.auth().signOut()
    .then(result => {
      // Sign-out successful.
     const singedOutUser ={
       isSignedIn:false,
       name:'',
       email:'',
       photo:''
     }
     setUser(singedOutUser);

    })
    .catch(error => {
      // An error happened.
    });
  }
  return (
    <div className="App">
    {
      user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button>: <button onClick={handleSignIn}>Sign in</button>
     }
     {
       user.isSignedIn && <div> 
          <p>Welcome {user.name}</p>
          <p>Your Email is :{user.email}</p>
          <img src={user.photo} alt="shakil"/>
       </div>
     }
    </div>
  );
}

export default App;
