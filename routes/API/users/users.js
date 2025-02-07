const  express = require("express")
const  router = express.Router()
const { Op } = require("sequelize")

const { User } = require("../../../models")
const {ufilterBody}  = require("./Ufilter")
const {getUser} = require('./getuser')
const {
        success,
        failure
    } = require('../../../utils/responses')


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
        where:{},
        order:[['id','DESC']],
        limit: pageSize,
        offset:offset
    }

    if (query.email) {
        condition.where.email = query.email
    }

    if (query.username) {
        condition.where.username = query.username
    }

    if (query.nickname) {
        condition.where.nickname = {
            [Op.like]: `%${ query.nickname }%`
        };
    }

    if (query.role) {
        condition.where.role = query.role
    }


    // 通过异步获取数据
    const { count,rows} = await User.findAndCountAll(condition)

    res.json({
        status: true,
        message: "查询成功",
        data: {
            articles: rows,
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
 * 查询当前用户信息
 * 在 router.get('/:id', 之前，否则会将 me 作为 id 进行查询；路由次序要注意。
 */
router.get('/me', async function (req, res) {
    try {
        const user = req.user;
        success(res, '查询当前用户信息成功。', { user });

        // 获取到当前用户
        req.user = user
        console.log(req.user)

    } catch (error) {
        failure(res, error);
    }

});


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
