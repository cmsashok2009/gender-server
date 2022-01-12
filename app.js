const express = require("express");

const cors = require("cors");

const { fetchGender } = require("./utils/helper");

const app = express();

app.use(cors());

app.get(`/checkgender/:uname`, fetchGender);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

//app.use(cors({ credentials: true, origin: "http://localhost:3001" }));
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", req.get("Origin") || "*");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
//   res.header("Access-Control-Expose-Headers", "Content-Length");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Accept, Authorization, Content-Type, X-Requested-With, Range"
//   );
//   if (req.method === "OPTIONS") {
//     return res.send(200);
//   } else {
//     return next();
//   }
// });
