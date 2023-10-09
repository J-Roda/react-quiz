import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

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

function App() {
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

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const res = await fetch("http://localhost:8000/questions");

                if (!res.ok) throw new Error("No questions been fetch");

                const data = await res.json();

                dispatch({ type: "dataReceived", payload: data });
            } catch (err) {
                dispatch({ type: "dataFailed" });
            }
        }
        fetchQuestions();
    }, []);

    return (
        <div className="app">
            <Header />
            <Main>
                {status === "loading" && <Loader />}

                {status === "error" && <Error />}

                {status === "ready" && (
                    <StartScreen
                        numQuestions={numQuestions}
                        dispatch={dispatch}
                    />
                )}

                {status === "active" && (
                    <>
                        <Progress
                            index={index}
                            numQuestions={numQuestions}
                            points={points}
                            maxPosiblePoints={maxPosiblePoints}
                            answer={answer}
                        />
                        <Question
                            question={questions[index]}
                            dispatch={dispatch}
                            answer={answer}
                        />
                        <Footer>
                            <Timer
                                dispatch={dispatch}
                                secondsRemaining={secondsRemaining}
                            />
                            <NextButton
                                dispatch={dispatch}
                                answer={answer}
                                numQuestions={numQuestions}
                                index={index}
                            />
                        </Footer>
                    </>
                )}
                {status === "finished" && (
                    <FinishScreen
                        points={points}
                        maxPossiblePoints={maxPosiblePoints}
                        dispatch={dispatch}
                        highScore={highScore}
                    />
                )}
            </Main>
        </div>
    );
}

export default App;
