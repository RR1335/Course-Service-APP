const express = require('express');
const router = express.Router();
const { Attachment } = require('../../models');
const { success, failure } = require('../../utils/responses');
const { singleFileUpload } = require('../../utils/aliyunoss');
const { BadRequest } = require('http-errors')

/**
 * 客户端上传图片 ——  阿里云 OSS
 * view app.use
 */
router.post('/aliyun', function (req, res) {
    try {
        singleFileUpload(req, res, function (error) {
            if (error) {
                return failure(res, error);
            }

            if (!req.file) {
                return failure(res, new BadRequest('请选择要上传的文件。'));
            }

            // 附件信息的关联
            Attachment.create({
                ...req.file,
                userId: req.userId,
                fullpath: req.file.path + '/' + req.file.filename,
            })

            success(res, '上传成功。', {file: req.file});
        })
    } catch (error) {
        failure(res, error);
    }
})

module.exports = router;
