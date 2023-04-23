const mysql = require('mysql');
// 创建连接池
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'my_db_01'
});

// 定义数据库操作的方法，导出，方便后续操作
// error:数据库操作错误；result：数据库操作成功后返回的结果
function excute(sqlString, condition) {
    return new Promise((res, rej) => {
        pool.query(sqlString, condition, function (error, result, fields) {
            if (error) {
                rej(error);
            }
            else {
                res(result);
            }
        })
    })
}

//测试能否正常工作 仅供测试
pool.query('select 1',(err,results)=>{

    if(err) return console.log(err.message);

    console.log(results);
})

module.exports = {
    EXCUTE: excute
}