// Хранение состояния игры в памяти
let currentGame = null;

class GameController {
  // Начать новую игру
  startGame(req, res) {
    const { min = 1, max = 100, player } = req.body;
    
    const secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    
    currentGame = {
      id: Date.now(),
      player: player || 'Анонимный игрок',
      min: parseInt(min),
      max: parseInt(max),
      secretNumber,
      attempts: 0,
      maxAttempts: Math.ceil(Math.log2(max - min + 1)) + 3,
      guesses: [],
      startedAt: new Date().toISOString(),
      status: 'active'
    };
    
    res.json({
      message: `Игра начата! Угадай число от ${min} до ${max}.`,
      gameId: currentGame.id,
      maxAttempts: currentGame.maxAttempts,
      player: currentGame.player
    });
  }
  
  // Сделать предположение
  makeGuess(req, res) {
    if (!currentGame) {
      return res.status(400).json({ error: 'Нет активной игры. Начните новую игру.' });
    }
    
    const { guess } = req.body;
    const guessNum = parseInt(guess);
    
    currentGame.attempts++;
    currentGame.guesses.push({
      number: guessNum,
      attempt: currentGame.attempts,
      timestamp: new Date().toISOString()
    });
    
    let message = '';
    let status = 'continue';
    
    if (guessNum === currentGame.secretNumber) {
      message = `🎉 Поздравляем! Вы угадали число ${currentGame.secretNumber} за ${currentGame.attempts} попыток!`;
      status = 'win';
      currentGame.status = 'won';
      currentGame.completedAt = new Date().toISOString();
    } else if (currentGame.attempts >= currentGame.maxAttempts) {
      message = `💀 Игра окончена! Вы исчерпали все попытки. Загаданное число было: ${currentGame.secretNumber}`;
      status = 'lose';
      currentGame.status = 'lost';
      currentGame.completedAt = new Date().toISOString();
    } else if (guessNum < currentGame.secretNumber) {
      message = `📈 Загаданное число БОЛЬШЕ чем ${guessNum}. Попытка ${currentGame.attempts} из ${currentGame.maxAttempts}`;
    } else {
      message = `📉 Загаданное число МЕНЬШЕ чем ${guessNum}. Попытка ${currentGame.attempts} из ${currentGame.maxAttempts}`;
    }
    
    res.json({
      message,
      status,
      game: {
        attempts: currentGame.attempts,
        maxAttempts: currentGame.maxAttempts,
        guesses: currentGame.guesses.slice(-5),
        range: { min: currentGame.min, max: currentGame.max }
      }
    });
  }
  
  // Получить текущее состояние игры
  getGameState(req, res) {
    if (!currentGame) {
      return res.status(404).json({ error: 'Нет активной игры' });
    }
    
    // Очищаем секретное число из ответа
    const gameState = { ...currentGame };
    delete gameState.secretNumber;
    
    res.json(gameState);
  }
  
  // Получить статистику игры
  getGameStats(req, res) {
    const { type } = req.query;
    
    const stats = {
      active: currentGame ? true : false,
      totalGames: 1,
      lastGame: currentGame ? {
        player: currentGame.player,
        status: currentGame.status,
        attempts: currentGame.attempts,
        startedAt: currentGame.startedAt
      } : null
    };
    
    if (type === 'detailed' && currentGame) {
      stats.details = {
        range: `${currentGame.min}-${currentGame.max}`,
        guesses: currentGame.guesses.length,
        timePlaying: currentGame.startedAt ? 
          Math.floor((new Date() - new Date(currentGame.startedAt)) / 1000) : 0
      };
    }
    
    res.json(stats);
  }
  
  // Сбросить игру
  resetGame(req, res) {
    currentGame = null;
    res.json({ message: 'Игра сброшена. Можете начать новую игру.' });
  }
  
  // Получить подсказку
  getHint(req, res) {
    if (!currentGame) {
      return res.status(400).json({ error: 'Нет активной игры' });
    }
    
    const { type } = req.params;
    let hint = '';
    
    switch(type) {
      case 'range':
        hint = `Число находится между ${currentGame.min} и ${currentGame.max}`;
        break;
      case 'parity':
        hint = `Число ${currentGame.secretNumber % 2 === 0 ? 'четное' : 'нечетное'}`;
        break;
      case 'half':
        const middle = Math.floor((currentGame.max - currentGame.min) / 2) + currentGame.min;
        hint = `Число ${currentGame.secretNumber > middle ? 'больше' : 'меньше или равно'} ${middle}`;
        break;
      default:
        hint = `Доступные подсказки: range, parity, half`;
    }
    
    res.json({ hint });
  }
}

module.exports = new GameController();