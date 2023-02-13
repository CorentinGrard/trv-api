import { response } from "express";
import express from "express";
import { trvFetch } from "./trvFetch.js";

let trvBase;
let trvVariable;

const downloadData = async () => {
  trvBase = await trvFetch(true);
  trvVariable = await trvFetch(false);
};

downloadData();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const today = new Date();
  const todayDay = today.getDate() < 10 ? `0${today.getDate()}`: today.getDate()
  const todayMonth = today.getMonth() + 1 < 10 ? `0${today.getMonth() +1}`: today.getMonth() +1
  const type = req.query.type;
  const puissance = parseInt(req.query.puissance);
  const dateString =
    req.query.date ||
    `${todayDay}${todayMonth}${today.getFullYear()}`;

  const day = dateString.slice(0, 2);
  const month = dateString.slice(2, 4);
  const year = dateString.slice(4);
  const date = new Date(+year, month - 1, +day);


  const data = type === "BASE" ? trvBase : trvVariable;
  const dataPuissance = data.filter((item) => item.P_SOUSCRITE === puissance);
  const dataResult = dataPuissance.filter(
    (item) => item.DATE_DEBUT.getTime() < date.getTime()
  );
  res.send(dataResult);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
