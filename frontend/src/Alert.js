import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    position: fixed;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: #333;
    color: white;
    font-family: monospace;
`;

const Title = styled.div`
    font-size: 25px;
    padding: 5px;
    margin-top: 10px;
    color: ${props => props.red ? 'red' : 'white'};
    text-align: center;
`;

const SubmitButton = styled.div`
    padding: 5px;
    margin-top: 10px;
    text-align: center;
    background-color: #444;
    cursor: pointer;
    font-size: 20px;
    :hover {
        background-color: grey;
    }
`;

const Alert = ({ socket }) => {
    const [message, setMessage] = useState('');
    const [show, setShow] = useState(false);

    useEffect(() => {
        socket.on('game-alert', message => {
            if (message.startsWith('Game ended!')) {
                setMessage(message);
                setShow(true);
            }
        });
    }, [socket]);

    const onOk = useCallback(() => {
        setShow(false);
    }, []);

    return show && <Container>
        <Title>{message}</Title>
        <SubmitButton onClick={onOk}>OK</SubmitButton>
    </Container>;
};

export default Alert;
