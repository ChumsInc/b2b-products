import {useEffect, useState} from "react";

type BootstrapTheme = 'light'|'dark';

export function useBootstrapTheme():BootstrapTheme {
    const [value, setValue] = useState<BootstrapTheme>(document.documentElement.dataset.bsTheme as BootstrapTheme ?? 'light');

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            console.log(mutations);
            if (mutations.some(m => m.attributeName === 'data-bs-theme')) {
                setValue(document.documentElement.dataset.bsTheme as BootstrapTheme);
            }
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-bs-theme']
        });
        return () => observer.disconnect();

    }, []);
    return value;
}
