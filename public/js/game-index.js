// הגדרת מערך של אופרטורים
const operatorsArr = ['+', '-'];

// אתחול מערכים ואובייקטים לדטה של המשחק 
let chosenOperators = [];
let userOperators = [];
let game = {};
game.score = 0;
let scoreElement = document.getElementById("score");

// פונקציה לקבלת מספר אקראי
function getRandom(min, max) {
    return Math.floor(Math.random() * (max + 1)) + min;
}

// operatorsArrפונקציה לקבלת אופרטור אקראי מ
function getRandomOperator() {
    let rndIndx = getRandom(0, 1);
    return operatorsArr[rndIndx];
}

// פונקציה לקבלת מספר אקראי בין 1-9
function getRandomNumber() {
    return getRandom(1, 9);
}

// פונקציה ליצירת תרגיל מתמטיקה חדש
function mathExercise() {
    chosenOperators = [];
    game.num1 = getRandomNumber();
    game.num2 = getRandomNumber();
    game.num3 = getRandomNumber();
    chosenOperators[0] = getRandomOperator();
    chosenOperators[1] = getRandomOperator();
    expression = `${game.num1} ${chosenOperators[0]} ${game.num2} ${chosenOperators[1]} ${game.num3}`;
    game.result = eval(expression);
}

// פונקציה ליצירת אזור התרגיל ולהצגת התרגיל הנוכחי
function createExerciseArea() {
    let exerciseArea = document.createElement("div");
    exerciseArea.className = "exerciseArea";
    exerciseArea.textContent = `${game.num1}\u00A0\u00A0\u00A0\u00A0\u00A0${game.num2}\u00A0\u00A0\u00A0\u00A0\u00A0${game.num3} = ${game.result}`;
    let wrapper = document.getElementsByClassName("wrapper")[0];
    wrapper.appendChild(exerciseArea);
}

// פונקציה ליצירת אזור השחקן
function createPlayerArea() {
    let playerArea = document.createElement("div");
    playerArea.className = "playerArea";
    let wrapper = document.getElementsByClassName("wrapper")[0];
    wrapper.appendChild(playerArea);
}

// פונקציה לעדכון הניקוד המוצד על המסך
function updateScore() {
    scoreElement.textContent = game.score;
}

// פונקציה ליצירת כפתורי האופרטורים
function createOperatorButton(operator) {
    let operatorButton = document.createElement("div");
    operatorButton.className = "operatorButton";
    operatorButton.id = operatorsArr[0] == operator ? "+" : "-";
    operatorButton.textContent = operator;
    operatorButton.addEventListener('click', onOperatorClick)
    let playerArea = document.getElementsByClassName("playerArea")[0];
    playerArea.appendChild(operatorButton);
}

// פונקציה שמופעלת כאשר לוחצים על כפתור האופרטור
function onOperatorClick(e) {
    let pressAudio = new Audio("../sounds/on-press.mp3");
    pressAudio.play();
    let operatorBtn = e.target;
    let operator = operatorBtn.id;
    if (userOperators.length < 2) {
        userOperators.push(operator);
    }
    if (userOperators.length == 2) {
        if (userOperators[0] == chosenOperators[0] && userOperators[1] == chosenOperators[1]) {
            let successAudio = new Audio("../sounds/success.mp3");
            successAudio.play();
            game.score++;
            updateScore();
            // console.log(game.score);
        }
        else {
            let failureAudio = new Audio("../sounds/failure.mp3");
            failureAudio.play();

        }
        userOperators = [];
        if (userOperators.length === 0) {
            mathExercise();
            createExerciseArea();
        }
    }

}

function onFinishClick() {
    let userEmail;
    fetch('http://localhost:3000/user', { method: 'GET' })
        .then(res => res.json())
        .then(user => {
            userEmail = user.email
            const scores = game.score;
            fetch('http://localhost:3000/scores', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userEmail, scores })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    //window.location.href = '../html/game-start.html';
                    //window.location.replace('../game-start.html');
                })
        })

}

mathExercise();
createExerciseArea();
createPlayerArea();
createOperatorButton('+');
createOperatorButton('-');
updateScore();