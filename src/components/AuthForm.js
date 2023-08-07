import React, { useState } from "react";
import { authService } from "fBase";
import { createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
} from 'firebase/auth';

const inputStyles = {};

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
      <form onSubmit={onSubmit} className="container">
        <input
          name={"email"}
          type={"email"}
          placeholder={"Email"}
          required 
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input 
          name={"password"}
          type={"password" }
          placeholder={"Password" }
          required 
          value={password}
          onChange={onChange}
          className="authInput"
        />
        <input 
          type={"submit"}
          className="authInput authSubmit"
          value={newAccount ? "Create Account" : "Log In"} 
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </div>
  );
};

export default AuthForm;