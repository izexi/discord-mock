import { FastifyInstance } from 'fastify';
import * as mockMe from '../rest/mockData/me.json';
import cache from '../util/cache';
import util from '../util';

export default function(fastify: FastifyInstance, _: null, next: () => void) {
  // https://discordapp.com/developers/docs/resources/user#get-current-user
  fastify.get('/@me', (_, reply) => {
    reply.code(200).send(mockMe);
  });

  // https://discordapp.com/developers/docs/resources/user#get-user
  fastify.get('/:id', (request, reply) => {
    const user = cache.users.get(request.params.id);
    if (!user)
      reply.code(404).send({
        message: 'Unknown User',
        code: 10013
      });
    else reply.code(200).send(user);
  });

  // https://discordapp.com/developers/docs/resources/user#modify-current-user
  fastify.patch('/@me', (request, reply) => {
    const {
      body: { username, avatar }
    } = request;
    const { length } = username.toString();
    const me = cache.users.get(mockMe.id);
    if (length < 2 || length > 32)
      reply.code(400).send({
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
    else {
      me.username = username.toString();
      // https://github.com/ragingwind/data-uri-regex/blob/master/index.js#L6
      if (/^(data:)([\w/+]+);(charset=[\w-]+|base64).*,(.*)/gi.test(avatar))
        me.avatar = avatar;
    }
    reply.code(200).send(me);
  });

  // https://discordapp.com/developers/docs/resources/user#get-current-user-guilds
  fastify.get('/@me/guilds', (_, reply) => {
    reply.code(200).send([...cache.guilds.values()]);
  });

  // https://discordapp.com/developers/docs/resources/user#leave-guild
  fastify.delete('/@me/guilds/:id', (request, reply) => {
    const id = request.params.id;
    if (!cache.guilds.has(id))
      reply.code(404).send({
        message: 'Unknown Guild',
        code: 10004
      });
    cache.guilds.delete(id);
    reply.code(204).send();
  });

  // https://discordapp.com/developers/docs/resources/user#get-user-dms
  fastify.get('/@me/channels', (_, reply) => {
    // "For bots, this is no longer a supported method of getting recent DMs, and will return an empty array."
    reply.code(200).send([]);
  });

  // https://discord.com/developers/docs/resources/user#create-dm
  fastify.post('/@me/channels', (request, reply) => {
    const {
      body: { recipient_id }
    } = request;
    const user = cache.users.get(recipient_id);
    if (!/\d{17,19}/.test(recipient_id))
      reply.code(400).send({
        message: 'Invalid Recipient(s)',
        code: 50033
      });
    else {
      const dmChannel = {
        id: util.generateID(),
        last_message_id: null,
        type: 1,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        recipients: [(({ bot, system, ...user }) => user)(user!)]
      };
      cache.channels.set(dmChannel.id, dmChannel);
      reply.code(200).send(dmChannel);
    }
  });

  next();
}
