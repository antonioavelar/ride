const nconf = require('./helpers/config');
import express = require('express');
import * as mongoose from 'mongoose';
import sessionMiddleware from './middlewares/session';
import { CoursesRouter } from './resources/courses';
import { LocationsRouter } from './resources/locations';


mongoose.connect(nconf.get('MONGO_DB'), { useNewUrlParser: true })
  .catch((e) => {
    console.log(e)
  });
export default class App {
  public server;

  constructor() {
    this.server = express()
    this.middleware()
    this.routes()
  }

  private middleware() {
    this.server.use(express.json())
  }

  private routes() {
    this.server.use(sessionMiddleware, CoursesRouter);
    this.server.use(LocationsRouter);
  }

  public start() {
    this.server.listen(nconf.get('PORT'), () => {
      console.info(`server listening at port ${nconf.get('PORT')}`)
    })
  }
}
