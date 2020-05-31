import Util from '../../util';
import * as mockChannel from '../../rest/mockData/channel.json';
import * as mockMessage from '../../rest/mockData/message.json';

describe('channels endpoint', () => {
  it('Get Channel with an invalid ID', async done => {
    const response = await Util.mockRequest('GET', 'channels/000');
    expect(response.statusCode).toEqual(404);
    expect(response.json()).toEqual({
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
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockChannel);
    done();
  });

  // TODO: Test query string params
  it('Get Channel Messages', async done => {
    const response = await Util.mockRequest(
      'GET',
      `channels/${mockChannel.id}/messages`
    );
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([mockMessage]);
    done();
  });

  it('Get Channel Message', async done => {
    const response = await Util.mockRequest(
      'GET',
      `channels/${mockChannel.id}/messages/${mockMessage.id}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockMessage);
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
    expect(response.statusCode).toBe(200);
    expect(response.json().content === 'foo').toBe(true);
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
    expect(response.statusCode).toBe(200);
    const expectedMessage = mockMessage;
    expectedMessage.content = 'bar';
    expect(response.json()).toEqual(expectedMessage);
    done();
  });

  // TODO: Test bulk-delete, permissions & invites endpoint

  it('Get Pinned Messages', async done => {
    const response = await Util.mockRequest(
      'GET',
      `channels/${mockChannel.id}/pins`
    );
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
    done();
  });

  it('Add Pinned Channel Message', async done => {
    const response = await Util.mockRequest(
      'PUT',
      `channels/${mockChannel.id}/pins/${mockMessage.id}`
    );
    expect(response.statusCode).toBe(204);
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
    expect(response.statusCode).toBe(204);
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

  it('Delete Message', async done => {
    const response = await Util.mockRequest(
      'DELETE',
      `channels/${mockChannel.id}/messages/${mockMessage.id}`
    );
    expect(response.statusCode).toBe(204);
    expect(
      Util.mockRequest(
        'GET',
        `channels/${mockChannel.id}/messages/${mockMessage.id}`
      ).then(res => res.statusCode)
    ).resolves.toBe(404);
    done();
  });

  it('Modify Channel (PUT)', async done => {
    const response = await Util.mockRequest('PUT', 'channels', {
      name: 'foo'
    });
    expect(response.statusCode).toBe(200);
    done();
  });

  it('Modify Channel (PATCH)', async done => {
    const response = await Util.mockRequest(
      'PATCH',
      `channels/${mockChannel.id}`,
      { name: 'foo' }
    );
    expect(response.statusCode).toBe(200);
    const expectedChannel = mockChannel;
    expectedChannel.name = 'foo';
    expect(response.json()).toEqual(expectedChannel);
    done();
  });

  it('Delete Channel', async done => {
    const response = await Util.mockRequest(
      'DELETE',
      `channels/${mockChannel.id}`
    );
    expect(response.statusCode).toBe(200);
    expect(
      Util.mockRequest('GET', `channels/${mockChannel.id}`).then(
        res => res.statusCode
      )
    ).resolves.toBe(404);
    done();
  });
});
