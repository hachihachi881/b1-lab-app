import { testWrite } from "./services/firestore";

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