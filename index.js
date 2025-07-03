const express = require('express');
const Task = require('./models/task'); 

const mongoDBconnection = require('./config/db')

const app = express();
mongoDBconnection();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home page - list all tasks
app.get('/', async (req, res) => {
  const tasks = await Task.find({});
  res.render('index', { tasks });
});

// Create task
app.post('/create', async (req, res) => {
  try {
    const { title, details } = req.body;
    await Task.create({ title, details });
    res.redirect('/');
  } catch (err) {
    res.send('❌ Failed to create task.');
  }
});

// Edit task page
app.get('/edit/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.render('edit', { task }); // pass the whole task object
});

// Update task POST
app.post('/edit/:id', async (req, res) => {
  const { title, details } = req.body;
  await Task.findByIdAndUpdate(req.params.id, { title, details });
  res.redirect('/');
});


// Delete task
app.post('/delete/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.send('❌ Failed to delete task.');
  }
});

app.listen(3001, () => {
  console.log('✅ Server running at http://localhost:3001');
});
