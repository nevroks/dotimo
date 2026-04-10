import { Board } from '@components';
import styles from './style.module.css'
import { useRef, useState } from 'react';
import type { BoardRefType } from '../../components/Board';

type BoardConfigType = {
    magnetModeEnabled: boolean,
    stickyModeEnabled: boolean,
}

const MainPage = () => {

    const boardRef = useRef<BoardRefType>(null);
    const [boardConfig, setBoardConfig] = useState<BoardConfigType>({
        magnetModeEnabled: true,
        stickyModeEnabled: true,
    })
    // мог бы написать здесь гетер а не копировать состояние, но гетер не будет отображать реактивное состояние, поэтьому такой вот полу-костыль
    const [isCubesConnected, setIsCubesConnected] = useState(false);

    const handleCubesDisconnect = () => {
        boardRef.current?.resetPositions();
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', }}>
            <Board
                ref={boardRef}
                onBoxesConnectChange={(isCubesConnected) => setIsCubesConnected(isCubesConnected)}
                connectMode={boardConfig.stickyModeEnabled}
                magnetMode={boardConfig.magnetModeEnabled}
            >
                <div className={styles['MainPage-board-header']}>
                    <div>
                        <div>
                            <input type="checkbox" id='stickyMode' checked={boardConfig.stickyModeEnabled} onChange={(e) => setBoardConfig({ ...boardConfig, stickyModeEnabled: e.target.checked })} />
                            <label htmlFor="stickyMode">Прилипание</label>
                        </div>
                        <div>
                            <input type="checkbox" id='magnetMode' checked={boardConfig.magnetModeEnabled} onChange={(e) => setBoardConfig({ ...boardConfig, magnetModeEnabled: e.target.checked })} />
                            <label htmlFor="magnetMode">Магнит</label>
                        </div>
                    </div>
                    <Board.Pallette />
                    {boardConfig.stickyModeEnabled && <button onClick={handleCubesDisconnect} disabled={!isCubesConnected}>кнопка отлипнуть</button>}
                </div>

            </Board>
        </div>
    );
}

export default MainPage;
