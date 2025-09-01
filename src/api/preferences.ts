const reLocal = /^local/;


const sessionStoragePrefix:string = 'session/b2b-products';
const localStoragePrefix:string = 'local/b2b-products';


export const sessionStorageKeys = {
};

export const localStorageKeys = {
    colors: {
        rowsPerPage:`${localStoragePrefix}/colors/rowsPerPage`,
    },
    products: {
        rowsPerPage: `${localStoragePrefix}/products/rowsPerPage`,
        filterActive: `${localStoragePrefix}/products/filterActive`,
        sort: `${localStoragePrefix}/products/sort`,
    },
    items: {
        showImages: `${localStoragePrefix}/items/showImages`,
        shoInactive: `${localStoragePrefix}/items/showInactive`,
    }
}

function getStorage(key:string):Storage {
    return reLocal.test(key) ? window.localStorage : window.sessionStorage;
}

export const setPreference = <T = unknown>(key:string, value:T) => {
    try {
        if (!global.window) {
            return;
        }
        getStorage(key).setItem(key, JSON.stringify(value));
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.log("setPreference()", err.message);
        }
    }
};

export const clearPreference = (key:string) => {
    if (typeof window === 'undefined') {
        return;
    }
    getStorage(key).removeItem(key);
}

export const getPreference = <T = unknown>(key:string, defaultValue: T):T|null => {
    try {
        if (!global.window) {
            return defaultValue;
        }
        const value = getStorage(key).getItem(key);
        if (value === null) {
            return defaultValue;
        }
        return JSON.parse(value);
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.log("getPreference()", err.message);
        }
        return defaultValue;
    }
};
