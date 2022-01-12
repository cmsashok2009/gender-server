const axios = require("axios");

require("dotenv").config();
const redis = require("redis");

const client = redis.createClient({
  host: process.env.REDIS_HOSTNAME,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

// const client = redis.createClient({
//   port: 6379,
// });

client.on("connect", () => {
  console.log("Connected to our redis instance!");
  client.set("sample data", "hello world");
});

client.on("error", (error) => {
  console.error(error);
});

const fetchGender = async (req, res, next) => {
  try {
    //get the food item.

    let { uname } = req.params;

    //hash the key.

    let hashKey = new Buffer.from(`${uname}}`).toString("base64");

    //check the data on redis store.

    client.hget(hashKey, uname, async (_, result) => {
      if (result) {
        //send the response from cache

        return res.send({
          success: true,
          message: JSON.parse(result),
          meta_data: "from cache",
        });
      } else {
        //fetch the data.

        const result = await axios
          .get(`https://api.genderize.io/?name=${uname}`)
          .catch(console.log);

        //set the data on cache

        client.hset(hashKey, uname, JSON.stringify(result.data));

        //set the duration of cache.

        client.expire(hashKey, 60);

        //send the response

        return res.send({
          success: true,
          message: result.data,
          meta_data: "from server",
        });
      }
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err,
    });
  }
};

module.exports = {
  fetchGender,
};
