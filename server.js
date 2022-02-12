const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres://localhost/acme_bookmarks");
const express = require("express");
const app = express();

const Bookmark = sequelize.define("bookmark", {
  website: {
    type: Sequelize.DataTypes.STRING,
    allownull: false,
    validate: {
      notEmpty: true,
    },
  },
  category: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

const start = async () => {
  try {
    console.log("hello world");
    await sequelize.sync({ force: true });
    await Bookmark.create({ website: "google.com", category: "search" });
    await Bookmark.create({ website: "linkedIn.com", category: "jobs" });
    await Bookmark.create({ website: "bing.com", category: "search" });
    await Bookmark.create({ website: "indeed.com", category: "jobs" });
    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

start();

app.get("/", (req, res, next) => res.redirect("/bookmarks"));

app.get("/bookmarks", async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll();
    const html = bookmarks
      .map((bookmark) => {
        return `<div>${bookmark.website}<a href="/categories/${bookmark.category}"> ${bookmark.category}</a></div>`;
      })
      .join("");
    res.send(`
    <html>
      <style>
        div{
            padding:2rem;
        }
      </style>
      <head>
        <title> Robby's Bookmark Page</title>
        <h1>Robby's Bookmark page</h1>
        <ul>
        ${html}
        <ul>
      </head>
    <html>
    `);
  } catch (ex) {
    next(ex);
  }
});

app.get("/categories/:category", async (req, res, next) => {
  try {
    const category = req.params.category;
    const bookmarks = await Bookmark.findAll({
      where: { category },
    });
    const html = bookmarks
      .map((bookmark) => {
        return `<div>${bookmark.website} - ${bookmark.category}</div>`;
      })
      .join("");
    res.send(`
      <html>
        <style>
          div{
              padding:1 rem;
          }
          a{
              margin:20px;
          }
        </style>
        <head>
          <title> Robby's Bookmark Page</title>
          <h1>Robby's Bookmark Page For ${category}</h1>
          <a href = '/'> << back << </a>
          <ul>
          ${html}
          <ul>
        </head>
      <html>
      `);
  } catch (ex) {
    next(ex);
  }
});
