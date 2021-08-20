var winston = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, label, printf } = winston.format;


const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

var transport = new winston.transports.DailyRotateFile({
  dirname: './logs',
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

transport.on('rotate', function (oldFilename, newFilename) {
  // do something fun
});

var documentModelLogger = winston.createLogger({
  format: combine(
    label({ label: 'Docucmet Model Logger' }),
    timestamp(),
    myFormat
  ),
  transports: [
    transport
  ]
});

var documentRouteLogger = winston.createLogger({
  format: combine(
    label({ label: 'Docucmet Route Logger' }),
    timestamp(),
    myFormat
  ),
  transports: [
    transport
  ]
});

var uploadLogger = winston.createLogger({
  format: combine(
    label({ label: 'Upload Logger' }),
    timestamp(),
    myFormat
  ),
  transports: [
    transport
  ]
});

var passportLogger = winston.createLogger({
  format: combine(
    label({ label: 'Passport Logger' }),
    timestamp(),
    myFormat
  ),
  transports: [
    transport
  ]
});

var dbLogger = winston.createLogger({
  format: combine(
    label({ label: 'DB Logger' }),
    timestamp(),
    myFormat
  ),
  transports: [
    transport
  ]
});

var mainLogger = winston.createLogger({
  format: combine(
    label({ label: 'Main Index Logger' }),
    timestamp(),
    myFormat
  ),
  transports: [
    transport
  ]
});

// mainLogger.info('Hello World!');

module.exports = {
  documentModelLogger, documentRouteLogger, uploadLogger, passportLogger, dbLogger,
  mainLogger
}