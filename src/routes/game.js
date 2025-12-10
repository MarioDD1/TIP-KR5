const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { validateGameParams, validateGuess } = require('../middleware/validators');

// Получить состояние игры
router.get('/state', gameController.getGameState);

// Получить статистику игры
router.get('/stats', gameController.getGameStats);

// Получить подсказку
router.get('/hint/:type', gameController.getHint);

// Начать новую игру
router.post('/start', validateGameParams, gameController.startGame);

// Сделать предположение
router.post('/guess', validateGuess, gameController.makeGuess);

// Сбросить игру
router.delete('/reset', gameController.resetGame);

module.exports = router;