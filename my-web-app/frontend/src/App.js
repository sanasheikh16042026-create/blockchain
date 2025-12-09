import React, { useState } from "react";
import axios from "axios";

// 💡 Use your backend URL ONLY here.
// Change only this line if your Codespace link changes.
const BACKEND = "https://automatic-zebra-p77pgjq5x7wh6r-5000.app.github.dev";

export default function App() {
  const [car, setCar] = useState(null);
  const [queryId, setQueryId] = useState("");  // <-- fix for query input

  const [form, setForm] = useState({
    id: "",
    make: "",
    model: "",
    color: "",
    owner: "",
  });

  // -------------------------------
  // Create Car
  // -------------------------------
  const createCar = async () => {
    try {
      await axios.post(`${BACKEND}/api/createCar`, form);
      alert("Car Created!");
    } catch (err) {
      console.error(err);
      alert("Error creating car");
    }
  };

  // -------------------------------
  // Query Car
  // -------------------------------
  const queryCar = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/queryCar/${queryId}`);
      setCar(res.data);
    } catch (err) {
      console.error(err);
      alert("Error querying car");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🚗 Hyperledger Fabric React App</h1>

      {/* CREATE CAR */}
      <h2>Create Car</h2>

      <input
        placeholder="ID"
        onChange={(e) => setForm({ ...form, id: e.target.value })}
      />
      <input
        placeholder="Make"
        onChange={(e) => setForm({ ...form, make: e.target.value })}
      />
      <input
        placeholder="Model"
        onChange={(e) => setForm({ ...form, model: e.target.value })}
      />
      <input
        placeholder="Color"
        onChange={(e) => setForm({ ...form, color: e.target.value })}
      />
      <input
        placeholder="Owner"
        onChange={(e) => setForm({ ...form, owner: e.target.value })}
      />

      <button onClick={createCar}>Submit</button>

      <hr />

      {/* QUERY CAR */}
      <h2>Query Car</h2>

      <input
        placeholder="Enter Car ID"
        value={queryId}
        onChange={(e) => setQueryId(e.target.value)}
      />
      <button onClick={queryCar}>Query</button>

      <pre>{car ? JSON.stringify(car, null, 2) : "No data yet"}</pre>
    </div>
  );
}
