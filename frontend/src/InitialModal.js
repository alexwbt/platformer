import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import CharacterSelect from './CharacterSelet';
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

const InitialModal = () => {
    const [name, setName] = useInput('');
    const [show, setShow] = useState(true);
    const ref = useRef();

    const onClose = useCallback(() => {
        const trimmedName = name.trim();
        if (name) {
            window.socket.emit('player-name', trimmedName.slice(-15));
            setShow(false);
        } else setName({ target: { value: null } });
    }, [name, setName]);

    useEffect(() => {
        if (ref.current) {
            const current = ref.current;
            const stopFunction = e => e.stopPropagation();
            current.addEventListener('mousedown', stopFunction);
            current.addEventListener('keydown', stopFunction);
            return () => {
                current.removeEventListener('mousedown', stopFunction);
                current.removeEventListener('keydown', stopFunction);
            };
        }
    }, [ref]);

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
            </Controls>
            <SubmitButton onClick={onClose}>Enter</SubmitButton>
        </Section>
        <Section>
            <Title>Select Character</Title>
            <CharacterSelect />
        </Section>
    </Container>;
};

export default InitialModal;
