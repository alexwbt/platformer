import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    position: fixed;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 50vh;
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
    display: block;
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
    display: inline-block;
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
    :last-child {
        float: right;
        background-color: #565;
        :hover {
            background-color: #898;
        }
    }
`;

const GunItem = ({ item, index, game, socket }) => {
    const display = useRef();

    useEffect(() => {
        if (display.current) {
            display.current.width = 33 * 5;
            display.current.height = 17 * 5;
            const ctx = display.current.getContext('2d');
            const sWidth = 33;
            const sHeight = 17;
            const sx = (index % 4) * sWidth;
            const sy = Math.floor(index / 4) * sHeight;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(game.sprites[2], sx, sy, sWidth, sHeight,
                0, 0, display.current.width, display.current.height);
        }
    }, [display, index, game]);

    const buyWeapon = useCallback(() => {
        socket.emit('player-buy-weapon', index);
    }, [index, socket]);

    const buyAmmo = useCallback(() => {
        socket.emit('player-buy-ammo', index);
    }, [index, socket]);

    return <Item>
        <div><Display ref={display}></Display></div>
        <Right>
            <Name>{item.name}</Name>
            <Button onClick={buyWeapon}>Buy(${item.price})</Button>
            <Button onClick={buyAmmo}>Buy Ammo(${item.ammoPrice})</Button>
        </Right>
    </Item>;
};

const HealItem = ({ game, socket }) => {
    const display = useRef();

    useEffect(() => {
        if (display.current) {
            display.current.width = 15 * 5;
            display.current.height = 15 * 5;
            const ctx = display.current.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(game.sprites[5], 0, 0, 15, 15,
                0, 0, display.current.width, display.current.height);
        }
    }, [display, game]);

    const butHeal = useCallback(() => {
        socket.emit('player-buy-heal');
    }, [socket]);

    return <Item>
        <div><Display ref={display}></Display></div>
        <Right>
            <Name>Healing Potion</Name>
            <Button onClick={butHeal}>Buy($10)</Button>
        </Right>
    </Item>;
};

const GunShop = ({ game, socket }) => {
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
        <HealItem game={game} socket={socket} />
        {window.weaponInfo.map((info, i) => <GunItem item={info} key={i} index={i} game={game} socket={socket} />)}
    </Container>;
};

export default GunShop;
