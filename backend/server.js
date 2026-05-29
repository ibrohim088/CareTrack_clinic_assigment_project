import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import config from "./src/config/env.js";


connectDB().then(() => {
  app.listen(config.PORT, () => {
    console.log(`Server ${config.PORT} is running...`);
  });
});
