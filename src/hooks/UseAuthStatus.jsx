import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'

export  function UseAuthStatus() {
    const [loggedIn, setLoggedIn ] = useState(false);
    // This state variable is used to indicate whether the hook is still checking the user's authentication status. 
    // It is initially set to true, indicating that the checking process is ongoing.
    const [checkingStatus, setCheckingStatus] = useState(true);

// firebase to check if the user is authenticated or not

    useEffect(()=>{
        const auth = getAuth()
        //  function is called with the authentication instance and a callback function
        onAuthStateChanged(auth, (user)=>{
           if(user){
            setLoggedIn(true);
           }
           setCheckingStatus(false);
        });

    }, []);
  return {loggedIn, checkingStatus};
}