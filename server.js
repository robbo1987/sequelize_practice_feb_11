const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres://localhost/acme_bookmarks");
const express = require("express");
const app = express();

const bookmark = sequelize.define("bookmark", {
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
    await bookmark.create({ website: "google.com", category: "search" });
    await bookmark.create({ website: "linkedIn.com", category: "jobs" });
    await bookmark.create({ website: "bing.com", category: "search" });
    await bookmark.create({ website: "indeed.com", category: "jobs" });
    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

start();

app.get("/", (req, res) => {
  res.send(`<html>
        <h1>
            hello world!
            
        </h1>
    </html>`);
});
