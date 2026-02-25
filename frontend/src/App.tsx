import React from "react";
import { testWrite } from "./lib/testWrite";

function App() {
  return (
    <div>
      <h1>Firestoreテスト</h1>

      <button onClick={testWrite}>
        Firebase書き込みテスト
      </button>
    </div>
  );
}

export default App;