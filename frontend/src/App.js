import React, { useEffect, useState } from 'react';
import Canvas from './Canvas';
import initGame from './Game';
import GunShop from './GunShop';
import useScript from './hooks/Script';
import InitialModal from './InitialModal';

const { REACT_APP_GAME_SERVER } = process.env;

const App = () => {
    const loaded = useScript([
        `${REACT_APP_GAME_SERVER}/classes.js`,
        `${REACT_APP_GAME_SERVER}/collision.js`,
        `${REACT_APP_GAME_SERVER}/particle/index.js`,
        `${REACT_APP_GAME_SERVER}/particle/sparks.js`,
        `${REACT_APP_GAME_SERVER}/particle/fire.js`,
        `${REACT_APP_GAME_SERVER}/weapon/index.js`,
        `${REACT_APP_GAME_SERVER}/object/index.js`,
        `${REACT_APP_GAME_SERVER}/object/bullet.js`,
        `${REACT_APP_GAME_SERVER}/object/block.js`,
        `${REACT_APP_GAME_SERVER}/object/character.js`,
        `${REACT_APP_GAME_SERVER}/object/mob.js`,
        `${REACT_APP_GAME_SERVER}/object/coin.js`,
        `${REACT_APP_GAME_SERVER}/index.js`,
    ]);
    const [game, setGame] = useState();
    const [socket, setSocket] = useState();

    useEffect(() => {
        if (loaded) {
            const [game, socket] = initGame();
            setGame(game);
            setSocket(socket);
        }
    }, [loaded]);

    return loaded && game && socket ? <>
        <Canvas game={game} />
        <GunShop game={game} socket={socket} />
        <InitialModal game={game} socket={socket} />
    </> : <div></div>;
};

export default App;
