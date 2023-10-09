import { useContext } from "react";
import { QuizContext } from "../context/QuizContext";

export function useQuizContext() {
    const context = useContext(QuizContext);

    if (!context)
        throw new Error(
            "useQuizContext must be used inside a QuizContext Provider"
        );

    return context;
}
