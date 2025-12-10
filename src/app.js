const express = require('express');
const path = require('path');
const cors = require('cors');

// Импорт маршрутов
const indexRouter = require('./routes/index');
const gameRouter = require('./routes/game');

// Импорт middleware
const logger = require('./middleware/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Пользовательский middleware для логирования
app.use(logger);

// Маршруты
app.use('/', indexRouter);
app.use('/api/game', gameRouter);

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

module.exports = app;