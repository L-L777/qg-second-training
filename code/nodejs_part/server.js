const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path=require('path')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const multer = require('multer');
const app = express();
const port = 3000;
//链接mysql数据库
const mysql = require('mysql');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const encodedFileName = encodeURIComponent(file.originalname);
        cb(null, encodedFileName);
    }
});

const upload = multer({ storage: storage });
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'qg'
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

app.use('/image', express.static('../image'));
app.use('/uploads', express.static('uploads'));
app.use(express.static('../user'));
app.use(express.static('../manager'));
app.use('/font_4510220_rhz4kf202zg',express.static('../font_4510220_rhz4kf202zg'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:3000' // 允许来自该源的请求
}));
// 使用express-session中间件
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));


// 登录注册页面
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../login/index.html');
    res.sendFile(filePath);
});

// 登录
app.post('/', (req, res,next) => {
    const { username, password } = req.body;
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
        if (error) {
            res.status(500).send('Error');
        } else {
            if (results.length > 0) {
                const manager = results[0].manager
                // console.log(manager);
                const token = jwt.sign({ username: username, manager: manager }, 'secret_key', { expiresIn: '1h' });
                res.locals.token = token; // 使用 res.locals 存储 token 数据
                res.locals.username = username; // 使用 res.locals 存储 username 数据
                req.session.token = token
                // console.log(req.session.token);
                req.session.username = username
                res.json({ token, manager });
            } else {
                res.status(401).send('Invalid username or password');
            }
        }
        // next()
    });
   
});
// 注册
app.post('/register',(req,res)=>{
    const {username,password}=req.body;
    connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) {
            res.status(500).send('Error');
        } else {
            if (results.length > 0) {
                res.json('用户名重复，请重新注册');
            } else {
                const sqlstr = 'insert into users (username,password) values (?,?)';
                connection.query(sqlstr, [username, password], (error, results) => {
                    if (error) {
                        res.status(500).send('Error');
                    } else {
                        res.json('Register successfully');
                    }
                    // next()
                });
            }
        }
    });
    
})


const verifyToken = (req, res, next) => {
    // const token = req.token
    // const token = res.locals.token; 

    const token = req.session.token
    // const token = req.headers['authorization'].split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    });
};

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    });
};
app.use('/api', authenticateToken);
// 普通用户页面
app.get('/user',  (req, res) => {
    const filePath = path.join(__dirname, '../user/user.html');
        res.sendFile(filePath);
    // const { username } = req.query;
    // if (req.user.manager === 0) {
    //     const filePath = path.join(__dirname, '../user/user.html');
    //     res.sendFile(filePath);
    // } else {
    //     res.status(403).send('Unauthorized');
    // }
});
// 管理员页面
app.get('/manager', (req, res) => {
    const filePath = path.join(__dirname, '../manager/manager.html');
    res.sendFile(filePath);
    // const { username } = req.query;
    // if (req.user.manager === 1) {
    //     const filePath = path.join(__dirname, '../manager/manager.html');
    //     res.sendFile(filePath);
    // } else {
    //     res.status(403).send('Unauthorized');
    // }
});

