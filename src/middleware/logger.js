const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  // Логируем тело запроса для POST, PUT, PATCH
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log('Тело запроса:', req.body);
  }
  
  // Логируем query параметры
  if (Object.keys(req.query).length > 0) {
    console.log('Query параметры:', req.query);
  }
  
  // Логируем params
  if (Object.keys(req.params).length > 0) {
    console.log('Params:', req.params);
  }
  
  next();
};

module.exports = logger;