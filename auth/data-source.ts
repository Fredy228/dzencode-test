import { DataSource } from 'typeorm';
import * as process from 'process';

import { User } from './src/entity/user.entity';
import { UserDevices } from './src/entity/user-devices.entity';
import { Comment } from './src/entity/comment.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, UserDevices, Comment],
  synchronize: false,
  logging: !!Number(process.env.IS_LOGGING),
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
