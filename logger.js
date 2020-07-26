Winston = require('winston')

const errorStackFormat = Winston.format(info => {
    if (info instanceof Error) {
      return Object.assign({}, info, {
        stack: info.stack,
        message: info.message
      })
    }
    return info
  })

const myformat = Winston.format.combine(
    Winston.format.colorize(),
    Winston.format.timestamp(),
    Winston.format.align(),
    Winston.format.cli({ 
        colors: {     
            error: 'red',
            warn: 'yellow',
            info: 'cyan',
            debug: 'green'
        },
}));

const { 
    createLogger,
    transports,
    format
} = Winston;

const logger = createLogger({
    transports:[
        new transports.Console({
            filename: 'info.log',
            format: Winston.format.combine(errorStackFormat(), myformat)
        })
    ]
});

module.exports = logger;