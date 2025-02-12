const { delKey } = require('../../../utils/redis');

/**
 *
 * @param category
 * @returns {Promise<void>}
 */
async function categroyClearCache(category = null) {
   await delKey('categories');

   if (category) {
      await delKey(`category:${category.id}`);
   }
}

module.exports = {
   categroyClearCache,
};
