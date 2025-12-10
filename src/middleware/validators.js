const validateGameParams = (req, res, next) => {
  const { min = 1, max = 100 } = req.body;
  
  if (min >= max) {
    return res.status(400).json({ 
      error: 'Минимальное значение должно быть меньше максимального' 
    });
  }
  
  if (max - min < 10) {
    return res.status(400).json({ 
      error: 'Диапазон должен быть не менее 10 чисел' 
    });
  }
  
  if (max > 1000 || min < 1) {
    return res.status(400).json({ 
      error: 'Диапазон должен быть от 1 до 1000' 
    });
  }
  
  next();
};

const validateGuess = (req, res, next) => {
  const { guess } = req.body;
  
  if (!guess || isNaN(Number(guess))) {
    return res.status(400).json({ 
      error: 'Пожалуйста, предоставьте корректное число' 
    });
  }
  
  next();
};

module.exports = {
  validateGameParams,
  validateGuess
};