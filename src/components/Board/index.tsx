import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from 'react';
import styles from './style.module.css';
import classNames from 'classnames';
import { BoardContext } from './BoardContext';
import BoardPallette from './BoardPallette';
import { BOARD_SIZE, CUBE_SIZE } from '@utils/consts';
import { generateRandomPositions, clampGroupWithDelta, applyMagnet, isInGroup } from '@utils/magnet';
import type { CubeType } from './types';


export type BoardRefType = {
    resetPositions: () => void;
};

type BoardPropsType = {
    children?: ReactNode
    onBoxesConnectChange?: (isConnected: boolean) => void
    connectMode?: boolean
    magnetMode?: boolean
}

type BoardComponentType = ForwardRefExoticComponent<
    BoardPropsType & RefAttributes<BoardRefType>
> & {
    Pallette: typeof BoardPallette;
};

const startPositions = generateRandomPositions(BOARD_SIZE);

const Board = forwardRef<BoardRefType, BoardPropsType>(
    ({ children, onBoxesConnectChange, connectMode = true, magnetMode = true }, ref) => {

        const boardRef = useRef<HTMLDivElement>(null);
        const [selectedCube, setSelectedCube] = useState<CubeType | null>(null);
        const [isConnected, setIsConnected] = useState(false);
        const [firstCubeState, setFirstCubeState] = useState<CubeType>({
            id: "1",
            color: "orange",
            position: startPositions[0]
        }
        );
        const [secondCubeState, setSecondCubeState] = useState<CubeType>({
            id: "2",
            color: "violet",
            position: startPositions[1]
        }
        );

        useImperativeHandle(ref, () => ({
            // ваще по сути лишняя запара но прикольно выглядит
            resetPositions: () => {
                const [first, second] = generateRandomPositions(BOARD_SIZE);

                setFirstCubeState(prev => ({
                    ...prev,
                    position: first
                }));

                setSecondCubeState(prev => ({
                    ...prev,
                    position: second
                }));

                setIsConnected(false);
                onBoxesConnectChange && onBoxesConnectChange(false);
            }
        }));
        useEffect(() => {
            if (!connectMode && isConnected) {
                setIsConnected(false)
                onBoxesConnectChange && onBoxesConnectChange(false);
            }
        }, [connectMode])

        const handleDragStart = (
            e: React.DragEvent<HTMLDivElement>,
            cube: CubeType
        ) => {
            setSelectedCube(cube);

            const emptyImage = new Image();
            e.dataTransfer.setDragImage(emptyImage, 0, 0);
            e.dataTransfer.effectAllowed = "move";
        };

        const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
            if (!selectedCube || !boardRef.current) return;
            if (e.clientX === 0 && e.clientY === 0) return;

            const boardRect = boardRef.current.getBoundingClientRect();

            let newX = e.clientX - boardRect.left - CUBE_SIZE / 2;
            let newY = e.clientY - boardRect.top - CUBE_SIZE / 2;

            newX = Math.max(0, Math.min(newX, boardRect.width - CUBE_SIZE));
            newY = Math.max(0, Math.min(newY, boardRect.height - CUBE_SIZE));

            const activeCube =
                selectedCube.id === "1" ? firstCubeState : secondCubeState;

            const otherCube =
                selectedCube.id === "1" ? secondCubeState : firstCubeState;


            if (isConnected) {
                let dx = newX - activeCube.position.x;
                let dy = newY - activeCube.position.y;

                const firstCubePosition = firstCubeState.position;
                const secondCubePosition = secondCubeState.position;

                const clamped = clampGroupWithDelta(dx, dy, firstCubePosition, secondCubePosition, boardRect);

                dx = clamped.dx;
                dy = clamped.dy;


                setFirstCubeState(prev => ({
                    ...prev,
                    position: {
                        x: prev.position.x + dx,
                        y: prev.position.y + dy
                    }
                }));
                setSecondCubeState(prev => ({
                    ...prev,
                    position: {
                        x: prev.position.x + dx,
                        y: prev.position.y + dy
                    }
                }));
            } else {

                let newPosition = !magnetMode ? { x: newX, y: newY } : applyMagnet({ x: newX, y: newY }, otherCube);

                if (selectedCube.id === "1") {
                    setFirstCubeState(prev => ({
                        ...prev,
                        position: newPosition
                    }));
                } else {
                    setSecondCubeState(prev => ({
                        ...prev,
                        position: newPosition
                    }));
                }
            }
        };

        const handleDragEnd = () => {
            if (!connectMode) return
            if (isInGroup(firstCubeState.position, secondCubeState.position)) {
                setIsConnected(true);
                onBoxesConnectChange && onBoxesConnectChange(true);
            }
        };
        const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
        };
        const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
        };

        return (
            <BoardContext.Provider value={{ selectedCube: selectedCube ? selectedCube.id === "1" ? firstCubeState : secondCubeState : null, setFirstCubeState, setSecondCubeState }}>
                <div className={styles['Board-wrapper']}>
                    {children}
                    <div
                        ref={boardRef}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => setSelectedCube(null)}
                        className={styles['Board']}>
                        <div
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, firstCubeState)}
                            onDrag={handleDrag}
                            onDragEnd={handleDragEnd}
                            style={{
                                transform: `translate(${firstCubeState.position.x}px, ${firstCubeState.position.y}px)`,
                            }}
                            className={classNames(styles['Board-cube'], {
                                [styles['selected']]: selectedCube?.id === "1",
                                [styles['violet']]: firstCubeState.color === "violet",
                                [styles['seal']]: firstCubeState.color === "seal",
                                [styles['orange']]: firstCubeState.color === "orange",
                            })}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCube(firstCubeState)
                            }}>
                        </div>
                        <div
                            draggable={true}
                            onDragEnd={handleDragEnd}
                            onDragStart={(e) => handleDragStart(e, secondCubeState)}
                            onDrag={handleDrag}
                            style={{
                                transform: `translate(${secondCubeState.position.x}px, ${secondCubeState.position.y}px)`,
                            }}
                            className={classNames(styles['Board-cube'], {
                                [styles['selected']]: selectedCube?.id === "2",
                                [styles['violet']]: secondCubeState.color === "violet",
                                [styles['seal']]: secondCubeState.color === "seal",
                                [styles['orange']]: secondCubeState.color === "orange",
                            }
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCube(secondCubeState)
                            }}>
                        </div>
                    </div>
                </div>
            </BoardContext.Provider>

        );
    }
) as BoardComponentType;

Board.Pallette = BoardPallette

export default Board;
