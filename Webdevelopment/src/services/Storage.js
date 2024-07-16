//Storage.js

export const storeUserData = (idToken, expiresIn) => {
    const expiryTime = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('expiryTime', expiryTime);
};

export const getUserData = () => {
    const expiryTime = localStorage.getItem('expiryTime');
    if (new Date().getTime() > expiryTime) {
        removeUserData();
        return null;
    }
    return localStorage.getItem('idToken');
};


export const removeUserData = () => {
    localStorage.removeItem('idToken');
    localStorage.removeItem('expiryTime');
};
