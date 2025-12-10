const express = require('express');
const router = express.Router();

// Главная страница
router.get('/', (req, res) => {
  res.sendFile('index.html', { root: './src/public' });
});

// Страница игры
router.get('/game', (req, res) => {
  res.sendFile('game.html', { root: './src/public' });
});

// API документация
router.get('/api', (req, res) => {
  res.json({
    name: 'Guess Number Game API',
    version: '1.0.0',
    endpoints: {
      'GET /api/game/state': 'Получить состояние текущей игры',
      'GET /api/game/stats': 'Получить статистику игры',
      'GET /api/game/hint/:type': 'Получить подсказку (range, parity, half)',
      'POST /api/game/start': 'Начать новую игру',
      'POST /api/game/guess': 'Сделать предположение',
      'DELETE /api/game/reset': 'Сбросить игру'
    }
  });
});

module.exports = router;