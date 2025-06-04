const express = require("express");
const axios = require("axios");

const app = express();
const port = 9876;

const WINDOW_SIZE = 10;

const API_MAP = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};

const windows = {
  p: [],
  f: [],
  e: [],
  r: [],
};

function isUnique(arr, num) {
  return !arr.includes(num);
}

function average(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}

app.get("/numbers/:id", async (req, res) => {
  const id = req.params.id;

  if (!API_MAP[id]) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const prevWindow = [...windows[id]];

  try {
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
      source.cancel();
    }, 480);

    const response = await axios.get(API_MAP[id], {
      cancelToken: source.token,
      timeout: 500,
    });

    clearTimeout(timeout);

    if (!response.data || !Array.isArray(response.data.numbers)) {
      throw new Error("Invalid response from test server");
    }

    const fetchedNumbers = response.data.numbers;

    for (const num of fetchedNumbers) {
      if (isUnique(windows[id], num)) {
        if (windows[id].length >= WINDOW_SIZE) {
          windows[id].shift();
        }
        windows[id].push(num);
      }
    }

    const avg = average(windows[id]);

    return res.json({
      windowPrevState: prevWindow,
      windowCurrState: [...windows[id]],
      numbers: [...windows[id]],
      avg: parseFloat(avg.toFixed(2)),
    });
  } catch (err) {
    const avg = average(windows[id]);
    return res.json({
      windowPrevState: prevWindow,
      windowCurrState: [...windows[id]],
      numbers: [...windows[id]],
      avg: parseFloat(avg.toFixed(2)),
      error: err.message || "Error fetching numbers",
    });
  }
});

app.listen(port, () => {
  console.log(`Average Calculator backend running at http://localhost:${port}`);
});
