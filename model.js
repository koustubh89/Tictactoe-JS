var turn = undefined;
var allPositions = [];
var crossPositions = [];
var roundPositions = [];

function Game () {
    var placedSign = [];

    var clearGame = function() {

    }

    var paintBox = function (element, char) {
        document.getElementById(element).innerHTML = char;
    }

    var resetGame = function() {
        console.log('reset game');
        allPositions = [];
        crossPositions = [];
        roundPositions = [];
        let innerBoxes = document.getElementsByClassName('box');
        for(var i = 0; i< innerBoxes.length; i++) {
            console.log('box', innerBoxes[i]);
            let id = innerBoxes[i].id;
            paintBox(id, null); 
        };
    }

    var changeTurn = function() {
        turn = !turn;
    }
    
    var placeSign = function() {
        changeTurn();
    }

    var evaluate = function() {
        console.log('evaluate');
        let crossLength = crossPositions.length;
        let roundLength = roundPositions.length;
        if (crossLength > 2) {
            var columnNames = [];
            var rowNames = [];
            var signEvaluated = undefined;

            if (turn) {
                signEvaluated = crossPositions;
            } else {
                signEvaluated = roundPositions;                
            }
            //iterate through object keys
            Object.keys(signEvaluated).forEach(function(key) {
                //get the value of column
                var col = signEvaluated[key]["column"];
                var row = signEvaluated[key]["row"];
                
                //push the string in the array
                columnNames.push(col);
                rowNames.push(row);
            });
            console.log(columnNames, rowNames);

            function count(array_elements) {
                array_elements.sort();
                var current = null;
                var cnt = 0;
                let flag = false; 
                for (var i = 0; i < array_elements.length; i++) {
                    if (array_elements[i] != current) {
                        current = array_elements[i];
                        cnt = 1;
                    } else {
                        cnt++;
                        if (cnt == 3 ) {
                            flag = true;
                        }
                    }
                }
                return flag;
            }

            function diagonalWin() {
                function finder(obj) {
                    return obj.row == obj 
                }
                
                var firstDiagonal = signEvaluated.find(x => x.row == 'a' && x.column == 1) && signEvaluated.find(x => x.row == 'b' && x.column == 2) && signEvaluated.find(x => x.row == 'c' && x.column == 3);
                var secondDiagonal = signEvaluated.find(x => x.row == 'a' && x.column == 3) && signEvaluated.find(x => x.row == 'b' && x.column == 2) && signEvaluated.find(x => x.row == 'c' && x.column == 1);
                if (firstDiagonal || secondDiagonal) {
                    return true;
                } else {
                    return false;
                }
            }
            var rowSame = count(rowNames);
            var columnSame = count(columnNames);

            console.log('row = ', rowSame, 'col = ', columnSame );
            if (rowSame || columnSame || diagonalWin()) {
                let winningSign = undefined;
                if (turn) {
                    winningSign = 'X';
                } else {
                    winningSign = 'O';                 
                }
                var restart = confirm(winningSign + ' Wins');
                if (restart ) {
                    resetGame();
                }
            } else if(rowNames.length + columnNames.length === 9) {
                var restart = confirm('Game draw');
                if (restart ) {
                    resetGame();
                }
            }
        }
        placeSign();
    }

    var markPositionAsUsed = function(position) {
        console.log('marking sign', position);
        let target = position.row + position.column;
        if (turn) {
            document.getElementById(target).innerHTML = 'X';
        } else {
            paintBox(target, 'O');      
        }
        evaluate();
    }

    return {
        pushCross: function(positionObj) {
            crossPositions.push(positionObj);
            console.log('crossPositions -> ', crossPositions);
            markPositionAsUsed(positionObj);
        },
        pushRound: function(positionObj) {
            roundPositions.push(positionObj);
            console.log('roundPositions -> ', roundPositions);            
            markPositionAsUsed(positionObj);
        }
    }
}

function turnTypeChanged() {
    console.log("we rock");
    let cross = document.getElementById('cross').checked;
    let round = document.getElementById('round').checked;
    if (cross) {
        turn = true;
    } else if(round) {
        turn = false;
    }
}

function boxClick(rowIdentifier, columnIdentifier) {
    var boxIdentifier = {row: rowIdentifier, column: columnIdentifier};
    var newGame = new Game();
    console.log(boxIdentifier);

    var alreadyPresent = allPositions.find(x => x.row == boxIdentifier.row && x.column == boxIdentifier.column)

    if (!alreadyPresent) {
        allPositions.push(boxIdentifier);
        if (turn) {
            newGame.pushCross(boxIdentifier);
        } else {
            newGame.pushRound(boxIdentifier);
        }
    }
}