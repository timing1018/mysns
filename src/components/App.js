import AppRouter from "components/Router";
import React, { useState } from "react";
import { authService } from 'fBase'

function App() {
  console.log(authService.currentUser);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);

  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} MySns</footer>
    </>
  );
}

export default App;
