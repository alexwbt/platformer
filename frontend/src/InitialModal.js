import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import CharacterSelect from './CharacterSelect';
import { useInput } from './hooks/Input';

const Container = styled.div`
    position: fixed;
    display: flex;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: #333;
    color: white;
    font-family: monospace;
`;

const Section = styled.div`
    display: inline-block;
    margin: 0 10px;
`;

const Input = styled.input`
    padding: 5px 10px;
    font-size: 20px;
    border: 1px solid black;
    text-align: center;
    width: calc(100% - 22px);
`;

const Title = styled.div`
    font-size: 25px;
    padding: 5px;
    margin-top: 10px;
    border: 1px solid ${props => props.red ? 'red' : 'white'};
    color: ${props => props.red ? 'red' : 'white'};
    text-align: center;
`;

const Controls = styled.div`
    border: 1px solid white;
    font-size: 15px;
    > div {
        display: flex;
        justify-content: space-between;
        padding: 5px 20px;
        border-bottom: 1px dashed white;
    }
    > div:last-child {
        border-bottom: none;
    }
`;

const Content = styled.div`
    border: 1px solid white;
    padding: 10px;
    font-size: 20px;
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

const InitialModal = ({ socket }) => {
    const [name, setName] = useInput('');
    const [show, setShow] = useState(true);
    const ref = useRef();

    const onClose = useCallback(() => {
        const trimmedName = name.trim();
        if (name) {
            socket.emit('player-name', trimmedName);
            setShow(false);
            window.stopListening = false;
        } else setName({ target: { value: null } });
    }, [name, setName, socket]);

    return show && <Container ref={ref}>
        <Section>
            <Title red={name === null}>ENTER YOUR NAME</Title>
            <Input value={name || ''} onChange={setName} />
            <Title>Controls</Title>
            <Controls>
                <div>
                    <span>W / Space</span>
                    <span>Jump</span>
                </div>
                <div>
                    <span>A</span>
                    <span>Walk left</span>
                </div>
                <div>
                    <span>D</span>
                    <span>Walk right</span>
                </div>
                <div>
                    <span>Left click</span>
                    <span>Fire</span>
                </div>
                <div>
                    <span>Right click / R</span>
                    <span>Reload</span>
                </div>
                <div>
                    <span>B</span>
                    <span>Shop</span>
                </div>
                <div>
                    <span>H (Hold)</span>
                    <span>Heal</span>
                </div>
            </Controls>
            <Title>Goal</Title>
            <Content>Hold the bomb until it explodes.</Content>
            <SubmitButton onClick={onClose}>Enter</SubmitButton>
        </Section>
        <Section>
            <Title>Select Character</Title>
            <CharacterSelect socket={socket} />
        </Section>
    </Container>;
};

export default InitialModal;
