import React, { useState, useRef, useEffect } from "react";
import "./DiceGame.css";

export default function DiceGame() {
    // const [playerOneScore, setPlayerOneScore] = useState(0)
    // const [playerTwoScore, setPlayerTwoScore] = useState(0)
    const [currentTurn, setCurrentTurn] = useState(1);
    const [isGameOver, setIsGameOver] = useState(false);
    const [playerOneHolding, setPlayerOneHolding] = useState(false)
    const [playerTwoHolding, setPlayerTwoHolding] = useState(false)

    const [currentPlayerValues, setCurrentPlayerValues] = useState({
        1: 0,
        2: 0,
    });

    const grabRandom = () => {
        return Math.floor(Math.random() * 6) + 1;
    };

    const updateScore = (playerId, value) => {
        setCurrentPlayerValues({
            ...currentPlayerValues,
            [playerId]: value,
        });

        console.log(`${playerId}: ${currentPlayerValues[playerId]}`);
    };

    const updateCurrentTurn = (toTurn) => {
        if(toTurn == 1 && playerOneHolding) {
            setCurrentTurn(2);
            return;
        } else if (toTurn == 2 && playerTwoHolding) {
            setCurrentTurn(1);
            return;
        }

        setCurrentTurn(toTurn);
    }

    const playerFold = (playerId) => {
        const value = grabRandom();
        const currentPlayerValue = currentPlayerValues[playerId];
        updateScore(playerId, currentPlayerValue + value);
    };

    const playerHold = (playerId) => {
        switch(playerId) {
            case 1:
                setPlayerOneHolding(true);
                updateCurrentTurn(2)
                break;
            case 2:
                setPlayerTwoHolding(true);
                updateCurrentTurn(1)
                break
        }

        updateScore(playerId, currentPlayerValues[playerId]);
    }

    useEffect(() => {
        let closestToGoal = 0; // Player closest to the goal
        let lastDifference = 9999; // Last Difference
        for (const player in currentPlayerValues) {
            if (currentPlayerValues[player] > 21) {
                console.log(`Player ${player} is bust!`);
                setIsGameOver(true);
                return;
            }

            if (playerOneHolding && playerTwoHolding) {
                const currentDifference = 21 - currentPlayerValues[player];

                // Gets the player with the closest value
                if (currentDifference < lastDifference) {
                    closestToGoal = player;
                    lastDifference = currentDifference;
                }
            }
        }

        if (playerOneHolding && playerTwoHolding) {
            setIsGameOver(true);
            console.log(`THE WINNER IS PLAYER ${closestToGoal} WITH A VALUE OF ${currentPlayerValues[closestToGoal]}`);
        }
    }, [currentPlayerValues, playerOneHolding, playerTwoHolding]);

    return (
        <div>
            <div id="dice-game-wrapper">
                <div id="left-dice-holder" className="player-side">
                    <p className="score-holder">
                        {currentPlayerValues[1]}
                    </p>
                    {currentTurn == 1 && !isGameOver && (
                        <div className="btn-holder">
                            <div className="game-btn" onClick={() => {playerHold(1);}} >
                                <p>HOLD</p>
                            </div>
                            <div onClick={() => {playerFold(1); updateCurrentTurn(2);}} className="game-btn" >
                                <p>ROLL</p>
                            </div>
                        </div>
                    )}
                </div>
                <div id="right-dice-holder" className="player-side">
                    <p className="score-holder">
                        {currentPlayerValues[2]}
                    </p>
                    {currentTurn == 2 && !isGameOver && (
                        <div className="btn-holder">
                            <div className="game-btn" onClick={() => {playerHold(2)}}>
                                <p>HOLD</p>
                            </div>
                            <div onClick={() => {playerFold(2); updateCurrentTurn(1);}} className="game-btn">
                                <p>ROLL</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
