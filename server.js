"use strict";

const express = require("express");
const morgan = require("morgan");

const { top50 } = require("./data/top50");

const PORT = process.env.PORT || 8000;

const app = express();

const electMostPopularArtist = (songs) => {
  const artists = {};
  let popularSongNum = 0;
  let popularArtist;
  songs.forEach((song) => {
    let artist = song.artist;
    let currentSongs = artists[artist];
    console.log(currentSongs);
    //rearrange songs based on artists
    if (!artists[artist]) {
      artists[artist] = [song];
    } else {
      console.log(currentSongs);
      currentSongs.push(song);
      artists[artist] = currentSongs;
      console.log(artists[artist]);
    }
    //update 'popular' variable
    if (artists[artist].length > popularSongNum) {
      popularSongNum = artists[artist].length;
      popularArtist = artist;
    }
  });
  return artists[popularArtist];
};

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// endpoints here
app.get("/top50", (req, res) => {
  res.render("pages/top50", {
    title: "Top 50 Songs Streamed on Spotify",
    data: top50,
  });
});

app.get("/top50/popular-artist", (req, res) => {
  res.render("pages/top50", {
    title: "Most Popular Artist",
    data: electMostPopularArtist(top50),
  });
});

app.get("/top50/song/:rank", (req, res) => {
  const { rank } = req.params;
  if (rank > 0 && rank <= 50) {
    res.render("pages/song#", {
      title: `Song #${rank}`,
      data: top50[rank - 1],
    });
  } else {
    res.status(404);
    res.render("pages/fourOhFour", {
      title: "I got nothing",
      path: req.originalUrl,
    });
  }
});

// handle 404s
app.get("*", (req, res) => {
  res.status(404);
  res.render("pages/fourOhFour", {
    title: "I got nothing",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
