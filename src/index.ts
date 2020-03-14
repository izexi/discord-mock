import * as Fastify from 'fastify';
import { join } from 'path';
import { promises as fs } from 'fs';

export const fastify = Fastify();
const test = process.argv.some(arg => arg.includes('jest'));

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
  await fastify.listen(3000);
  return fastify;
}

if (!test) start();
