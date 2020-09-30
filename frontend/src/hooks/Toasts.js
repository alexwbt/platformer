import { useEffect, useState } from 'react';

const globalToasts = [];
const observers = [];

const defaultToast = {
    message: '',
    color: '#444',
    textColor: 'white',
    fontWeight: 'normal',
    duration: 5000
};

export const addToast = toast => {
    const safeToast = {
        ...defaultToast,
        ...toast
    };
    globalToasts.push(safeToast);
    setTimeout(() => {
        globalToasts.splice(globalToasts.indexOf(safeToast), 1);
        observers.forEach(update => update(globalToasts.slice()));
    }, safeToast.duration);
    observers.forEach(update => update(globalToasts.slice()));
};

const useToaster = () => {
    const [toasts, setToasts] = useState();

    useEffect(() => {
        observers.push(setToasts);
        setToasts(globalToasts);
        return () => {
            observers.splice(observers.indexOf(setToasts), 1);
        };
    }, []);

    return toasts;
}

export default useToaster;
