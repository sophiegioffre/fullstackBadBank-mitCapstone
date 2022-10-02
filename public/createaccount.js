function CreateAccount(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [email, setEmail] = React.useState('');
  const currentUser = React.useContext(UserContext);

  // Get Current Authentication Status
  firebase.auth().onAuthStateChanged((userCredential) => {
    if (userCredential) {
        setShow(false);
        // If the user is logged in...
        console.log("Initializing...")
        console.log("Create Account Page Current User: ")
        console.log(userCredential);
        currentUser.user = userCredential;
        console.log(`Current Email: ${currentUser.user.email}`)
        console.log(`Current UID: ${currentUser.user.uid}`)
        console.log("End Initializing...")
        setEmail(currentUser.user.email)
    } else {
        setShow(true)
        // If the user is logged out...
        console.log("No User Logged In")
        currentUser.user = {};
    }
})

  return (
    <Card
      bgcolor="primary"
      header="Create Account"
      status={status}
      body={show ? 
        <CreateForm setShow={setShow} setStatus={setStatus}/> : 
        <CreateMsg setShow={setShow} setStatus={setStatus}/>}
    />
  )
}

function CreateMsg(props){
  const currentUser = React.useContext(UserContext);

  function logout() {
    //Logout from Firebase
    firebase.auth().signOut()
      .then(() => {
        var signoutMessage = "Logout Successful!";
        console.log(signoutMessage);
        props.setStatus(signoutMessage);
        setTimeout(() => props.setStatus(''), 4000);
        props.setShow(true);
      })
      .catch((error) => {
        props.setStatus('Unsuccessful Signout: likely a server error');
        setTimeout(() => props.setStatus(''), 4000);
      })
  }

  return(<>
    <h5>Success! You are logged in as {currentUser.user.email}!</h5>
    <a href='#/deposit/'>Make a Deposit</a><br/>
    <a href='#/withdraw/'>Make a Withdrawal</a><br/><br/>
    <button type="submit" 
      className="btn btn-light" 
      onClick={logout}>Logout
    </button>
  </>);
}

function CreateForm(props){
  const [name, setName]         = React.useState('');
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);
  const currentUser = React.useContext(UserContext);

  //Determine disabled status
  if (!name || !password || !email) {
    if (disabled) {
      console.log(`Button Disabled ${disabled}`);
    } else {
      setDisabled(true);
      console.log(`Button Disabled: ${disabled}`);
    }
  } else {
    if (disabled) {
      setDisabled(false);
      console.log(`Button Disabled: ${disabled}`);
    } else {
      console.log(`Button Disabled: ${disabled}`);
    }
  }

  function handle(){
    //Create new user
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var createAccountMessage = `Account Created For: ${email}`;
        console.log(createAccountMessage);

        const url = `/account/create/${name}/${email}/${password}/`;
        (async () => {
          var res  = await fetch(url);
          var data = await res.json();    
          console.log(data);        
        })();
        props.setStatus(createAccountMessage);
        setTimeout(() => props.setStatus(''), 4000);
      })
      .catch((error) => {
        var errorMessage = `Error Message: ${error.message}`;
        console.log(errorMessage);
        props.setStatus(errorMessage);
        setTimeout(() => props.setStatus(''), 4000);
        setEmail('');
        setPassword('');
      })

    // console.log(name,email,password);
    // const url = `/account/create/${name}/${email}/${password}`;
    // (async () => {
    //     var res  = await fetch(url);
    //     var data = await res.json();    
    //     console.log(data);        
    // })();
    // props.setShow(false);
  }

  //Google Login Function
  function loginGoogle () {
    //Login to firebase with GoogleAuth
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((userCredential) => {
        // Check if the user already has an account in the database by checking balance
        const url = `/account/getbalance/${userCredential.user.uid}`;
        (async () => {
          // Sending the data to server and then awaiting the response
          var res = await fetch(url);
          var userData = await res.json();
          var responseString = JSON.stringify(userData);
          console.log(`Database Response String: ${responseString}`)
          console.log(`Database Response: ${userData}`)
          
          if (responseString == '[]') {
            // Case if user does not exist
            console.log(`User does not exist, creating account`);
            var createAccountMessage = `Account successfully created for: ${userCredential.user.email}`;
            
            // Setting the account up in the database
            const url = `/account/create/${userCredential.user.email}/${userCredential.user.email}/GoogleAuth/${userCredential.user.uid}`;
            (async () => {
              // Sending the data to server and then awaiting the response
              var res   =  await fetch(url);
              var data  =  await res.json();
              console.log(data);
            })();
            
            // Setting the status messages
            props.setStatus(createAccountMessage);
            setTimeout(() => props.setStatus(''), 4000); 
          } else {
            console.log(`User does exist`);
            console.log(`Database Response: ${responseString}`)
          }
        })();

        // Function if correctly signed in
        console.log("Sign in successful");
        console.log("User Credentials: " + JSON.stringify(userCredential));
        currentUser.user = userCredential;

        //Setting the status message
        props.setStatus("Signed in successfully!");
        setTimeout(() => props.setStatus(''), 4000);
        setEmail('');
        setPassword('');  
      })
      .catch(function (error) {
          // Function if incorrectly signed in
          console.log("Sign in NOT successful");
          // Clear the user inputs
          setEmail('');
          setPassword('');
          // Setting the status message
          props.setStatus(`Error Message: ${error.message}`);
          setTimeout(() => props.setStatus(''), 4000);  
      });
  }

  return (<>

    Name<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter name" 
      value={name} 
      onChange={e => setName(e.currentTarget.value)}
    /><br/>

    Email address<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} 
      onChange={e => setEmail(e.currentTarget.value)}
    /><br/>

    Password<br/>
    <input type="password" 
      className="form-control" 
      placeholder="Enter password" 
      value={password} 
      onChange={e => setPassword(e.currentTarget.value)}
    /><br/>
    
    {disabled ? (
      <button type="submit" disabled="disabled" className="btn btn-light" onClick={handle}>
        Create Account
      </button>
    ) : (
      <button type="submit" className="btn btn-light" onClick={handle}>
        Create Account
      </button>
    )}

    &nbsp; or &nbsp;
    <button type="submit" className="btn btn-light" onClick={loginGoogle}>
      &nbsp; Sign in with Google
    </button>

  </>);
}