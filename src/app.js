import createError from 'http-errors'
import * as express from 'express'
import createServer from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { config } from 'dotenv'

import blockchainRouter from './routes/bc'

config()

var app = createServer();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/bc', blockchainRouter);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}`))

export default app;