var turn = undefined;
var allPositions = [];
var crossPositions = [];
var roundPositions = [];

document.onload(turnTypeChanged());

function Game () {
    var placedSign = [];
    let newGame = undefined;

    var paintBox = function (element, char) {
        document.getElementById(element).innerHTML = char;
    }

    var resetGame = function() {
        allPositions = [];
        crossPositions = [];
        roundPositions = [];
        let innerBoxes = document.getElementsByClassName('box');
        for(var i = 0; i< innerBoxes.length; i++) {
            let id = innerBoxes[i].id;
            paintBox(id, null); 
        };
        turnTypeChanged();
        return false;
    }

    var changeTurn = function() {
        turn = !turn;
    }

    var evaluate = function() {
        let crossLength = crossPositions.length;
        let roundLength = roundPositions.length;
        if ((turn && crossLength > 2) || (!turn && roundLength > 2)) {
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

            if (rowSame || columnSame || diagonalWin()) {
                let winningSign = undefined;
                if (turn) {
                    winningSign = 'X';
                } else {
                    winningSign = 'O';                 
                }
                newGame = true; 
                restartGame(' wins', winningSign);
            } else if(rowNames.length + columnNames.length >= 9) {
                newGame = true; 
                restartGame('Game draw', undefined);                
            }
        }
        if (!newGame) {
            changeTurn();
        }
    }

    var restartGame = function(message, winningSign) {
        let combinedMessage = undefined;
        winningSign ? combinedMessage = winningSign + message : combinedMessage = message;  
        let restart = confirm(combinedMessage);
        if (restart ) {
            resetGame();
        }
    }

    var markPositionAsUsed = function(position) {
        let target = position.row + position.column;
        if (turn) {
            paintBox(target, 'X');
        } else {
            paintBox(target, 'O');      
        }
    }

    return {
        pushCross: function(positionObj) {
            markPositionAsUsed(positionObj);
            crossPositions.push(positionObj);
            evaluate();
        },
        pushRound: function(positionObj) {
            markPositionAsUsed(positionObj);
            roundPositions.push(positionObj);
            evaluate();
        }
    }
}

function turnTypeChanged() {
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
    var newGame = new Game()

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