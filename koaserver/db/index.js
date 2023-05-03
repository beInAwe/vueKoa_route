const mysql = require('mysql');
// 创建连接池
const pool = mysql.createPool({
    connectionLimit: 20,
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'my_db_01'
});


//测试能否正常工作 仅供测试
pool.query('select 1',(err,results)=>{

    if(err) return console.log(err.message);

    console.log(results);
})


// // 新增数据 username 值为spiderman  password 'pcc123'
// const user = {username:'spiderman11111' ,password :'pcc123111'}

// const sqlStr ='insert into hk_users(username ,password) value(?,?)'

// pool.query(sqlStr,[user.username,user.password],(err,results)=>{
//     if(err) return console.log(err.message);

//     //判断是否插入成功
//     if(results.affectedRows===1){
//         console.log('插入成功');
//     }
// })

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



module.exports = {
    EXCUTE: excute
}