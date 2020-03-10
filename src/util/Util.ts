import { FastifyInstance, HTTPMethod } from 'fastify';
import { promises as fs } from 'fs';
import { join } from 'path';

export default {
  mockData<T extends { id: T['id'] }>(data: T) {
    return new Map([[data.id, data]]);
  },
  async walk(
    dir: string,
    fileFilter: (file: string) => boolean
  ): Promise<string[]> {
    const files = await fs.readdir(dir);
    return Promise.all(
      files.map(async file => {
        const fileDir = join(dir, file);
        const stats = await fs.stat(fileDir);
        return stats.isDirectory() ? this.walk(fileDir, fileFilter) : fileDir;
      })
    ).then(files => files.flat().filter(fileFilter));
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
