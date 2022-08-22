require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());

const { getWishes, createWish, archiveWish } = require("./notion");

var corsOptions = {
  origin: ["http://127.0.0.1:5173", "https://moniversary.netlify.app/"], // TODO ganti sm url deploy
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

app.get("/wishes", async (req, res) =>
  res.send({
    state: "SUCCESS",
    message: "get all wishes",
    data: await getWishes(),
  })
);
app.post("/wish", async (req, res) =>
  res.send({
    state: "SUCCESS",
    message: "new wish added",
    data: await createWish(req.body),
  })
);
app.post("/archive-wish", async (req, res) =>
  res.send({ message: "wish deleted", data: archiveWish(req.body) })
);

app.listen(process.env.PORT);
