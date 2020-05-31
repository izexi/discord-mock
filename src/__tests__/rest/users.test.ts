import Util from '../../util';
import * as mockMe from '../../rest/mockData/me.json';
import * as mockUser from '../../rest/mockData/user.json';
import * as mockGuild from '../../rest/mockData/guild.json';

describe('users endpoint', () => {
  it('Get Current User', async done => {
    const response = await Util.mockRequest('GET', '/users/@me');
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockMe);
    done();
  });

  it('Get User with an invalid ID', async done => {
    const response = await Util.mockRequest('GET', '/users/0');
    expect(response.statusCode).toEqual(404);
    expect(response.json()).toEqual({
      message: 'Unknown User',
      code: 10013
    });
    done();
  });

  it('Get User with a valid ID', async done => {
    const response = await Util.mockRequest('GET', `/users/${mockUser.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockUser);
    done();
  });

  it('Modify Current User with an invalid username', async done => {
    const response = await Util.mockRequest('PATCH', '/users/@me', {
      username: 'e'
    });
    expect(response.statusCode).toEqual(400);
    expect(response.json()).toEqual({
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
    const response = await Util.mockRequest('PATCH', '/users/@me', {
      username: 'foo'
    });
    expect(response.statusCode).toBe(200);
    const expectedMe = mockMe;
    expectedMe.username = 'foo';
    expect(response.json()).toEqual(expectedMe);
    done();
  });

  it('Get Current User Guilds ', async done => {
    const response = await Util.mockRequest('GET', '/users/@me/guilds');
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([mockGuild]);
    done();
  });

  it('Leave Guild', async done => {
    const response = await Util.mockRequest(
      'DELETE',
      'users/@me/guilds/953278943694159264'
    );
    expect(response.statusCode).toBe(204);
    expect(
      Util.mockRequest('GET', 'users/@me/guilds').then(res => res.json())
    ).resolves.toEqual([]);
    done();
  });

  it('Create DM with an invalid ID', async done => {
    const response = await Util.mockRequest('POST', 'users/@me/channels', {
      recipient_id: '000'
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: 'Invalid Recipient(s)',
      code: 50033
    });
    done();
  });

  it('Create DM', async done => {
    const response = await Util.mockRequest('POST', 'users/@me/channels', {
      recipient_id: '191615925336670208'
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().recipients[0].id).toEqual('191615925336670208');
    done();
  });
});
