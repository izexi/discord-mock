import * as Fastify from 'fastify';
import Util from './util/Util';
import { HTTPMethod } from 'fastify';
import { join } from 'path';

export const fastify = Fastify();
const test = process.argv.some(arg => arg.includes('jest'));

fastify.addHook('preValidation', (request, reply, done) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !/Bot \w{24}\.[\w-]{6}\..{27}/.test(authHeader))
    reply.code(400).send({
      message: '401: Unauthorized',
      code: 0
    });
  done();
});

export async function start() {
  const endpointPaths = await Util.walk(join(__dirname, 'rest'), file =>
    /\\[A-Z]+\.js/.test(file)
  );
  await Promise.all(
    endpointPaths.map(endpointPath =>
      fastify.route({
        method: endpointPath.match(/([A-Z]+).[tj]s/)![1] as HTTPMethod,
        ...require(endpointPath).default
      })
    )
  );
  if (!test) await fastify.listen(3000);
  return fastify;
}

if (!test) start();
