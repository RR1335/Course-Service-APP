const express = require('express');

/**
 * 白名单过滤
 * @param req
 * @returns {{email: (string|*), username, password, nickname: (string|*), sex: (number|*), company: ({type: *}|*), introduce: ({type: *}|*), role: (number|string|*), avatar: ({type: *, validate: {isUrl: {msg: string}}}|*)}}
 */
function ufilterBody(req) {
   return {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      nickname: req.body.nickname,
      sex: req.body.sex,
      company: req.body.company,
      introduce: req.body.introduce,
      role: req.body.role,
      avatar: req.body.avatar,
   };
}

module.exports = {
   ufilterBody,
};
