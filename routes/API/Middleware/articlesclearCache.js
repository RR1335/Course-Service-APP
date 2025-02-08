const { getKeysByPattern, delKey } = require('../../../utils/redis');

/**
 *
 * @param id
 * @returns {Promise<void>}
 */
async function articlesClearCacheAll(id = null){
    // 清除所有文章列表缓存
    let keys = await getKeysByPattern('articles:*');
    if (keys.length !== 0) {
        await delKey(keys);
    }

    // 如果传递了id，则通过id清除文章详情缓存
    if (id) {
        // 如果是数组，则遍历
        const keys = Array.isArray(id) ? id.map(item => `article:${item}`) : `article:${id}`;
        await delKey(keys);
    }

}

module.exports ={
    articlesClearCacheAll
}
