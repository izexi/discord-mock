import { FastifyInstance, HTTPMethod } from 'fastify';
import { promises as fs } from 'fs';
import { join } from 'path';

export default {
  mockData<T extends { id: T['id'] }>(data: T) {
    return new Map([[data.id, data]]);
  },
  async flattenPaths(folder: string, subfolder = '') {
    const parents = await fs.readdir(join(__dirname, '..', folder));
    const childrenPaths = parents.reduce((files, parent) => {
      const parentDir = join(__dirname, '..', folder, parent, subfolder);
      files.add(
        fs
          .readdir(parentDir)
          .then(children => children.map(child => join(parentDir, child)))
      );
      return files;
    }, new Set() as Set<Promise<string[]>>);
    return Promise.all(childrenPaths).then(paths => paths.flat());
  },
  mockRequest: (
    fastify: FastifyInstance,
    method: HTTPMethod,
    ...params: string[]
  ) =>
    fastify.inject({
      method,
      url: `/users/${params.join('/')}`,
      headers: {
        Authorization:
          'Bot MzU4NDA0MjA3NDMyMzAyNTkz.XmOtdQ.5LNoSt7UHE0ZAw3cRbDvymBgets'
      }
    })
};
