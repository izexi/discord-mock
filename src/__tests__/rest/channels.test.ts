import { start } from '../..';
import mockMe from '../../rest/mockData/mockMe';
import Util from '../../util/Util';
import { mockChannel } from '../../rest/mockData/channelsMap';
import mockMessages, { mockMessage } from '../../rest/mockData/messagesMap';

beforeAll(start);

describe('User', () => {
  it('Get Channel with an invalid ID', async done => {
    const response = await Util.mockRequest('GET', 'channels/000');
    expect(response.status).toEqual(404);
    expect(response.json()).resolves.toEqual({
      message: 'Unknown Channel',
      code: 10013
    });
    done();
  });

  it('Get Channel with a valid ID', async done => {
    const response = await Util.mockRequest(
      'GET',
      `channels/${mockChannel.id}`
    );
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toEqual(mockChannel);
    done();
  });

  it('Modify Channel (PUT)', async done => {
    const response = await Util.mockRequest('PUT', 'channels', {
      username: 'foo'
    });
    expect(response.status).toBe(200);
    const expectedMe = mockMe;
    expectedMe.username = 'foo';
    expect(response.json()).resolves.toEqual(expectedMe);
    done();
  });

  it('Modify Channel (PATCH)', async done => {
    const response = await Util.mockRequest(
      'PATCH',
      `channels/${mockChannel.id}`,
      { name: 'foo' }
    );
    expect(response.status).toBe(200);
    const expectedChannel = mockChannel;
    expectedChannel.name = 'name';
    expect(response.json()).resolves.toEqual(expectedChannel);
    done();
  });

  it('Delete Channel', async done => {
    const response = await Util.mockRequest(
      'DELETE',
      `channels/${mockChannel.id}`
    );
    expect(response.status).toBe(200);
    expect(
      Util.mockRequest('GET', `channels/${mockChannel.id}`).then(
        res => res.status
      )
    ).resolves.toBe(400);
    done();
  });

  // TODO: Test query string params
  it('Get Channel Messages', async done => {
    const response = await Util.mockRequest(
      'GET',
      `channels/${mockChannel.id}/messages`
    );
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toEqual(mockMessages);
    done();
  });

  it('Get Channel Message', async done => {
    const response = await Util.mockRequest(
      'GET',
      `channels/${mockChannel.id}/messages/${mockMessage.id}`
    );
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toEqual(mockMessage);
    done();
  });

  // TODO: Test other params
  it('Create Message', async done => {
    const response = await Util.mockRequest(
      'POST',
      `channels/${mockChannel.id}/messages`,
      {
        content: 'foo'
      }
    );
    expect(response.status).toBe(200);
    expect(
      response.json().then(message => message.content === 'foo')
    ).resolves.toBe(true);
    done();
  });

  // TODO: Test reactions endpoints

  // TODO: Test other params
  it('Edit Message', async done => {
    const response = await Util.mockRequest(
      'PATCH',
      `channels/${mockChannel.id}/messages/${mockMessage.id}`,
      { content: 'bar' }
    );
    expect(response.status).toBe(200);
    const expectedMessage = mockMessage;
    expectedMessage.content = 'bar';
    expect(response.json()).resolves.toEqual(expectedMessage);
    done();
  });

  it('Delete Message', async done => {
    const response = await Util.mockRequest(
      'DELETE',
      `channels/${mockChannel.id}/messages/${mockMessage.id}`
    );
    expect(response.status).toBe(200);
    expect(
      Util.mockRequest(
        'GET',
        `channels/${mockChannel.id}/messages/${mockMessage.id}`
      ).then(res => res.status)
    ).resolves.toBe(400);
    done();
  });

  // TODO: Test bulk-delete, permissions & invites endpoint

  it('Get Pinned Messages', async done => {
    const response = await Util.mockRequest(
      'GET',
      `channels/${mockChannel.id}/pins`
    );
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toEqual(
      [...mockMessages.values()].filter(message => message.pinned)
    );
    done();
  });

  it('Add Pinned Channel Message', async done => {
    const response = await Util.mockRequest(
      'PUT',
      `channels/${mockChannel.id}/pins/${mockMessage.id}`
    );
    expect(response.status).toBe(204);
    expect(
      Util.mockRequest(
        'GET',
        `channels/${mockChannel.id}/messages/${mockMessage.id}`
      )
        .then(res => res.json())
        .then(message => message.pinned)
    ).resolves.toBe(true);
    done();
  });

  it('Delete Pinned Channel Message', async done => {
    const response = await Util.mockRequest(
      'DELETE',
      `channels/${mockChannel.id}/pins/${mockMessage.id}`
    );
    expect(response.status).toBe(204);
    expect(
      Util.mockRequest(
        'GET',
        `channels/${mockChannel.id}/messages/${mockMessage.id}`
      )
        .then(res => res.json())
        .then(message => message.pinned)
    ).resolves.toBe(false);
    done();
  });
});
