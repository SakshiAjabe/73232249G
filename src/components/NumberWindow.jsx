import React from "react";

export default function NumberWindow({ data }) {
  return (
    <div className="result">
      <div>
        <strong>Window Previous State:</strong>{" "}
        <span>{JSON.stringify(data.windowPrevState)}</span>
      </div>
      <div>
        <strong>Window Current State:</strong>{" "}
        <span>{JSON.stringify(data.windowCurrState)}</span>
      </div>
      <div>
        <strong>Numbers:</strong> <span>{JSON.stringify(data.numbers)}</span>
      </div>
      <div>
        <strong>Average:</strong> <span>{data.avg.toFixed(2)}</span>
      </div>
      {data.error && (
        <div className="error">
          <strong>Error:</strong> <span>{data.error}</span>
        </div>
      )}
    </div>
  );
}
