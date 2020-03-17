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
       photo:'',
       error:'',
       isValid:false,
       existingUser:false
     }
     setUser(singedOutUser);

    })
    .catch(error => {
      // An error happened.
    });
  };

  const isValidEmail= email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber =input => /\d/.test(input);

  const switchForm=event =>{
        const createdUser= {...user};
        createdUser.existingUser=event.target.checked;
        setUser(createdUser);
        console.log(event.target.checked);
  }

  const handleChange = e =>{
    const newUserInfo={
      ...user
    };
    //perform validation
    let isValid=true;
    if(e.target.name === 'email'){
      isValid=isValidEmail(e.target.value);
      console.log(isValid);
    }
    if(e.target.name === 'password'){
      isValid=e.target.value.length > 8 && hasNumber(e.target.value);
      console.log(isValid);

    }

    newUserInfo[e.target.name]=e.target.value;
    newUserInfo.isValid=isValid;
    setUser(newUserInfo);
   
  }


  const handleCreateAccount =(event) =>{
    if (user.isValid ){
      console.log(user.email,user.password);
      firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
      .then(res =>{
        console.log(res);
        const createdUser= {...user};
        createdUser.isSignedIn=true;
        createdUser.error='';
        setUser(createdUser);
      })
      .catch(err =>{
        console.log(err.message);
        const createdUser= {...user};
        createdUser.isSignedIn=false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    else {
      console.log("invalid form",{email :user.email,pass: user.password});
     
    }
    event.preventDefault();
    event.target.reset();
   
  };


  const signInUser= event =>{
    if (user.isValid ){
      console.log(user.email,user.password);
      firebase.auth().signInWithEmailAndPassword(user.email,user.password)
      .then(res =>{
        console.log(res);
        const createdUser= {...user};
        createdUser.isSignedIn=true;
        createdUser.error='';
        setUser(createdUser);
      })
      .catch(err =>{
        console.log(err.message);
        const createdUser= {...user};
        createdUser.isSignedIn=false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
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
        <h1>Our Own Authentication</h1>
        <input type="checkbox" name="switchForm"  onChange={switchForm} id="switchForm"/>
        <label htmlFor="switchForm">Returning User</label>


      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        
        <input type="text" onBlur={handleChange} name="email" placeholder="your Email" required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="enter password" required/>
        <br/>
        <input type="submit" value="SignIn"/>
      </form>

      <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={handleCreateAccount}>
        <input type="text"  onBlur={handleChange} name="name" placeholder="your Name" required/>
        <br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="your Email" required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="enter password" required/>
        <br/>
      <input type="submit" value="Create account"/>
      </form>
      {
        user.error && <p style={{color:'red'}}>{user.error}</p>
      }
       
    </div>
  );
}

export default App;
