import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {useMachine} from "@xstate/react";
import {gameMachine} from './gameMachine'

type SquareProps = {
    value: string
    onClick: () => void
}

function Square(props: SquareProps) {
    return (
        <button
            className={"square"}
            onClick={props.onClick}>
            {props.value}
        </button>
    )
}

type BoardProps = {
    squares: Array<string>
    onClick: (i: number) => void
}

class Board extends React.Component <BoardProps> {
    renderSquare(i: number) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

export function Game() {
    const [state, send] = useMachine(gameMachine);

    function handleClick(i: number) {
        send({type: 'MARK_SQUARE', squareIndex: i})
    }

    const history = state.context.history
    const current = history[state.context.stepNumber]
    const winner = calculateWinner(current.squares.slice())

    const moves = history.map((step, move) => {
        const desc = move ? 'Go to move #' + move : 'Go to start of the game';
        return (
            <li>
                key = {move}
                <button
                    onClick={() => send({type: 'JUMP_TO_STEP', step: move})}>{desc}
                </button>
            </li>
        )
    })

    let status: string
    if (winner) {
        status = `Winner: ${winner}`
    } else {
        status = `Next player: ${state.context.xIsNext ? 'X' : 'O'}`
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

// ==========================================================
ReactDOM.render(
    <Game/>,
    document.getElementById('root')
)
// ==========================================================

export function calculateWinner(squares: string[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}