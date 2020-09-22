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
            `${REACT_APP_GAME_SERVER}/sprite1.png`
        ]);
    }, [canvas]);

    return <FixedCanvas ref={canvas} />;
};

export default Canvas;
