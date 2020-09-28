import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    position: fixed;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    width: 50vw;
    height: 50vw;
    padding: 20px;
    background-color: #333;
    color: white;
    font-family: monospace;
    overflow: auto;
    user-select: none;
`;

const Item = styled.div`
    border: 1px solid white;
    margin: 10px;
    display: flex;
`;

const Display = styled.canvas`
    display: inline-block;
`;

const Right = styled.div`
    display: inline-block;
    vertical-align: top;
    padding: 10px;
    flex: 1;
`;

const Name = styled.div`
    font-size: 20px;
`;

const Button = styled.div`
    font-size: 18px;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: #595;
    text-align: center;
    margin-top: 10px;
    cursor: pointer;
    :hover {
        background-color: #898;
    }
`;

const ItemComp = ({ item, index }) => {
    const display = useRef();

    useEffect(() => {
        if (display.current) {
            display.current.width = 330;
            display.current.height = 170;
            const ctx = display.current.getContext('2d');
            const sWidth = 33;
            const sHeight = 17;
            const sx = (index % 4) * sWidth;
            const sy = Math.floor(index / 4) * sHeight;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(window.game.sprites[2], sx, sy, sWidth, sHeight,
                0, 0, display.current.width, display.current.height);
        }
    }, [display, index]);

    const buyWeapon = useCallback(() => {
        window.socket.emit('player-buy-weapon', index);
    }, [index]);

    const buyAmmo = useCallback(() => {
        window.socket.emit('player-buy-ammo', index);
    }, [index]);

    return <Item>
        <Display ref={display}></Display>
        <Right>
            <Name>{item.name}</Name>
            <Button onClick={buyWeapon}>Buy(${item.price})</Button>
            <Button onClick={buyAmmo}>Buy Ammo(${item.ammoPrice})</Button>
        </Right>
    </Item>;
};

const GunShop = () => {
    const [show, setShow] = useState(true);
    const ref = useRef();

    useEffect(() => {
        if (ref.current) {
            const toggleShow = e => {
                if (e.key.toLowerCase() === 'b')
                    setShow(show => window.stopListening = !show);
            };
            window.addEventListener('keydown', toggleShow);
            setShow(false);
            return () => {
                window.removeEventListener('keydown', toggleShow);
            };
        }
    }, [ref]);

    return show && <Container ref={ref}>
        {window.weaponInfo.map((info, i) => <ItemComp item={info} key={i} index={i} />)}
    </Container>;
};

export default GunShop;
