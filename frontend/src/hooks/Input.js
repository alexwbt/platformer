import { useCallback, useState } from "react";

export const useInput = defaultValue => {
    const [value, setValue] = useState(defaultValue);
    const onChange = useCallback(e => setValue(e.target.value), []);
    return [value, onChange];
};
