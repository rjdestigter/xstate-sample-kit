import * as React from "react";

import { User, getUsername } from "../../models/users";

import { format } from "../../utils";

import text from "./text.json";

export interface PropsWelcomeMessage {
  user: User;
}

const WelcomeMessage = (props: PropsWelcomeMessage) => (
    <div id="welcome">
      {format(text["Welcome %username"], getUsername(props.user))}
    </div>
);

export default WelcomeMessage