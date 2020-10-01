import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
`;

const dropDownAnimation = keyframes`
    from {
        opacity: 0;
        transform: translateY(-100%);
    }
    to {
        opacity: 1;
        transform: 0;
    }
`;

const Toast = styled.div`
    margin: 5px;
    text-align: center;
    animation: ${dropDownAnimation} 0.3s linear;
`;

const ToastMessage = styled.div`
    display: inline-block;
    padding: 5px 15px;
    background-color: ${props => props.color};
    border-radius: 5px;
    opacity: 0.8;
    
    font: 18px consolas;
    font-weight: ${props => props.fontWeight};
    color: ${props => props.textColor};
`;

const defaultToast = {
    message: '',
    color: '#444',
    textColor: 'white',
    fontWeight: 'normal',
    duration: 5000
};

const Toaster = ({ socket }) => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        socket.on('game-alert', message => {
            setToasts(toasts => {
                const safeToast = {
                    ...defaultToast,
                    message
                };
                setTimeout(() => {
                    setToasts(toasts => toasts.filter(t => t !== safeToast));
                }, safeToast.duration);
                return toasts.concat(safeToast);
            });
        });
    }, [socket]);

    return <Container>
        {
            toasts && toasts.map((toast, i) => (
                <Toast key={i}>
                    <ToastMessage {...toast}>{toast.message}</ToastMessage>
                </Toast>
            ))
        }
    </Container>
};

export default Toaster;
