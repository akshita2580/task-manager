const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  fs.readdir('./files', (err, filenames) => {
    if (err) return res.send("Error reading directory");

    const files = filenames.map(filename => {
      const content = fs.readFileSync(`./files/${filename}`, 'utf8');
      return {
        title: filename.replace('.txt', ''),
        details: content
      };
    });

    res.render("index", { files });
  });
});



app.post('/create', (req, res) => {
  const title = req.body.title.trim().split(" ").join("");
  const details = req.body.details;

  fs.writeFile(`./files/${title}.txt`, details, (err) => {
    if (err) return res.send("Failed to save task.");
    res.redirect('/');
  });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

app.get('/edit/:filename', (req, res) => {
  const filename = req.params.filename;

  fs.readFile(`./files/${filename}.txt`, 'utf8', (err, data) => {
    if (err) return res.send("Failed to read file for editing.");

    res.render('edit', {
      oldtitle: filename,
      details: data
    });
  });
});

app.post('/edit', (req, res) => {
  const oldtitle = req.body.oldtitle.trim().split(" ").join("");
  const newtitle = req.body.newtitle.trim().split(" ").join("");
  const newdetails = req.body.newdetails;

  fs.rename(`./files/${oldtitle}.txt`, `./files/${newtitle}.txt`, (err) => {
    
    fs.writeFile(`./files/${newtitle}.txt`, newdetails, (err) => {
    
        if (err) return res.send("Failed to save task.");
        res.redirect('/');
      });
  });
});

app.post('/delete/:filename', (req, res) => {
  fs.unlink(`./files/${req.params.filename}.txt`, (err) => {    
    if (err) return res.send("Failed to save task.");
    res.redirect('/');
  });
});