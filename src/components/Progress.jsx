import { useQuizContext } from "../hooks/useQuizContext";

const Progress = () => {
    const { index, points, answer, numQuestions, maxPosiblePoints } =
        useQuizContext();
    return (
        <header className="progress">
            <progress
                max={numQuestions}
                value={index + Number(answer !== null)}
            />
            <p>
                Question <strong>{index + 1}</strong> / {numQuestions}
            </p>
            <p>
                <strong>{points}</strong> / {maxPosiblePoints}
            </p>
        </header>
    );
};

export default Progress;
