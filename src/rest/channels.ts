import { FastifyInstance } from 'fastify';
import channelsMap, { Channel } from './mockData/channelsMap';
import Util from '../util/Util';
import messagesMap, { Message } from './mockData/messagesMap';

export default function(fastify: FastifyInstance, _: null, next: () => void) {
  // https://discordapp.com/developers/docs/resources/channel#get-channel
  fastify.get('/:id', (request, reply) => {
    const channel = Util.getEntity('Channel', channelsMap, request, reply);
    if (channel) reply.code(200).send(channel);
  });

  // https://discordapp.com/developers/docs/resources/channel#modify-channel (PUT)
  fastify.put('/', (request, reply) => {
    // TODO: Perm checking
    const { body } = request;
    const id = Util.generateID();
    // TODO: Validate fields
    const channel: Channel = { id, ...body };
    channelsMap.set(id, channel);
    reply.code(200).send(channel);
  });

  // https://discordapp.com/developers/docs/resources/channel#modify-channel (PUT)
  fastify.patch('/:id', (request, reply) => {
    const channel = Util.getEntity('Channel', channelsMap, request, reply);
    if (channel) {
      // TODO: Perm checking
      const { body } = request;
      // TODO: Validate fields
      Object.assign(channel, body);
      reply.code(200).send(channel);
    }
  });

  // https://discordapp.com/developers/docs/resources/channel#deleteclose-channel
  fastify.delete('/:id', (request, reply) => {
    const channel = Util.getEntity('Channel', channelsMap, request, reply);
    if (channel) {
      // TODO: Perm checking & handle category channel deletions
      channelsMap.delete(channel.id);
      reply.code(200).send(channel);
    }
  });

  // https://discordapp.com/developers/docs/resources/channel#get-channel-messages
  fastify.get('/:id/messages', (request, reply) => {
    const channel = Util.getEntity('Channel', channelsMap, request, reply);
    if (channel) {
      // TODO: Perm checking & use query params
      reply
        .code(200)
        .send(
          [...messagesMap.values()].filter(
            ({ channel_id }) => channel_id === request.params.id
          )
        );
    }
  });

  // https://discordapp.com/developers/docs/resources/channel#get-channel-message
  fastify.get('/:channel_id/messages/:id', (request, reply) => {
    const message = Util.getEntity('Message', messagesMap, request, reply);
    if (message) {
      // TODO: Perm checking
      reply.code(200).send(message);
    }
  });

  // https://discordapp.com/developers/docs/resources/channel#create-message
  fastify.post('/:channel_id/messages', (request, reply) => {
    // TODO: Perm checking
    const { body } = request;
    const id = Util.generateID();
    // TODO: Validate fields
    const message: Message = { id, ...body };
    messagesMap.set(id, message);
    reply.code(200).send(message);
  });

  // TODO: reactions endpoints

  // https://discordapp.com/developers/docs/resources/channel#edit-message
  fastify.patch('/:channel_id/messages/:id', (request, reply) => {
    const message = Util.getEntity('Message', messagesMap, request, reply);
    if (message) {
      // TODO: Perm checking
      const { body } = request;
      // TODO: Validate fields
      Object.assign(message, body);
      reply.code(200).send(message);
    }
  });

  // https://discordapp.com/developers/docs/resources/channel#delete-message
  fastify.delete('/:channel_id/messages/:id', (request, reply) => {
    const message = Util.getEntity('Message', messagesMap, request, reply);
    if (message) {
      // TODO: Perm checking
      messagesMap.delete(message.id);
      reply.code(204).send();
    }
  });

  // TODO: bulk-delete, permissions & invites endpoints

  // https://discordapp.com/developers/docs/resources/channel#get-channel-messages
  fastify.get('/:id/pins', (request, reply) => {
    const channel = Util.getEntity('Channel', channelsMap, request, reply);
    if (channel) {
      // TODO: Perm checking & use query params
      reply
        .code(200)
        .send(
          [...messagesMap.values()].filter(
            ({ channel_id, pinned }) =>
              channel_id === request.params.id && pinned
          )
        );
    }
  });

  // https://discordapp.com/developers/docs/resources/channel#add-pinned-channel-message
  fastify.put('/:channel_id/pins/:id', (request, reply) => {
    const message = Util.getEntity('Message', messagesMap, request, reply);
    if (message) {
      // TODO: Perm checking & handle max pins
      message.pinned = true;
      reply.code(204).send();
    }
  });

  // https://discordapp.com/developers/docs/resources/channel#delete-pinned-channel-message
  fastify.delete('/:channel_id/pins/:id', (request, reply) => {
    const message = Util.getEntity('Message', messagesMap, request, reply);
    if (message) {
      // TODO: Perm checking & handle unpinned
      message.pinned = false;
      reply.code(204).send();
    }
  });

  next();
}
