import {assign, createMachine} from 'xstate'
import {calculateWinner} from "./index";

type GameMachineEvents =
    | { type: 'JUMP_TO_STEP'; step: number }
    | { type: 'MARK_SQUARE'; squareIndex: number }

export const gameMachine = createMachine({
        id: 'gameMachine',
        tsTypes: {} as import('./gameMachine.typegen').Typegen0,
        schema: {
            events: {} as GameMachineEvents,
        },
        initial: 'Playing',
        states: {
            Playing: {
                on: {
                    MARK_SQUARE: {
                        actions: 'updateSquares',
                    },
                    JUMP_TO_STEP: {
                        actions: 'jumpToStep',
                    }
                }
            },
            Finished: {},
        },
        context: {
            history: [{squares: Array<string>(9)}],
            xIsNext: true,
            stepNumber: 0,
        },
    },
    {
        actions: {
            updateSquares: assign((ctx, event) => {
                const history = ctx.history.slice(0, ctx.stepNumber + 1)
                const current = history[history.length - 1]
                const squares = current.squares.slice()

                if (calculateWinner(squares) || squares[event['squareIndex']]) {
                    return {}
                }
                squares[event['squareIndex']] = ctx.xIsNext ? 'X' : 'O'
                return {
                    history: history.concat([
                        {
                            squares: squares
                        }
                    ]),
                    stepNumber: history.length,
                    xIsNext: !ctx.xIsNext,
                }
            }),
            jumpToStep: assign((ctx, event) => ({
                stepNumber: event['step'],
                xIsNext: event['step'] % 2 === 0
            }))
        },
    }
)
