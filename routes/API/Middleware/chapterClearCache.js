const { delKey } = require('../../../utils/redis');

/**
 *
 * @param chapter
 * @returns {Promise<void>}
 */
async function chapterClearCache(chapter) {
   await delKey(`chapters:${chapter.courseId}`);
   await delKey(`chapter:${chapter.id}`);
}

module.exports = {
   chapterClearCache,
};
