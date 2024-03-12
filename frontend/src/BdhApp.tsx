import React, { useState } from "react";
import { UserProps } from "./types";
import Onboarding from "./nav/Onboarding";
import Nav from "./nav/Nav";

function BdhApp() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [community, setCommunity] = useState<string>("");

  const userProps: UserProps = {
    loggedIn: loggedIn,
    setLoggedIn: setLoggedIn,
    username: username,
    setUsername: setUsername,
    community: community,
    setCommunity: setCommunity,
    setHasOnboarded: setHasOnboarded,
  };

  if (!hasOnboarded) {
    return <Onboarding {...userProps} />;
  } else {
    return <Nav {...userProps} />;
  }
}

export default BdhApp;
