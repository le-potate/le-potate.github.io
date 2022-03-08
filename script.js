const NUMBER_OF_GUESSES = 8;
let guessnumber = 0;
let retrieveguesses = window.localStorage.getItem("guesses");
let retrievestats = window.localStorage.getItem("stats");
let streak =  window.localStorage.getItem("streak");
let best_streak  =  window.localStorage.getItem("best_streak");
let day_number = 1
let solved = window.localStorage.getItem("solved");

//window.localStorage.removeItem("guesses")
//window.localStorage.removeItem("solved")

let guesses = [];
let emojis = [];
let stats = [0,0,0,0,0,0,0,0,0];

var request = new XMLHttpRequest();
request.open("GET", "players.json", false);
request.overrideMimeType("application/json");
request.send(null);
var players = JSON.parse(request.responseText);
var playersname = Object.keys(players)

var options = '';
for (var i = 0; i < playersname.length; i++) {
    options += '<option value="' + players[playersname[i]].name + '" />';
}

document.getElementById('players').innerHTML = options;
// answer for today
let answer = players["alex galchenyuk"]


if (retrieveguesses == null) {
    window.localStorage.setItem("guesses", JSON.stringify(guesses))
} else {
    try {
        guesses = JSON.parse(retrieveguesses);
    } catch(e) {
    }
}

if (retrievestats == null) {
    window.localStorage.setItem("stats", JSON.stringify(stats))
} else {
    try {
        stats = JSON.parse(retrievestats);
        //stats = [0,0,1,0,0,0,0,0,2];
    } catch(e) {
    }
}

if (streak == null) {
    window.localStorage.setItem("streak", '0')
}

if (best_streak == null) {
    window.localStorage.setItem("best_streak", '0')
}

if (solved == null) {
    solved = "false"
    window.localStorage.setItem("solved", 'false')
}

let nextLetter = 0;

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES+1; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"

        let box = document.createElement("div")
        box.className = "name-box"
        row.appendChild(box)

        for (let j = 0; j < 7 ; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }

    let row = document.getElementsByClassName("letter-row")[0]
    let column_names = ["Name", "Team", "Conf", "Div", "Pos", "Ht", "Age", "#"]
    for (let j = 0; j < 8 ; j++) {
        let box = row.children[j]
        box.textContent = column_names[j]

    }
}

const toggle = document.getElementById("themetoggle");
const playerguess = document.getElementById("playerguess");
const theme = window.localStorage.getItem("theme");
const share = document.getElementById("share");
const statsmodal = document.getElementById("statsmodal");

/* checks if the theme stored in localStorage is dark
if yes apply the dark theme to the body */
if (theme === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themetoggle").checked = true;
}

// event listener stops when the change theme button is clicked
toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    if (theme === "dark") {
        window.localStorage.setItem("theme", "light");
    } else {
        window.localStorage.setItem("theme", "dark");
    }
});

playerguess.addEventListener("keypress", function(e) {
    if (e.key === 'Enter' && solved === "false") {
        let player = playerguess.value.toLowerCase()
        if(players.hasOwnProperty(player)) {
            fillRow(players[player])
            guesses.push(player)
            window.localStorage.setItem("guesses", JSON.stringify(guesses))
            playerguess.value = ""
        }
    }
});

share.addEventListener("click", () => {
    let emojis_string = 'Draisaitl #'+day_number+' '+guessnumber+'\\'+NUMBER_OF_GUESSES+'\n\n'
    for (var i=0; i < emojis.length; i++) {
        emojis_string += emojis[i]
        emojis_string += '\n'
    }
    navigator.clipboard.writeText(emojis_string);
    document.getElementById("demo").innerHTML = "Hello World";
});


function initialGuesses() {
    for (var i=0; i < guesses.length; i++) {
        fillRow(players[guesses[i]])
    }
}

