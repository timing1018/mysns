import React, { useState } from "react";
import { authService } from "fBase";
import { createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  
  const onChange = (e) => {
    const {target: {name, value}} = e;
    if(name === "email") {
      setEmail(value)
    } else if(name === "password") {
      setPassword(value)
    }
  };

  const onSubmit = async(e) => {
    e.preventDefault();

    try {
          let data;
          if(newAccount) {
            // create account
            data = await createUserWithEmailAndPassword(
              authService, 
              email, 
              password
            );
          } else {
            // log in
            data = await signInWithEmailAndPassword(
              authService, 
              email, 
              password
            );
          }
          console.log(data)
    } catch(error) {
      setError(error.message);
    }
    
  };

  const toggleAccount = () => setNewAccount((prev) =>!prev );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name={"email"}
          type={"email"}
          placeholder={"Email"}
          required 
          value={email}
          onChange={onChange}
        />
        <input 
          name={"password"}
          type={"password" }
          placeholder={"Password" }
          required 
          value={password}
          onChange={onChange}
        />
        <input type={"submit"} value={newAccount ? "Create Account" : "Log In"} />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </div>
  );
};

export default AuthForm;