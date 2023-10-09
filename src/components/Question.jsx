import { useQuizContext } from "../hooks/useQuizContext";
import Options from "./Options";

const Question = () => {
    const { questions, index } = useQuizContext();
    return (
        <div>
            <h4>{questions[index].question}</h4>
            <Options />
        </div>
    );
};

export default Question;
