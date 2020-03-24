import { HTTPMethod, FastifyRequest, FastifyReply } from 'fastify';
import { promises as fs } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import { ServerResponse } from 'http';

export default {
  generateID(map?: Map<string, object>): string {
    const id = Array.from({ length: 18 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    if (!map?.has(id)) return id;
    return this.generateID(map);
  },
  getEntity<T>(
    type: 'Channel' | 'Message',
    map: Map<string, T>,
    request: FastifyRequest,
    reply: FastifyReply<ServerResponse>
  ): T | undefined {
    const entity = map.get(request.params.id);
    if (!entity)
      reply.code(404).send({
        message: `Unknown ${type}`,
        code: 10013
      });
    return entity;
  },
  mockData<T extends { id: T['id'] }>(data: T | T[]) {
    return new Map(
      Array.isArray(data) ? data.map(this.formatData) : [this.formatData(data)]
    );
  },
  formatData<T extends { id: T['id'] }>(data: T): [T['id'], T] {
    return [data.id, data];
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
    method: HTTPMethod,
    url: string,
    body?: { [key: string]: string }
  ) =>
    fetch(`http://localhost:${process.env.PORT}/${url}`, {
      method,
      headers: {
        Authorization:
          'Bot MzU4NDA0MjA3NDMyMzAyNTkz.XmOtdQ.5LNoSt7UHE0ZAw3cRbDvymBgets',
        ...(body ? { 'Content-Type': 'application/json' } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    })
};
