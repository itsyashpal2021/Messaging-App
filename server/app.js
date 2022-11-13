const express = require("express");
const app = express();

const port = 3001;

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
