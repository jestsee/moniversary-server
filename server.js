require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
const { getWishes, createWish, archiveWish } = require("./notion");

app.get("/wishes", async (req, res) =>
  res.send({
    message: "get all wishes",
    data: await getWishes(),
  })
);
app.post("/wish", async (req, res) =>
  res.send({
    message: "new wish added",
    data: await createWish(req.body),
  })
);
app.post("/archive-wish", async (req, res) =>
  res.send({ message: "wish deleted", data: archiveWish(req.body) })
);

app.listen(process.env.PORT);
