import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [car, setCar] = useState({});
  const [form, setForm] = useState({
    id: "",
    make: "",
    model: "",
    color: "",
    owner: "",
  });

  const createCar = async () => {
    await axios.post("https://automatic-zebra-p77pgjq5x7wh6r-5000.app.github.dev/createCar", form);
    alert("Car Created!");
  };

  const queryCar = async () => {
    const res = await axios.get("https://automatic-zebra-p77pgjq5x7wh6r-5000.app.github.dev/queryCar/" + car);
    setCar(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Hyperledger Fabric React App</h1>

      <h3>Create Car</h3>
      <input placeholder="ID" onChange={(e) => setForm({ ...form, id: e.target.value })} />
      <input placeholder="Make" onChange={(e) => setForm({ ...form, make: e.target.value })} />
      <input placeholder="Model" onChange={(e) => setForm({ ...form, model: e.target.value })} />
      <input placeholder="Color" onChange={(e) => setForm({ ...form, color: e.target.value })} />
      <input placeholder="Owner" onChange={(e) => setForm({ ...form, owner: e.target.value })} />

      <button onClick={createCar}>Submit</button>

      <h3>Query Car</h3>
      <button onClick={queryCar}>Query Car</button>

      <pre>{JSON.stringify(car, null, 2)}</pre>
    </div>
  );
}
