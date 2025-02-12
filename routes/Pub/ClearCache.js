const express = require('express');
const router = express.Router();
const { success, failure } = require('../../utils/responses');

const { flushAll } = require('../../utils/redis');

router.get('/clear', async function (req, res) {
   try {
      await flushAll();
      success(res, '清除所有缓存成功。');
   } catch (error) {
      failure(res, error);
   }
});

module.exports = router;