// 获取用户名信息
app.get('/api/username',  (req, res) => {
    res.json(req.user)
})
// 上传会议纪要
app.post('/api/meeting',  upload.fields([{ name: 'pic', maxCount: 1 }]), (req, res) => {
    const username = req.user.username;
    const group = req.body.group;
    const time = req.body.time;
    const theme = req.body.theme;
    const content = req.body.content;
    const kind = req.body.kind;
    const sign = req.body.sign.split(',');

    const picFile = req.files['pic'][0];
    const txtFile = req.body.txt;

    // 插入数据到MySQL数据库
    const query = 'INSERT INTO meeting (username, `group`, time, theme, content, pic, txt, kind, sign) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [username, group, time, theme, content, picFile.path, txtFile, kind, sign.join(',')], (err, result) => {
        if (err) {
            console.error('Error inserting data: ' + err);
            res.status(500).json('Error inserting data');
        } else {
            res.json('submited successfully');
        }
    });
})
// 查看会议纪要
app.get('/api/meeting',  (req, res) => {
    connection.query('SELECT * FROM meeting ORDER BY status ASC ,time DESC', (error, results) => {
        if (error) {
            res.status(500).send('Error');
        } else {
            const responseData={user:req.user,data:results}
           res.json(responseData)
        }
    });
})
// 修改会议纪要
app.post('/api/change',(req,res)=>{
   const id=req.body.id
    const theme=req.body.theme
    const content=req.body.content
    const username=req.body.username
    const time= req.body.time
    const sqlstr = 'update meeting set theme=?, content=? where id=? limit 1';
    connection.query(sqlstr, [theme,content, id], (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            const otherSqlstr = 'update meeting_ask set theme=?, content=? where username=? and time=? ';
            connection.query(otherSqlstr, [theme,content,username,time], (error, results) => {
                if (error) {
                   return;
                } 
            });
            res.json('Data updated successfully');
        }
    });
})
// 删除纪要
app.post('/api/delete', (req, res) => {
    const id = req.body.id
    const sqlstr = 'Delete from meeting where id=? limit 1';
    connection.query(sqlstr, [ id], (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            
            res.json('Data deleted successfully');
        }
    });
})
// 提出疑问
app.post('/api/ask', (req, res) => {
   const askusername=req.user.username
   const {username,group,time,theme,content,pic,txt,kind,sign,question}=req.body
    const sqlstr = 'insert into meeting_ask (username,`group`,`time`,theme,content,pic,txt,kind,sign,askusername,question) values (?,?,?,?,?,?,?,?,?,?,?)';
    connection.query(sqlstr, [username, group, time, theme, content, pic, txt, kind, sign, askusername, question], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            res.json('Data updated successfully');
        }
    });
})

// 理由
app.post('/api/reason', (req, res) => {
    const id = req.body.id
    const reason=req.body.reason
    const agree=req.body.agree
    const sqlstr = 'update meeting set status=?, reason=?, agree=? where id=? limit 1';
    connection.query(sqlstr, [1,reason,agree,id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            res.json('checked successfully ');
        }
    });
})

// 疑问反馈
app.get('/api/deal', (req, res) => {
    connection.query('SELECT * FROM meeting_ask ORDER BY status ASC;', (error, results) => {
        if (error) {
            res.status(500).send('Error');
        } else {
            const responseData = { user: req.user, data: results }
            res.json(responseData)
        }
    });
})
// 反馈
app.post('/api/deal', (req, res) => {
    const {id,answer}=req.body
    const sqlstr = 'update meeting_ask set status=?, answer=? where id=? limit 1';
    connection.query(sqlstr, [1, answer, id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            res.json('submited successfully ');
        }
    });
})
// 修改密码
app.post('/api/password', (req, res) => {
    const { password,username } = req.body
    const sqlstr = 'update users set password=? where username=? limit 1';
    connection.query(sqlstr, [password,username], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            res.json('submited successfully ');
        }
    });
})
// 个人中心的查看纪要
app.get('/api/person', (req, res) => {
    const username  = req.user.username
    connection.query('SELECT * FROM meeting where username=? ORDER BY status ASC ,time DESC',[username], (error, results) => {
        if (error) {
            res.status(500).send('Error');
        } else {
            const responseData = { user: req.user, data: results }
            res.json(responseData)
        }
    });
})
// 轮播图
app.get('/api/scroll', (req, res) => {
    connection.query('SELECT * FROM meeting  ORDER BY status DESC ,time DESC', (error, results) => {
        if (error) {
            res.status(500).send('Error');
        } else {
            const responseData = { user: req.user, data: results }
            res.json(responseData)
        }
    });
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});