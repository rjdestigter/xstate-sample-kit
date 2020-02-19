import * as React from "react";

import history from 'history/browser'

import { useMachine } from "@xstate/react";
import useServiceLogger from "../xstate/useServiceLogger";

import { useLocation } from './hooks'
import { machine, Event} from './machine'

import Link from './components/Link'
import Redirect from './components/Redirect'
import { Provider } from '../SendContext'
import * as O from "fp-ts/es6/Option";

// Comonents
const Users = () => {
  useLocation("/users");

  const [users, setUsers] = React.useState<{ id: number; username: string }[]>(
    []
  );

  let didCancel = false;

  React.useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(users => !didCancel && setUsers(users));
    return () => {
      didCancel = true;
    };
  }, []);

  const list = users.map(user => (
    <li key={user.id}>
      <Link to={`users`} params={{ userId: user.id }}>
        {user.username}
      </Link>
    </li>
  ));

  return <ul>{list}</ul>;
}

const UserDetail = (props: { id: number }) => {
  useLocation("/users/" + props.id);
  const [user, setUser] = React.useState<any>(undefined);

  let didCancel = false;

  React.useEffect(() => {
    try {
      fetch("https://jsonplaceholder.typicode.com/users/" + props.id)
        .then(response => response.json())
        .then(user => {
          if (!didCancel) {
            if (user.id) {
              setUser(user);
            } else {
              setUser(null);
            }
          }
        });
    } catch (error) {
      setUser(null);
    }

    return () => {
      didCancel = true;
    };
  });

  if (user === null) {
    return <Redirect to={"notFound"} />;
  }

  if (!user) {
    return "Loading...";
  }

  return (
    <div>
      <h1>{user.username}</h1>
      <label>
        <strong>Id</strong>
      </label>
      <br />
      {user.id}
      <hr />
      <label>
        <strong>Email</strong>
      </label>
      <br />
      {user.email}
    </div>
  );
}



const Home = () => {
  useLocation("/");

  return (
    <>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Link to={"users"}>Show users</Link>
    </>
  );
}

const NotFound = () => {
  useLocation("404");
  return <div>404</div>;
}

const Route = ({ state }: any) => {
  if (state.matches("home")) {
    return <Home />;
    // @ts-ignore
  } else if (state.matches("users.user")) {
    // @ts-ignore
    if (state.context.userId) {
      // @ts-ignore
      return <UserDetail id={state.context.userId} />;
    }
    return <Redirect to={"users"} />;
    // @ts-ignore
  } else if (state.matches("users")) {
    return <Users />;
    // @ts-ignore
  } else if (state.matches("notFound")) {
    return <NotFound />;
  }

  return <Redirect to={"notFound"} />;
}

const routes = [
  /users\/(?<userId>\d+)/,
  /users/,
]

const gotoEventFromUrl = (rawUrl: string): Event => {
  const url = rawUrl.replace(/^\/|\/$/, '')

  const { event } = routes.reduce(
    (acc, next) => {
      if (acc.match) {
        return acc;
      } else if (next instanceof RegExp) {
        if (next.test(url)) {
          const outcome = next.exec(url)

          if (outcome) {
            const groups = outcome.groups || {}
            
            const route = Object.keys(groups).reduce(
              (acc2, key) => {
                const value = groups[key]
                return acc2.replace(`/${value}`, '')
              },
              outcome.input
            ).replace(/\//g, '.').replace(/^\.|\.$/, '')

            return { match: true, event: { type: 'GOTO', route, ...groups }}
          }
        }
      }

      return acc;
    },
    ({ match: false, event: { type: 'GOTO', route: 'home' }})
  )

  return event as Event
}

export default () => {
  const [routerState, send, service] = useMachine(machine);
  const [ready, setReady] = React.useState(false)

  useServiceLogger(service, 'router')
  
  const context = O.some(send)

  React.useEffect(
    () => {
      const event = gotoEventFromUrl(history.location.pathname)
      send(event)
      setReady(true)
    },
    []
  )

  if(!ready) {
    return null
  }

  return (
    <Provider value={context}>
    <div style={{background: 'White', padding: 20, margin: 20}}>
      <Route state={routerState} />
      <hr />
      <Link to={"home"}>Home</Link>
      <hr />  
      <Link to={"free-money"}>Free Money</Link>
      <hr />
      <Link to={"users"} params={{ userId: Infinity }}>
        User with <i>Infinite</i> id
      </Link>
    </div>
    </Provider>
  );
}
