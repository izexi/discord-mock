import * as Fastify from 'fastify';
import { join } from 'path';
import { promises as fs } from 'fs';
import cache from './util/cache';
import * as me from './rest/mockData/me.json';
import * as user from './rest/mockData/user.json';
import * as guild from './rest/mockData/guild.json';
import * as message from './rest/mockData/message.json';
import * as channel from './rest/mockData/channel.json';

const fastify = Fastify();
const test = process.argv.some(arg => arg.includes('jest'));
let booted = false;

cache.users.set(me.id, me);
cache.users.set(user.id, user);
cache.guilds.set(guild.id, guild);
cache.messages.set(message.id, message);
cache.channels.set(channel.id, channel);

fastify.addHook('preValidation', (request, reply, done) => {
  const authHeader = request.headers.authorization;
  // https://github.com/b1naryth1ef/disco/blob/371602fa4a2d45a017401372a45eefbb0841537a/disco/util/token.py#L3
  if (!authHeader || !/Bot \w{24}\.[\w-]{6}\..{27}/.test(authHeader))
    reply.code(401).send({
      message: '401: Unauthorized',
      code: 0
    });
  done();
});

export async function start() {
  if (booted) return fastify;
  const endpointsPath = join(__dirname, 'rest');
  const endpointFiles = await fs
    .readdir(endpointsPath)
    .then(fileOrFolders =>
      fileOrFolders.filter(fileOrFolder => /[tj]s$/.test(fileOrFolder))
    );
  await Promise.all(
    endpointFiles.map(endpointFile =>
      fastify.register(require(join(endpointsPath, endpointFile)).default, {
        prefix: endpointFile.split('.')![0]
      })
    )
  );
  if (!test) await fastify.listen(3000);
  booted = true;
  return fastify;
}

if (!test) start();
