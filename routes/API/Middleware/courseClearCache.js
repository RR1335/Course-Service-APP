const { getKeysByPattern, delKey } = require('../../../utils/redis');

async function courseClearCache(course = null) {
   let keys = await getKeysByPattern('courses:*');
   if (keys.length !== 0) {
      await delKey(keys);
   }

   if (course) {
      await delKey(`course:${course.id}`);
   }
}

module.exports = {
   courseClearCache,
};
