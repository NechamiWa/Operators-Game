let userEmail = '';

function getUserName() {
    fetch('http://localhost:3000/user', { method: 'GET' })
        .then(res => res.json())
        .then(user => {
            document.getElementById('userName').innerText = `Hi ${user.fname}`;
            userEmail = user.email;
            getUserScores();
        })
}

function getUserScores() {

    fetch(`http://localhost:3000/scores?email=${userEmail}`, { method: 'GET' })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error Status: ${res.status}`)
            }
            return res.json();
        })
        .then(uScore => {
            const scoresArr = uScore.scores;
            const userScoresElement = document.getElementById('userScores');
            // הצגת הנקודות
            userScoresElement.innerHTML = `<h3>Your Scores:</h3>`;
            scoresArr.forEach((score, index) => {
                userScoresElement.innerHTML += `<div><p>Game ${index + 1} : ${score} points</p></div>`;
            });
        });
}

getUserName();