import { start } from '../..';
import { mockPartialGuilds } from '../../rest/mockData/guildsMap';
import mockMe from '../../rest/mockData/mockMe';
import { mockUser } from '../../rest/mockData/usersMap';
import Util from '../../util/Util';

beforeAll(start);

describe('User', () => {
  it('Get Current User', async done => {
    const response = await Util.mockRequest('GET', `users/@me`);
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toEqual(mockMe);
    done();
  });

  it('Get User with an invalid ID', async done => {
    const response = await Util.mockRequest('GET', 'users/000');
    expect(response.status).toEqual(404);
    expect(response.json()).resolves.toEqual({
      message: 'Unknown User',
      code: 10013
    });
    done();
  });

  it('Get User with a valid ID', async done => {
    const response = await Util.mockRequest('GET', `users/${mockUser.id}`);
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toEqual(mockUser);
    done();
  });

  it('Modify Current User with an invalid username', async done => {
    const response = await Util.mockRequest('PATCH', 'users/@me', {
      username: 'e'
    });
    expect(response.status).toEqual(400);
    expect(response.json()).resolves.toEqual({
      code: 50035,
      errors: {
        username: {
          _errors: [
            {
              code: 'BASE_TYPE_BAD_LENGTH',
              message: 'Must be between 2 and 32 in length.'
            }
          ]
        }
      },
      message: 'Invalid Form Body'
    });
    done();
  });

  it('Modify Current User', async done => {
    const response = await Util.mockRequest('PATCH', 'users/@me', {
      username: 'foo'
    });
    expect(response.status).toBe(200);
    const expectedMe = mockMe;
    expectedMe.username = 'foo';
    expect(response.json()).resolves.toEqual(expectedMe);
    done();
  });

  it('Get Current User Guilds ', async done => {
    const response = await Util.mockRequest('GET', 'users/@me/guilds');
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toEqual(mockPartialGuilds);
    done();
  });

  it('Leave Guild', async done => {
    const response = await Util.mockRequest(
      'DELETE',
      'users/@me/guilds/0123456789876543210'
    );
    expect(response.status).toBe(204);
    expect(
      Util.mockRequest('GET', 'users/@me/guilds').then(res => res.json())
    ).resolves.toEqual(
      mockPartialGuilds.filter(({ id }) => id !== '0123456789876543210')
    );
    done();
  });

  it('Create DM with an invalid ID', async done => {
    const response = await Util.mockRequest('POST', 'users/@me/channels', {
      // eslint-disable-next-line @typescript-eslint/camelcase
      recipient_id: '000'
    });
    expect(response.status).toBe(400);
    expect(response.json()).resolves.toEqual({
      message: 'Invalid Recipient(s)',
      code: 50033
    });
    done();
  });

  it('Create DM', async done => {
    const response = await Util.mockRequest('POST', 'users/@me/channels', {
      recipient_id: '191615925336670208'
    });
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toEqual({
      id: '777777777777777777',
      last_message_id: null,
      type: 1,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      recipients: [(({ bot, system, ...user }) => user)(mockUser)]
    });
    done();
  });
});
