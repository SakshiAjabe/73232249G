import React, { useState } from "react";
import axios from "axios";
import NumberWindow from "./components/NumberWindow";

const ID_MAP = {
  p: "Prime",
  f: "Fibonacci",
  e: "Even",
  r: "Random",
};

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNumbers = async (id) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.get(`/numbers/${id}`, { timeout: 500 });
      setResult(response.data);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Average Calculator</h1>
      <div className="button-group">
        {Object.entries(ID_MAP).map(([id, name]) => (
          <button key={id} onClick={() => fetchNumbers(id)}>
            {name}
          </button>
        ))}
      </div>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {result && <NumberWindow data={result} />}
    </div>
  );
}
