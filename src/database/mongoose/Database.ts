import mongoose, { ConnectionOptions } from 'mongoose';

import config from '@config/Config';

class Database {
  public uri: string;

  constructor() {
    const { HOST, PORT, NAME, USERNAME, PASSWORD } = config.db;
    if (USERNAME != null && PASSWORD != null) {
      this.uri = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${NAME}`;
    } else {
      this.uri = `mongodb://${HOST}:${PORT}/${NAME}`;
    }
  }

  public connect(appListen: () => void) {
    // When successfully connected
    mongoose.connection.on('connected', () => {
      // eslint-disable-next-line no-console
      console.log(`Connected to ${config.NODE_ENV} DB.`);

      appListen();
    });

    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.log('Mongoose default connection error.', err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      // eslint-disable-next-line no-console
      console.log('Mongoose default connection disconnected.');
    });

    const gracefulExit = () => {
      mongoose.connection.close(() => {
        // eslint-disable-next-line no-console
        console.log(
          'Mongoose default connection disconnected through app termination.',
        );
        process.exit(0);
      });
    };

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

    // mongoose connection options
    const options: ConnectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };

    try {
      mongoose.connect(this.uri, options);
      // eslint-disable-next-line no-console
      console.log(`Trying to connect to ${config.NODE_ENV} DB.`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Server initialization failed.', error.message);
    }
  }
}

export default new Database();
