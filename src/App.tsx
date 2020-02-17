import "./App.scss";
// import "@material/theme/dist/mdc.theme.css";

import React from "react";

import LoginApp from "./apps/login";

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <LoginApp />
    </React.StrictMode>
  );
};

export default App;
