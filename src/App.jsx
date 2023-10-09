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
import { useQuizContext } from "./hooks/useQuizContext";

function App() {
    const { status, dispatch } = useQuizContext();

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

                {status === "ready" && <StartScreen />}

                {status === "active" && (
                    <>
                        <Progress />
                        <Question />
                        <Footer>
                            <Timer />
                            <NextButton />
                        </Footer>
                    </>
                )}
                {status === "finished" && <FinishScreen />}
            </Main>
        </div>
    );
}

export default App;
