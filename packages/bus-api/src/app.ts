const nconf = require('./helpers/config');
import express = require('express');
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import { CoursesRouter } from './resources/courses';
import { LocationsRouter } from './resources/locations';
import { DirectionsRouter } from './resources/directions';


mongoose.connect(nconf.get('MONGO_DB'), { useNewUrlParser: true })
  .catch((e) => {
    console.log(e)
  });
export default class App {
  public server;

  constructor() {
    this.server = express();
    this.middleware();
    this.routes();
  }

  private middleware() {
    this.server.use(express.json());
    if (nconf.get('NODE_ENV') !== 'production') {
      this.server.use(morgan());
    }
  }

  private routes() {
    this.server.use(CoursesRouter);
    this.server.use(LocationsRouter);
    this.server.use(DirectionsRouter);
  }

  public start() {
    this.server.listen(nconf.get('PORT'), () => {
      console.info(`server listening at port ${nconf.get('PORT')}`)
    })
  }
}
