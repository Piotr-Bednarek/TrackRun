import express from "express";

import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

app.post("/api/login", (req, res) => {
  const data = req.body;

  const email = data.email;
  const password = data.password;
});

// TODO signup

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
