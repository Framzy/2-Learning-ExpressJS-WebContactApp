import express from "express";
import morgan from "morgan";

const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// View Engine
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Web Contact App" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Page" });
});

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Pesan dari ${name} <${email}>: ${message}`);
  res.render("index", { title: "Web Contact App" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
