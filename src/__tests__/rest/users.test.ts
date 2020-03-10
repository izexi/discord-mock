import { FastifyInstance } from 'fastify';
import Util from '../../util/Util';
import { start } from '../..';
import { mockUser } from '../../rest/users/UsersMap';

let fastify: FastifyInstance;

beforeAll(async done => {
  fastify = await start();
  done();
});

describe('User', () => {
  it('Get User with an invalid ID', async done => {
    const response = await Util.mockRequest('GET', 'users/000');
    expect(response.status).toBe(404);
    expect(response.json()).resolves.toBe({
      message: 'Unknown User',
      code: 10013
    });
    done();
  });

  it('Get User with a valid ID', async done => {
    const response = await Util.mockRequest('GET', `users/${mockUser.id}`);
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toBe(mockUser);
    done();
  });
});

afterAll(() => fastify.close());
