import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const { REACT_APP_GAME_SERVER } = process.env;

const FixedCanvas = styled.canvas`
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
`;

const Canvas = () => {
    const canvas = useRef();

    useEffect(() => {
        window.game.setCanvas(canvas.current, [
            `${REACT_APP_GAME_SERVER}/resource/sprite1.png`,
            `${REACT_APP_GAME_SERVER}/resource/sprite2.png`,
            `${REACT_APP_GAME_SERVER}/resource/sprite3.png`,
            `${REACT_APP_GAME_SERVER}/resource/ammo-icon.png`,
            `${REACT_APP_GAME_SERVER}/resource/coin-icon.png`,
        ]);
    }, [canvas]);

    return <FixedCanvas ref={canvas} />;
};

export default Canvas;
