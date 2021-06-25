const nconf = require('./helpers/config');
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import routes from './routes';

const app = express();

mongoose.connect(nconf.get('MONGO_DB'), { useNewUrlParser: true })
  .catch((e) => {
    console.log(e)
  });


// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(routes);

app.get('/', (req, res) =>
  res.json({
    status: 'OK'
  })
);

app.use((err, req, res, next) => {

  res
    .status(500)
    .json({
      error: {
        message: err.message,
      }
    });
})

app.listen(nconf.get('PORT'), () =>
  console.log(`Server running on PORT ${nconf.get('PORT')}`)
);