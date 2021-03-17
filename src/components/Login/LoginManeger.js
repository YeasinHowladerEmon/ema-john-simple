import firebaseConfig from './firebase.config';
import firebase from "firebase/app";
import "firebase/auth";

export const initializeLoginFramework = () => {
    if(firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }
}


export const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider)
        .then(res => {
            const { displayName, photoURL, email } = res.user;
            const signInUser = {
                isSignedIn: true,
                name: displayName,
                email: email,
                photo: photoURL,
                success: true
            }
            return signInUser;
        })
        .catch(err => {
            console.log(err)
            console.log(err.massage)
        })
}

export const handleSignOut = () => {
    return firebase.auth().signOut()
        .then(res => {
            const singOutUser = {
                isSignedIn: false,
                name: '',
                photo: '',
                email: '',
                error: '',
                success: false
            }
            return singOutUser
        })
        .catch(err => {
        
        })
}

export const createUserWithEmailAndPassword = (name, email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res => {
            // Signed in 
            const newUserInfo = res.user;
            newUserInfo.error = '';
            newUserInfo.success = true;
            updateUserName(name)
            return newUserInfo;
            // ...
        })
        .catch((error) => {
            const newUserInfo = {}
            newUserInfo.error = error.message;
            newUserInfo.success = false;
            return newUserInfo;
            // ..
        });
}
export const signInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(res => {
    // Signed in
    const newUserInfo = res.user;
    newUserInfo.error = '';
    newUserInfo.success = true;
    return newUserInfo;
    // ...
   })
    .catch((error) => {
      const newUserInfo = {}
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    return newUserInfo;
   });
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
