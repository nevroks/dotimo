import classNames from 'classnames';
import { useBoardContext } from './BoardContext';
import styles from './style.module.css'

const BoardPallette = ({ }) => {

    const { selectedCube, setFirstCubeState, setSecondCubeState } = useBoardContext()

    return (
        <>
            {selectedCube && <div className={styles['Board-colorPalette']}>
                <div
                    className={classNames(styles['Board-colorPalette-item'], styles['orange'], {
                        [styles['current']]: selectedCube.color === "orange"
                    })}
                    onClick={() => {
                        if (selectedCube.id === "1") {
                            setFirstCubeState(prev => ({ ...prev, color: "orange" }))
                        } else {
                            setSecondCubeState(prev => ({ ...prev, color: "orange" }))
                        }
                    }}></div>

                <div
                    className={classNames(styles['Board-colorPalette-item'], styles['violet'], {
                        [styles['current']]: selectedCube.color === "violet"
                    })}
                    onClick={() => {
                        if (selectedCube.id === "1") {
                            setFirstCubeState(prev => ({ ...prev, color: "violet" }))
                        } else {
                            setSecondCubeState(prev => ({ ...prev, color: "violet" }))
                        }
                    }}
                ></div>
                <div
                    className={classNames(styles['Board-colorPalette-item'], styles['seal'], {
                        [styles['current']]: selectedCube.color === "seal"
                    })}
                    onClick={() => {
                        if (selectedCube.id === "1") {
                            setFirstCubeState(prev => ({ ...prev, color: "seal" }))
                        } else {
                            setSecondCubeState(prev => ({ ...prev, color: "seal" }))
                        }
                    }}></div>
            </div>}
        </>
    );
}

export default BoardPallette;
