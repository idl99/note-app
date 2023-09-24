import * as redis from "redis";

export default class Cache {
  static DEFAULT_CACHE_EXPIRATION_IN_SECONDS = 300;

  /**
   * @type {Cache}
   */
  static instance;

  /**
   *
   * @param {import("redis").RedisClientType} client
   */
  constructor(client) {
    this._client = client;
  }

  async set(key, value) {
    return await this._client.setEx(
      key,
      Cache.DEFAULT_CACHE_EXPIRATION_IN_SECONDS,
      JSON.stringify(value)
    );
  }

  async get(key) {
    return await this._client.get(key).then((value) => JSON.parse(value));
  }

  async invalidate(key) {
    return await this._client.del(key);
  }

  static async getInstance(host, port) {
    if (Cache.instance) {
      return Cache.instance;
    }

    const client = redis.createClient({
      url: `redis://${host}:${port}`,
    });

    await client.connect();

    Cache.instance = new Cache(client);

    return Cache.instance;
  }
}
