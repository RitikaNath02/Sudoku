const gameboard = document.querySelector("#gameboard");
const digits = document.querySelector("#digits");
const delnum = document.querySelector("#delete");
const mistake = document.querySelector("#mistake");
const newGameBtn = document.querySelector("#newGame");
const timerDisplay = document.querySelector("#timer");

let lastselected = null;
let error = 0;
let timer;
let timeElapsed = 0;

const puzzles = [
  {
    puzzle: [
      "8-6-1----",
      "--3-64-9-",
      "9-----816",
      "-8-396---",
      "7-2-4-3-9",
      "---572-8-",
      "521-----4",
      "-3-75-2--",
      "----2-1-5",
    ],
    solution: [
      "856917423",
      "213864597",
      "947235816",
      "185396724",
      "762148359",
      "394572681",
      "521683974",
      "439751268",
      "678429135",
    ],
  },
  {
    puzzle: [
      "--5-3----",
      "8----25--",
      "1-2----9-",
      "----58-6-",
      "6-4---5-8",
      "-9-31----",
      "-3----4-6",
      "--98----7",
      "----7-2--",
    ],
    solution: [
      "695832471",
      "847169253",
      "132547896",
      "473958162",
      "614723598",
      "298314785",
      "753281649",
      "269875317",
      "581496732",
    ],
  },
  {
    puzzle: [
      "4---8-5--",
      "---1--6-8",
      "--2-5---4",
      "-----7---",
      "-1-6-----",
      "--3-2-1--",
      "--5-8----",
      "-3--9----",
      "--4-----7",
    ],
    solution: [
      "417385962",
      "935142678",
      "862957314",
      "521476839",
      "718639425",
      "693528147",
      "174863592",
      "356291784",
      "249714356",
    ],
  },
  {
    puzzle: [
      "----7-2-6",
      "5----1---",
      "--39--7--",
      "-8----45-",
      "4---5----",
      "--1-3---7",
      "-3---8--1",
      "----9-2--",
      "7--2-6---",
    ],
    solution: [
      "841679235",
      "527341698",
      "693258741",
      "289713456",
      "476895123",
      "351426879",
      "932568417",
      "165794382",
      "718932564",
    ],
  },
  {
    puzzle: [
      "3--8-5--7",
      "--7----6-",
      "----3----",
      "-84-1----",
      "1-6---4-9",
      "----5-72-",
      "----9----",
      "-2----4--",
      "5--4-7--3",
    ],
    solution: [
      "316895427",
      "457231968",
      "829743651",
      "984612375",
      "176358249",
      "235947816",
      "742169583",
      "623578194",
      "598424731",
    ],
  },
  {
    puzzle: [
      "1---6--8-",
      "--7--9---",
      "---8----4",
      "--2-5----",
      "-8---1-5-",
      "----7-9--",
      "4----2---",
      "---3--7--",
      "-6--9---1",
    ],
    solution: [
      "195467382",
      "687329541",
      "432851967",
      "762158439",
      "984631257",
      "513742698",
      "349516872",
      "271983654",
      "856294713",
    ],
  },
  {
    puzzle: [
      "----3--1-",
      "-5---7--8",
      "---2---5-",
      "--3-6----",
      "-1-8---7-",
      "----4-2--",
      "-6---1---",
      "9--5---3-",
      "-3--9----",
    ],
    solution: [
      "867435912",
      "254917368",
      "319286754",
      "723561489",
      "615892473",
      "498347521",
      "176823945",
      "942578136",
      "531694287",
    ],
  }
];

let currentPuzzleIndex = 0;

window.onload = () => {
  populateDigits();
  newGameBtn.addEventListener("click", startNewGame);
};

function startNewGame() {
  currentPuzzleIndex = Math.floor(Math.random() * puzzles.length);
  loadPuzzle(puzzles[currentPuzzleIndex]);
  resetGame();
  startTimer();
}

function loadPuzzle(puzzleObj) {
  gameboard.innerHTML = "";
  const { puzzle, solution } = puzzleObj;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const div = document.createElement("div");
      div.classList.add("tile");
      div.addEventListener("click", selectTile);
      div.setAttribute("row", i);
      div.setAttribute("col", j);

      if (puzzle[i][j] != "-") {
        div.innerText = puzzle[i][j];
        div.classList.add("filled");
      }
      if (i == 2 || i == 5) {
        div.classList.add("border-bottom");
      }
      if (j == 2 || j == 5) {
        div.classList.add("border-right");
      }
      gameboard.appendChild(div);
    }
  }
}

function populateDigits() {
  digits.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const div = document.createElement("div");
    div.classList.add("tile");
    div.addEventListener("click", addNumber);
    div.innerText = i + 1;
    digits.appendChild(div);
  }
}

function selectTile() {
  if (lastselected != null) {
    lastselected.classList.remove("select-tile");
  }
  lastselected = this;
  lastselected.classList.add("select-tile");
}

function addNumber() {
  if (lastselected.innerText == "" || lastselected.classList.contains("danger")) {
    lastselected.innerText = this.innerText;
  }

  let row = lastselected.getAttribute("row");
  let col = lastselected.getAttribute("col");

  if (puzzles[currentPuzzleIndex].solution[row][col] == lastselected.innerText) {
    lastselected.classList.remove("danger");
  } else {
    lastselected.classList.add("danger");
    addErrorDisplay();
  }

  if (error > 2) {
    alert("You Lost!");
    location.reload();
  }

  if (allTilesFilled()) {
    const allTiles = gameboard.querySelectorAll(".tile");
    let userans = [...allTiles].map((tile) => {
      return tile.innerText;
    });
    let num = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzles[currentPuzzleIndex].solution[i][j] != userans[num]) {
          allTiles[num].classList.add("danger");
        }
        num++;
      }
    }

    let dangerclass = [...allTiles].some((tile) => {
      return tile.classList.contains("danger");
    });
    if (dangerclass) {
      if (error > 2) {
        alert("You lost");
        location.reload();
      }
    } else {
      alert("Congratulations! You win the game");
    }
  }
}

delnum.onclick = () => {
  if (!lastselected.classList.contains("filled")) {
    lastselected.innerText = "";
  }
};

function addErrorDisplay() {
  error++;
  mistake.innerText = error;
}

function allTilesFilled() {
  const allTiles = gameboard.querySelectorAll(".tile");
  return [...allTiles].every((tile) => {
    return tile.innerText != "";
  });
}

function resetGame() {
  lastselected = null;
  error = 0;
  mistake.innerText = error;
  clearInterval(timer);
  timeElapsed = 0;
  updateTimerDisplay();
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
  const seconds = String(timeElapsed % 60).padStart(2, '0');
  timerDisplay.innerText = `${minutes}:${seconds}`;
}
