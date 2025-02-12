const { createClient } = require('redis');
const loggers = require('./Logger');

// 创建全局的 Redis 客户端实例
let client;

/**
 * 初始化 Redis
 * @returns {Promise<void>}
 */
const redisClient = async () => {
   if (client) return; // 如果客户端已经初始化，则不再重复初始化

   client = await createClient()
      // .on('error', err => console.log('Redis 连接失败', err))
      .on('error', (err) => loggers.error('Redis 连接失败：', err))
      .connect();
};

/**
 * 存入对象/数组，并选择过期时间
 * @param key /value  /ttl
 * @returns {Promise<void>}
 */
const setKey = async (key, value, ttl = null) => {
   if (!client) await redisClient(); // 确保客户端已初始化
   value = JSON.stringify(value); // 将对象转换为JSON字符串
   await client.set(key, value);

   // 如果提供了ttl，则设置过期时间
   // 传入的数据，以秒为单位
   if (ttl !== null) {
      await client.expire(key, ttl);
   }
};

/**
 * 读取数组/对象
 * @param key  @returns {Promise<any|null>}
 */
const getKey = async (key) => {
   if (!client) await redisClient(); // 确保客户端已初始化
   const value = await client.get(key); // 将获取到的JSON字符串转换回对象
   return value ? JSON.parse(value) : null; // 如果value为空，返回null而不是抛出错误
};

/**
 * 清空缓存记录
 * @param key @returns {Promise<void>}
 */
const delKey = async (key) => {
   if (!client) await redisClient(); // 确保客户端已初始化
   await client.del(key);
};

/**
 * 获得匹配「keys name」的所有keys values
 * @param pattern
 * @returns {Promise<*>}
 */
const getKeysByPattern = async (pattern) => {
   if (!client) await redisClient();
   return await client.keys(pattern);
};

/**
 * 清空所有的缓存
 * @returns {Promise<void>}
 */
const flushAll = async () => {
   if (!client) await redisClient();
   await client.flushAll();
};

module.exports = { redisClient, setKey, getKey, delKey, getKeysByPattern, flushAll };
