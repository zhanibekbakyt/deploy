const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');  // Для работы с путями

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/dbtestuser', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Mongoose модель
const User = mongoose.model('User', {
  name: String,
});

// API маршруты
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const newUser = new User({ name: req.body.name });
  await newUser.save();
  res.status(201).json(newUser);
});

app.put('/api/users/:id', async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
  res.json(updatedUser);
});

app.delete('/api/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// Обслуживание статических файлов Angular
app.use(express.static(path.join(__dirname, 'dist', 'user-app')));

// Обработчик всех остальных запросов
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'user-app', 'index.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
