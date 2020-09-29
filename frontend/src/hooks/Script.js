import { useEffect, useState } from "react";

const loadScript = url => {
    return new Promise(resolve => {
        const script = document.createElement("script");
        script.onload = () => resolve(script);
        script.src = url;
        document.body.appendChild(script);
    });
};

const useScript = (scripts) => {
    const [loaded, setLoaded] = useState(false);
    const [elements, setElements] = useState([]);

    useEffect(() => {
        if (elements.length === 0) (async () => {
            const results = [];
            for (const url of scripts)
                results.push(await loadScript(url));
            setElements(results);
            setLoaded(true);
        })();
        else return () => {
            try { elements.forEach(e => document.body.removeChild(e)); }
            catch (err) { }
        };
    }, [scripts, elements]);

    return loaded;
};

export default useScript;
