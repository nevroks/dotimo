import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { CubeType } from "./types";


type BoardContextType = {
    selectedCube: null | CubeType
    setFirstCubeState: Dispatch<SetStateAction<CubeType>>
    setSecondCubeState: Dispatch<SetStateAction<CubeType>>
}

export const BoardContext = createContext<BoardContextType | null>(null)

export const useBoardContext = () => {
    const context = useContext(BoardContext)
    if (!context) {
        throw new Error("Board.* shouldn't be used outside parent board component")
    }
    return context
}