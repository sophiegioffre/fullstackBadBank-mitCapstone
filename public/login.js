function Login(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [email, setEmail] = React.useState('');
  const currentUser = React.useContext(UserContext);

  //Find current authentication status
  firebase.auth().onAuthStateChanged((userCredential) => {
    if (userCredential) {
      setShow(false);

      console.log("Initializing...");
      console.log("Login Page Current User: ");
      console.log(userCredential);
      currentUser.user = userCredential;
      console.log(`Current Email: ${currentUser.user.email}`);
      console.log(`Current UID: ${currentUser.user.uid}`);
      console.log("End Initializing...");
      setEmail(currentUser.user.email);
    } else {
      setShow(true);
      console.log('no user logged in');
      currentUser.user = {};
    }
  })

  return (
    <Card
      bgcolor="secondary"
      header="Login"
      status={status}
      body={show ? 
        <LoginForm setShow={setShow} setStatus={setStatus}/> :
        <LoginMsg setShow={setShow} setStatus={setStatus}/>}
    />
  ) 
}

function LoginMsg(props){
  const currentUser = React.useContext(UserContext);

  //logout function
  function logout () {
    //logout from Firebase
    firebase.auth().signOut()
      .then(() => {
        console.log('Sign out successful');
        props.setShow(true);
        props.setStatus('Signed out successfully!');
        setTimeout(() => props.setStatus(''), 4000);
      })
      .catch((error) => {
        props.setStatus('Unsuccessful Signout: likely server error');
        setTimeout(() => props.setStatus(''), 4000);
      })
  }

  return(<>
    <h5>Success! You are currently logged in as {currentUser.user.email}.</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={logout}>
        Logout
    </button>
  </>);
}

function LoginForm(props){
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);
  const currentUser = React.useContext(UserContext);

  //Check disabled status
  if (!password || !email) {
    if (disabled) {
      console.log(disabled);
      console.log(`Button disabled: ${disabled}`);
    } else {
      setDisabled(true);
      console.log(`Button disabled: ${disabled}`);
    }
  } else {
    if (disabled) {
      setDisabled(false);
      console.log(`Button disabled ${disabled}`);
    } else {
      console.log(`Button disabled: ${disabled}`);
    }
  }

  function login(){
    //Login with Firebase
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('Sign in successful');
        console.log(`User Credentials: ${JSON.stringify(userCredential)}`);
        currentUser.user = userCredential;

        fetch(`/account/login/${email}/${password}`)
        .then(response => response.text())
        .then(text => {
            try {
                const data = JSON.parse(text);
                props.setStatus('');
                props.setShow(false);
                console.log('JSON:', data);
            } catch(err) {
                props.setStatus(text)
                console.log('err:', text);
            }
        });

        props.setStatus('Signed in successfully!');
        setTimeout(() =>{
          props.setStatus('');
          setEmail('');
          setPassword('');
        }, 4000);
      })
      .catch((error) => {
        var errorMessage = `Error Message: ${error.message}`;
        console.log(errorMessage);
        props.setStatus(errorMessage);
        setTimeout(() => props.setStatus(''), 4000);
        setEmail('');
        setPassword('');
      })

    // fetch(`/account/login/${email}/${password}`)
    // .then(response => response.text())
    // .then(text => {
    //     try {
    //         const data = JSON.parse(text);
    //         props.setStatus('');
    //         props.setShow(false);
    //         console.log('JSON:', data);
    //     } catch(err) {
    //         props.setStatus(text)
    //         console.log('err:', text);
    //     }
    // });
  }

  //Google login
  function loginGoogle() {
    //Login to Firebase with Google
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((userCredential) => {
        const url = `/account/find/${userCredential.user.email}`;
        (async () => {
          var res = await(url);
          var userData = await res.json();
          var responseString = JSON.stringify(userData);
          console.log(`Database Response String: ${responseString}`);
          console.log(`Database Response: ${userData}`);

          //If user does not exist
          if (responseString == '[]') {
            console.log(`User does not exist, creating account`);
            var createAccountMessage = `Account successfully created for: ${userCredential.user.email}`;

            //Set up new account in database
            const url = `/account/create/${userCredential.user.email}/${userCredential.user.email}/GoogleAuth/${userCredential.user.uid}`;

            (async () => {
              var res = await fetch(url);
              var data = await res.json();
              console.log(data);
            })();

            props.setStatus(createAccountMessage);
            setTimeout(() => props.setStatus(''), 4000);
          } else {
            console.log(`User exists`);
            console.log(`Database Response: ${responseString}`);

          }
        })();
        console.log('Sign In Successful');
        console.log(`User Credentials: ${JSON.stringify(userCredential)}`);
        currentUser.user = userCredential;
        props.setStatus('Signed in successfully!');
        setTimeout(() => props.setStatus(''), 4000);
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        console.log('Sign in NOT successful');
        setEmail('');
        setPassword('');
        props.setStatus(`Error Message: ${error.message}`);
        setTimeout(() => props.setStatus(''), 4000);
      });
  }


  return (<>

    Email<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} 
      onChange={e => setEmail(e.currentTarget.value)}/><br/>

    Password<br/>
    <input type="password" 
      className="form-control" 
      placeholder="Enter password" 
      value={password} 
      onChange={e => setPassword(e.currentTarget.value)}/><br/>

    {disabled ? (
      <button type="submit" disabled="disabled" className="btn btn-light" onClick={login}>Login</button>
    ) : (
      <button type="submit" className="btn btn-light" onClick={login}>Login</button>
    )}

    &nbsp; or &nbsp;
    <button type="submit" className="btn btn-light" onClick={loginGoogle}>
      &nbsp; Login with Google
    </button>

    <br/><br/> &#9432; Don't have an account?&nbsp; 
    <a href='#/CreateAccount/'>Create Account</a>
   
  </>);
}