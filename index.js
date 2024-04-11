import app from "./app.js";
import config from "./utils/config.js";

const PORT = config.PORT || 3001;

app.get("/", (_, res) => res.send("<h1>Hello from ExpressJS!</h1>"));

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});