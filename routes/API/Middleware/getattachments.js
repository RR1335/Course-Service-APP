const  express = require('express');
const { Attachment } = require('../../../models');
const { NotFound } = require('http-errors');



/**
 * 查询附件信息
 * @param req
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
async function getAttachment(req) {
    const { id } = req.params;

    const attachment = await Attachment.findByPk(id);
    if (!attachment) {
        throw new NotFound(`ID: ${id}的附件未找到。`)
    }

    return attachment;
}

module.exports = {
    getAttachment
}