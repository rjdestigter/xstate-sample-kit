import "./App.scss";

import React, { Suspense } from "react";

import LoginApp from "./apps/login";

const App: React.FC = () => {
  return (
    <Suspense fallback="...">
      <React.StrictMode>
        <LoginApp />
      </React.StrictMode>
    </Suspense>
  );
};

export default App;
