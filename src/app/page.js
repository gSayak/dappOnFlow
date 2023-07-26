"use client"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import { useEffect} from "react";
import { useState} from "react";

fcl.config({
  "accessNode.api": "http://localhost:8080",
  "discovery.wallet": "http://localhost:8701/fcl/authn" //for using the dev wallet
})

const Home =() => {
  const [user, setUser] = useState({addr: ''});
  useEffect(() => {
    const subscription = fcl.currentUser.subscribe(setUser);
    return () => subscription.unsubscribe();
  }, []);

  const login = () => {
    fcl.authenticate();
  }

  const logout = () => {
    fcl.unauthenticate();
  }
  return (
    <div>
      {user.addr ? user.addr : ""}
      <button onClick={login}>Log In</button>
      <button onClick={logout}>Log Out</button>
    </div>
  )}

export default Home;