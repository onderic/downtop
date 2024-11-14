import { name, version, repository } from '../../package.json';
import config from '../config/config';

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: `${name} API documentation`,
    version,
    license: {
      name: 'MIT',
      url: repository
    }
  },
  tags: [
    { name: 'Auth', description: 'Operations related to authentication' },
    { name: 'User', description: 'Operations related to users' }
  ],
  servers: [
    {
      url: `http://localhost:${config.port}/v1`
    }
  ]
};

export default swaggerDef;
