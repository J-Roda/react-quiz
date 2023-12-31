import { useQuizContext } from "../hooks/useQuizContext";

const Options = () => {
    const { questions, dispatch, answer, index: quizIndex } = useQuizContext();
    const hasAnswered = answer !== null;

    return (
        <div className="options">
            {questions[quizIndex].options.map((option, index) => (
                <button
                    className={`btn btn-option ${
                        index === answer ? "answer" : ""
                    } ${
                        hasAnswered
                            ? index === questions[quizIndex].correctOption
                                ? "correct"
                                : "wrong"
                            : ""
                    }`}
                    key={option}
                    disabled={hasAnswered}
                    onClick={() =>
                        dispatch({ type: "newAnswer", payload: index })
                    }
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default Options;
