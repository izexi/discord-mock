import { FastifyInstance } from 'fastify';
import { mockUser } from '../../routes/users/UsersMap';
import Util from '../../util/Util';

let fastify: FastifyInstance;

describe('User', () => {
  it('Get User with an invalid ID', async done => {
    const response = await Util.mockRequest(fastify, 'GET', '000');
    expect(response.statusCode).toBe(404);
    expect(response.payload).toBe(
      JSON.stringify({
        message: 'Unknown User',
        code: 10013
      })
    );
    done();
  });

  it('Get User with a valid ID', async done => {
    const response = await Util.mockRequest(fastify, 'GET', mockUser.id);
    expect(response.statusCode).toBe(200);
    expect(response.payload).toBe(JSON.stringify(mockUser));
    done();
  });
});

afterAll(() => fastify.close());
