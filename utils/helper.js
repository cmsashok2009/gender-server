const axios = require("axios");

const redis = require("redis");

const client = redis.createClient({
  port: 6379,
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

    client.hget(hashKey, uname, async (_, recipe) => {
      if (recipe) {
        //send the response from cache

        return res.send({
          success: true,
          message: JSON.parse(recipe),
          meta_data: "from cache",
        });
      } else {
        //fetch the data.

        const recipe = await axios
          .get(`https://api.genderize.io/?name=${uname}`)
          .catch(console.log);

        //set the data on cache

        client.hset(hashKey, uname, JSON.stringify(recipe.data));

        //set the duration of cache.

        client.expire(hashKey, 1440);

        //send the response

        return res.send({
          success: true,
          message: recipe.data,
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
