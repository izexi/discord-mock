import * as Fastify from 'fastify';
import Util from './util/Util';
import { HTTPMethod } from 'fastify';

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
  const methodPaths = await Util.flattenPaths('routes', 'methods');
  await Promise.all(
    methodPaths.map(methodPath =>
      fastify.route({
        method: methodPath.match(/\\methods\\([A-Z]+).[tj]s/)![1] as HTTPMethod,
        ...require(methodPath).default
      })
    )
  );
  if (!test) await fastify.listen(3000);
  return fastify;
}

if (!test) start();
