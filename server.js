//Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

//add port
const PORT = 3001;

const app = express();

//add express middleware structure
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//get notes html route
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received to retrieve notes`);
  //read file
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // console.log(`Line 31: ${data}`); // console log to see what data is
      //console.log(data);

      const parsedData = JSON.parse(data);
      //console.log(parsedData);
      //turn the data into json format
      res.json(parsedData);
    }
  });
});
//get request, What does * do?
// * defines a route that matches any get request
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//post request for adding notes
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request recieved to add notes`);
  // console.log(req);
  //create notes structure
  //object destructuring
  const { title, text } = req.body;
  console.log(`Text: ${text}`);
  console.log(`Title: ${title}`);
  if (title || text) {
    const newNote = {
      title,
      text,
      id: uuid.v1(),
    };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const formattedNotes = JSON.parse(data);

        formattedNotes.push(newNote);

        fs.writeFile(
          "./db/db.json",
          JSON.stringify(formattedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.log("Successfully updated notes")
        );
      }
    });
    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);

    res.status(201).json(response);
  } else {
    res.status(500).json("Error posting response");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  console.info(`${req.method} request to delete note.`);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json("Error deleting post");
    } else {
      console.log(data);
      const parsedData = JSON.parse(data);
      const filteredData = parsedData.filter((data) => {
        return data.id !== req.params.id;
      });
      console.log(filteredData);
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(filteredData, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.log("Successfully updated notes")
      );
      res.status(201).json("successful response");
    }
  });
});

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
