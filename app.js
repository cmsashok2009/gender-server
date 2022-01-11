const express = require("express");

const { fetchGender } = require("./utils/helper");

const app = express();

app.get(`/checkgender/:uname`, fetchGender);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
