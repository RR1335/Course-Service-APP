const  express = require("express")
const  router = express.Router()
const { Op } = require("sequelize")

const { User } = require("../../../models")
const {ufilterBody}  = require("../Middleware/Ufilter")
const {getUser} = require('../Middleware/getuser')
const {
        success,
        failure
    } = require('../../../utils/response')

/**
 * 查询 全部用户
 */
router.get('/', async function(req,res) {
try{
    const query = req.query

    // 通过前端定义，获取分页数据
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10

    const  offset = (currentPage - 1) * pageSize

    const condition = {
        order:[['id','DESC']],
        limit: pageSize,
        offset:offset
    }

    if (query.email) {
        condition.where = {
            email: {
                [Op.eq]: query.email
            }
        };
    }

    if (query.username) {
        condition.where = {
            username: {
                [Op.eq]: query.username
            }
        };
    }

    if (query.nickname) {
        condition.where = {
            nickname: {
                [Op.like]: `%${ query.nickname }%`
            }
        };
    }

    if (query.role) {
        condition.where = {
            role: {
                [Op.eq]: query.role
            }
        };
    }


    // 通过异步获取数据
    const { count,rows} = await User.findAndCountAll(condition)

    res.json({
        status: true,
        message: "查询成功",
        data: {
            users: rows,
            pagination: {
                total: count,
                currentPage: currentPage,
                pageSize: pageSize
            }
        }
    })
}catch (err) {
    failure(res,err)
}

})

/**
 * 查询特定用户
 */
router.get('/:id', async function(req,res) {
   try {
       const user = await getUser(req)

       success(res,"查询用户，成功！",{user})
    }catch (err) {
       failure(res,err)
   }
})

/**
 * 新增用户
 */
router.post('/', async function(req,res) {
    try {
        const body = ufilterBody(req)

        const user = await User.create(body)

        success(res, "新增用户，成功！", {user}, 201)

    }catch (err) {
        failure(res,err)
    }
})

/**
 * 删除用户
 */
router.delete('/:id', async function(req,res) {
    try{
        const user = await getUser(req)
        await user.destroy()

        success(res,"删除用户，成功！")


    }catch (err) {
        failure(res, err)
    }
})

/**
 * 更新用户
 */
router.put('/:id', async function(req,res) {
    try{
        const user = await getUser(req)

        const body = ufilterBody(req)
        await user.update(body)

        success(res,"更新用户，成功！",{user})

    }catch (err) {
        failure(res, err)
    }
})




module.exports = router
