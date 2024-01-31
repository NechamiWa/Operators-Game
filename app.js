const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let logged_user = {};

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'public', './html/home-page.html'));

})

app.post('/sign-up', (req, res) => {
    console.log(req.body);
    const usersFilePath = path.join(__dirname, 'DB', 'users.json');
    const scoresFilePath = path.join(__dirname, 'DB', 'scores.json');

    try {
        // קריאת תוכן קובץ המשתמשים או איתחול מערך ריק אם הקובץ ריק
        const usersFileContent = fs.readFileSync(usersFilePath, 'utf-8');
        const usersArr = usersFileContent ? JSON.parse(usersFileContent) : [];

        // בדיקה אם משתמש עם אותו אימייל כבר קיים
        if (!usersArr.find(u => req.body.email === u.email)) {
            usersArr.push(req.body);
            logged_user = req.body;
            // כתיבת המערך המעודכן חזרה לקובץ
            fs.writeFile(usersFilePath, JSON.stringify(usersArr), (err) => {
                if (err) {
                    console.log(err);
                    process.exit(1);
                }
                console.log('success write to users file!', `user: ${JSON.stringify(req.body)}`);

                // קריאת תוכן קובץ הניקוד או איתחול מערך ריק אם הקובץ ריק
                const scoresFileContent = fs.readFileSync(scoresFilePath, 'utf-8');
                const scoresArr = scoresFileContent ? JSON.parse(scoresFileContent) : [];
                scoresArr.push({ user: req.body.email, scores: [] });

                // כתיבת המערך המעודכן חזרה לקובץ
                fs.writeFile(scoresFilePath, JSON.stringify(scoresArr), (err) => {
                    if (err) {
                        console.log(err);
                        process.exit(1);
                    }
                    console.log('success write to scores file!');
                    res.redirect('/html/game-index.html');
                });

            });

        } else {
            res.status(400).send('User with the same email already exists.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/log-in', (req, res) => {
    const usersFilePath = path.join(__dirname, 'DB', 'users.json');

    try {
        // קריאת תוכן הקובץ או אתחול מערך ריק אם הקובץ ריק
        const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
        const usersArr = fileContent ? JSON.parse(fileContent) : [];

        // בדיקה אם המשתמש עם האימייל שסופק קיים
        const user = usersArr.find(u => req.body.email === u.email);
        if (user) {
            // logged_userעדכון פרטי ה
            logged_user = user;

            // הפניית המשתמש לדף המשחק
            res.redirect('/html/game-start.html');
        } else {
            res.status(401).send('Invalid email or user not found.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/user', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(logged_user));
})

app.get('/scores', (req, res) => {
    const scoresFilePath = path.join(__dirname, 'DB', 'scores.json');
    const scoresFileContent = fs.readFileSync(scoresFilePath, 'utf-8');
    const scoresArr = scoresFileContent ? JSON.parse(scoresFileContent) : [];

    const userScores = scoresArr.find(u => u.user === logged_user.email);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(userScores));
})

app.post('/scores', (req, res) => {
    const userScores = req.body.scores;
    const userEmail = req.body.userEmail;

    const scoresFilePath = path.join(__dirname, 'DB', 'scores.json');
    const scoresFileContent = fs.readFileSync(scoresFilePath, 'utf-8');
    const scoresArr = scoresFileContent ? JSON.parse(scoresFileContent) : [];

    const userIndex = scoresArr.findIndex(u => userEmail === u.user);
    if (userIndex !== -1) {
        scoresArr[userIndex].scores.push(userScores);
        fs.writeFile(scoresFilePath, JSON.stringify(scoresArr), (err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.send({
                    message: "Success!!"
                });
                res.sendFile(path.join(__dirname, 'public', './html/game-start.html'))
            }
        });
    } else {
        res.status(404).send('User not found in scores.');
    }
})

app.all('*',(req,res)=>{
    res.status(404).send("OOPS:( this page is not exist");
})

app.listen(port, () => {
    console.log(`app is listening on port ${port}... `);
    console.log(`http://localhost:${port}/`)
})