function fillRow (attributes) {
    let row = document.getElementsByClassName("letter-row")[guessnumber+1]

    let emoji_string = ''

    let found_answer = true

    // name column
    row.children[0].textContent = attributes.name
    if (attributes.name === answer.name) {
        row.children[0].style.backgroundColor = '#6aaa64'
        emoji_string += '🟩'
    } else {
        emoji_string += '⬛'
        found_answer = false
    }

    // team column
    row.children[1].textContent = attributes.team
    if (attributes.team === answer.team) {
        row.children[1].style.backgroundColor = '#6aaa64'
        emoji_string += '🟩'
    } else if (answer.all_teams.includes(attributes.team)) {
        row.children[1].style.backgroundColor = '#c9b458'
        emoji_string += '🟨'
        found_answer = false
    } else {
        emoji_string += '⬛'
        found_answer = false
    }


    // conference column
    row.children[2].textContent = attributes.conference
    if (attributes.conference === answer.conference) {
        row.children[2].style.backgroundColor = '#6aaa64'
        emoji_string += '🟩'
    } else if (answer.all_conferences.includes(attributes.conference)) {
        row.children[2].style.backgroundColor = '#c9b458'
        emoji_string += '🟨'
        found_answer = false
    } else {
        emoji_string += '⬛'
        found_answer = false
    }

    // division column
    row.children[3].textContent = attributes.division
    if (attributes.division === answer.division) {
        row.children[3].style.backgroundColor = '#6aaa64'
        emoji_string += '🟩'
    } else if (answer.all_divisions.includes(attributes.division)) {
        row.children[3].style.backgroundColor = '#c9b458'
        emoji_string += '🟨'
        found_answer = false
    } else {
        emoji_string += '⬛'
        found_answer = false
    }

    // position column
    row.children[4].textContent = attributes.position
    if (attributes.position === answer.position) {
        row.children[4].style.backgroundColor = '#6aaa64'
        emoji_string += '🟩'
    } else if (attributes.position_type === answer.position_type) {
        row.children[4].style.backgroundColor = '#c9b458'
        emoji_string += '🟨'
        found_answer = false
    } else {
        emoji_string += '⬛'
        found_answer = false
    }

    // height column
    row.children[5].textContent = attributes.height
    if (attributes.height_inch === answer.height_inch) {
        row.children[5].style.backgroundColor = '#6aaa64'
        emoji_string += '🟩'
    } else if (attributes.height_inch + 2 >= answer.height_inch && attributes.height_inch - 2 <= answer.height_inch) {
        row.children[5].style.backgroundColor = '#c9b458'
        emoji_string += '🟨'
        found_answer = false
    } else {
        emoji_string += '⬛'
        found_answer = false
    }

    // age column
    row.children[6].textContent = attributes.age
    if (attributes.age === answer.age) {
        row.children[6].style.backgroundColor = '#6aaa64'
        emoji_string += '🟩'
    } else if (attributes.age + 2 >= answer.age && attributes.age - 2 <= answer.age) {
        row.children[6].style.backgroundColor = '#c9b458'
        emoji_string += '🟨'
        found_answer = false
    } else {
        emoji_string += '⬛'
        found_answer = false
    }

    // number column
    row.children[7].textContent = attributes.number
    if (attributes.number === answer.number) {
        row.children[7].style.backgroundColor = '#6aaa64'
        emoji_string += '🟩'
    } else if (attributes.number + 2 >= answer.number && attributes.number - 2 <= answer.number) {
        row.children[7].style.backgroundColor = '#c9b458'
        emoji_string += '🟨'
        found_answer = false
    } else {
        emoji_string += '⬛'
        found_answer = false
    }

    emojis.push(emoji_string)

    guessnumber += 1

    if (found_answer) {
        if (solved === 'false') {
            solved = 'true'
            window.localStorage.setItem("solved", solved)
            stats[guessnumber-1] += 1
            window.localStorage.setItem("stats", JSON.stringify(stats))
            update_stats();
        }

        //statsmodal.style.opacity = 1;
        //statsmodal.style.pointerEvents = 'auto';
        document.getElementById("demo").innerHTML = "Hello ";
    }


}


function update_stats() {
    let played = stats.reduce((partialSum, a) => partialSum + a, 0);
    let wins = stats.slice(0, 7 + 1).reduce((partialSum, a) => partialSum + a, 0);
    document.getElementById("played").innerHTML = played
    if (played > 0) {
        document.getElementById("percent").innerHTML = wins / played * 100 | 0
    }
    document.getElementById("streak").innerHTML = streak
    document.getElementById("best_streak").innerHTML = best_streak
    document.getElementById("oneguess").innerHTML = stats[0]
    document.getElementById("twoguesses").innerHTML = stats[1]
    document.getElementById("threeguesses").innerHTML = stats[2]
    document.getElementById("fourguesses").innerHTML = stats[3]
    document.getElementById("fiveguesses").innerHTML = stats[4]
    document.getElementById("sixguesses").innerHTML = stats[5]
    document.getElementById("sevenguesses").innerHTML = stats[6]
    document.getElementById("eightguesses").innerHTML = stats[7]
    document.getElementById("losses").innerHTML = stats[8]
}




initBoard()
initialGuesses()
update_stats()


//fillRow(players["auston matthews"])
