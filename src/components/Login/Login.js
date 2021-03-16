import firebaseConfig from './firebase.config';
import firebase from "firebase/app";
import "firebase/auth";
import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';

firebase.initializeApp(firebaseConfig);




function Login() {

  const [newUser, setNewUser] = useState(false);

  const [user, setUser] = useState({
    isSignedIn: false,
    name:'',
    email:'',
    password:'',
    photo:''
  });


  const [loggedInUser, setLoggedInUser] = useContext(UserContext)
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };



  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signInUser ={
        isSignedIn : true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signInUser);
      console.log(displayName, email, photoURL)
    })
    .catch (err => {
      console.log(err)
      console.log(err.massage)
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const singOutUser = {
        isSignedIn: false,
        name: '',
        photo:'',
        email: '',
        error:'',
        success: false
      }
      setUser(singOutUser)
    })
    .catch(err => {

    })
  }

  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
       isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber
    }
    if (isFieldValid) {
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }

  }

  const handleSubmit = (e) =>{
// console.log(user.email, user.password)
    if(newUser && user.email && user.password){
          firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
        // Signed in 
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name)
        // ...
      })
      .catch((error) => {
        const newUserInfo = {...user}
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        // ..
      });
    }

        if (!newUser && user.email && user.password) {
          firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
        // Signed in
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        setLoggedInUser(newUserInfo);
        history.replace(from);
        console.log('sign in ' , res.user);
        // ...
       })
        .catch((error) => {
          const newUserInfo = {...user}
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
       });
    }
    
    e.preventDefault();

  }


  const updateUserName = name =>{
    const  user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: name,
      }).then(function() {
        console.log('userName update successfully');
      }).catch(function(error) {
        console.log(error)
      });
  }

  return (
    <div style={{textAlign: 'center'}}>     
    {
      user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> : 
       <button onClick={handleSignIn}>Sign In</button>
    }
        <br/>
    {
      <button>sign In facebook</button>
    }
    {
      user.isSignedIn && <div>
        <p> Welcome, {user.name}</p>
        <p>Your email: {user.email}</p>
        <img src={user.photo} alt="" />
      </div>
    }

      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User sign up</label>
    <form onSubmit={handleSubmit} >
      {
      newUser && <input onBlur={handleBlur} type="text" type="text" name="name" placeholder="Your name"/>
      }
      <br/>
      <input onBlur={handleBlur} name="email" type="text" placeholder="Your email address" required/>
      <br/>
      <input onBlur={handleBlur} type="password" name="password" placeholder="Your password" required/>
      <br/>
      <input type="submit" value={newUser ? 'Sign up' : 'Sign In'} />
    </form>
    <p style={{color: 'red'}}>{user.error}</p>
      {
        user.success && <p style={{color: 'green'}}>User { newUser ? 'created' : 'Logged In'} successfully</p>

      }
    </div>
  );
}

export default Login;
