// 导入express
const express = require('express')
// 创建服务器的实例对象
const app = express()
const joi = require('@hapi/joi')

// 导入并配置cors中间件
const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件，这个中间件只能解析application/x-www-form-urlencoded格式的表单
app.use(express.urlencoded({extended: false}))


// 一定要在路由之前，封装res.cc函数
app.use((req, res, next) =>{
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    // err的值，可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = function (err, status = 1) {
      res.send({
        status,
        message: err instanceof Error ? err.message : err,
      })
    }
    next()
})

// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)



// 错误中间件
app.use( (err, req, res, next) =>{
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 未知错误
  res.cc(err)
})

// 启动服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})
