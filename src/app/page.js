"use client"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import { useEffect} from "react";
import { useState} from "react";

fcl.config({
  "app.detail.title": "Hey There, Welcome",
  "app.detail.icon": "",
  "accessNode.api": "http://localhost:8080",
  "discovery.wallet": "http://localhost:8701/fcl/authn", //for using the dev wallet
  "0xstuff": "0xf8d6e0586b0a20c7"
})

const Home =() => {
  const [name, setName] = useState();
  const [user, setUser] = useState({addr: ''});
  const[newName, setNewName] = useState();

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
  const getName =async () => {
    const response = await fcl.send([
      fcl.script`
      import stuff from 0xstuff

      pub fun main(): String{
        return stuff.name
      }
      `
    ]).then(fcl.decode);

    setName(response);

  }

  const changeName =async () => {
    const txId = await fcl.send ([
      fcl.transaction`
      import stuff from 0xstuff
      transaction(newName: String){
        prepare(signer: AuthAccount){
          log(signer.address)
        }
        execute{
          stuff.changeName(newName : newName)
        }
      }
      `,
      fcl.args([
        fcl.arg(newName, t.String)

      ]),
      fcl.proposer(fcl.authz),
      fcl.payer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(9999)

    ]).then(fcl.decode);
    console.log({txId});
  }

  if(user.addr){
    return(
      <div className="center">
        <div>
          <h1>{user.addr}</h1>
          <div class="btn-2">
          <button onClick={logout}><span>Log Out</span></button>
          </div>    
        </div>
        <div className="btn-1">
          <button onClick={getName}><span>Get Name</span></button>
        </div>
        <h3>{name}</h3>
        <div>
        <div className="btn-1">
          <button onClick={changeName}><span>Change Name</span></button>
        </div>
        <input type="text" onChange={(e) => setNewName(e.target.value)} />
        </div>
      </div>
      
      

    )
  } else {
    return(
      <div className="center">
        <div class="btn-1">
        <button onClick={login}><span>Log In</span></button>
        </div>

      </div>
      
    )
  }
}

export default Home;