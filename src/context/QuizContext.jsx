import { createContext, useReducer } from "react";

export const QuizContext = createContext();

const initialState = {
    questions: [],

    // "loading", "error", "ready", "active", "finished"
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    highScore: 0,
    secondsRemaining: null,
};

const SECS_PER_QUESTION = 30;

function reducer(state, action) {
    switch (action.type) {
        case "dataReceived":
            return {
                ...state,
                questions: action.payload,
                status: "ready",
            };
        case "dataFailed":
            return {
                ...state,
                status: "error",
            };
        case "start":
            return {
                ...state,
                status: "active",
                secondsRemaining: state.questions.length * SECS_PER_QUESTION,
            };
        case "newAnswer":
            const question = state.questions.at(state.index);
            return {
                ...state,
                answer: action.payload,
                points:
                    action.payload === question.correctOption
                        ? state.points + question.points
                        : state.points,
            };
        case "nextQuestion":
            return {
                ...state,
                index: state.index++,
                answer: null,
            };
        case "finish":
            return {
                ...state,
                status: "finished",
                highScore:
                    state.points > state.highScore
                        ? state.points
                        : state.highScore,
            };
        case "restart":
            // return {
            //     ...state,
            //     status: "ready",
            //     index: 0,
            //     answer: null,
            //     points: 0,
            // };
            return {
                ...initialState,
                questions: state.questions,
                status: "ready",
                highScore: state.highScore,
            };
        case "tick":
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status:
                    state.secondsRemaining === 0 ? "finished" : state.status,
            };
        default:
            throw new Error("Action unknown");
    }
}

export function QuizContextProvider({ children }) {
    const [
        {
            questions,
            status,
            index,
            answer,
            points,
            secondsRemaining,
            highScore,
        },
        dispatch,
    ] = useReducer(reducer, initialState);

    const numQuestions = questions.length;
    const maxPosiblePoints = questions.reduce(
        (prev, cur) => prev + cur.points,
        0
    );

    return (
        <QuizContext.Provider
            value={{
                questions,
                status,
                index,
                answer,
                points,
                secondsRemaining,
                highScore,
                numQuestions,
                maxPosiblePoints,
                dispatch,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
}
