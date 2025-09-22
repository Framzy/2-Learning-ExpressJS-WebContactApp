import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import { loadContact, findContact } from "./utils/contacts.js";

const app = express();
const port = 3000;

// gunakan ejs
app.set("view engine", "ejs");

// third-party middleware (created by npm package or third-party)
app.use(expressEjsLayouts);

// built-in middleware (created by express itself)
app.use(express.static("public"));

// Application level middleware (created by user)
// app.use((req, res, next) => {
//   console.log("Time: ", Date.now());
//   next();
// });

app.get("/", (req, res) => {
  const mhs = [
    {
      nama: "farden",
      kelas: "rq",
    },
    {
      nama: "ramzy",
      kelas: "rq",
    },
    {
      nama: "muharram",
      kelas: "rq",
    },
  ];
  const vocals = {
    layout: "layouts/main-layout",
    title: "Home Page",
    nama: "farden",
    mhs,
  };
  res.render("index", vocals);
});

app.get("/about", (req, res) => {
  const vocals = {
    layout: "layouts/main-layout",
    title: "About Page",
  };
  res.render("about", vocals);
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  const vocals = {
    layout: "layouts/main-layout",
    title: "Contact Page",
    contacts,
  };
  res.render("contact", vocals);
});

app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  console.log(contact);

  const vocals = {
    layout: "layouts/main-layout",
    title: "Contact Page",
    contact,
  };
  res.render("detail", vocals);
});

app.get("/product/:id", (req, res) => {
  res.render("product");
  res.send(`Product ID : ${req.params.id} <br> 
    Category : ${req.query.category} `);
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("404");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
