import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    border: 1px solid white;
    min-width: 200px;
    text-align: center;
    max-width: 500px;
`;

const CharCanvas = styled.canvas`
    margin: 5px;
    border: 2px solid ${props => props.selected ? 'white' : '#333'};
    cursor: pointer;

    :hover {
        border: 2px solid ${props => props.selected ? 'white' : 'grey'};
    }
`;

const CharacterButton = ({ index, select, selected, image }) => {
    const canvas = useRef();

    useEffect(() => {
        if (canvas.current) {
            canvas.current.width = 50;
            canvas.current.height = 50;
            const ctx = canvas.current.getContext('2d');
            const sSize = 16;
            const sx = (index % 8) * sSize;
            const sy = Math.floor(index / 8) * sSize;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(image, sx, sy, sSize, sSize, 0, 0, 50, 50);
        }
    }, [canvas, index, image]);

    const onClick = useCallback(() => {
        select(index);
        window.socket.emit('player-char', index);
    }, [index, select]);

    return <CharCanvas ref={canvas} onClick={onClick} selected={selected} />
};

const CharacterSelect = () => {
    const [selection, setSelection] = useState(0);
    const [image, setImage] = useState(false);

    useEffect(() => {
        const image = new Image();
        image.onload = () => {
            setImage(image);
        };
        image.src = `${process.env.REACT_APP_GAME_SERVER}/resource/sprite2.png`;
    }, []);

    return <Container>
        {
            image && Array(14).fill().map((e, i) => <CharacterButton
                key={i}
                index={i}
                selected={i === selection}
                select={setSelection}
                image={image}
            />)
        }
    </Container>;
};

export default CharacterSelect;
