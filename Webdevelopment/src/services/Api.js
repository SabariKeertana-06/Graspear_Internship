//Api.js
import axios from "axios"
import { getUserData } from "./Storage"
import { getFirestore, collection, getDocs } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { firebaseApp } from "./FirebaseConfig"
import { query } from "firebase/firestore"
import { where } from "firebase/firestore"
import { updateDoc } from "firebase/firestore"
import { EmailAuthProvider } from "firebase/auth"
import { reauthenticateWithCredential } from "firebase/auth"
import { deleteDoc } from "firebase/firestore"
import { deleteUser } from "firebase/auth"
import { doc,getDoc } from "firebase/firestore"

axios.defaults.baseURL="https://identitytoolkit.googleapis.com/v1"
const API_KEY="AIzaSyAUd3sLjpgcAR0FXiRpW7JO2fyviJ_E6gU"
const REGISTER_URL=`/accounts:signUp?key=${API_KEY}`
const LOGIN_URL=`/accounts:signInWithPassword?key=${API_KEY}`
const USER_DETAILS_URL=`/accounts:lookup?key=${API_KEY}`
const PASSWORD_RESET_URL=`/accounts:sendOobCode?key=${API_KEY}`
const DELETE_URL= `/accounts:delete?key=${API_KEY}`
const UPDATE_PROFILE_URL = `/accounts:update?key=${API_KEY}`;

export const RegisterApi = (inputs) => {
    let data = {
        displayName: inputs.name,
        email: inputs.email,
        password: inputs.password,
        gender: inputs.gender,
        dob: inputs.dob,
    };
    return axios.post(REGISTER_URL, data);
};

export const PasswordResetApi = (email) => {
    const data = {
        email: email,
        requestType: "PASSWORD_RESET",
    };
    return axios.post(PASSWORD_RESET_URL, data);
};


export const LoginApi=(inputs)=>{
    let data = {email: inputs.email, password:inputs.password}
    return axios.post(LOGIN_URL,data)
}

export const UserDetailsApi = () => {
    let data = {
        idToken: getUserData() 
    };
    return axios.post(USER_DETAILS_URL, data);
};


export const DeleteAccountApi = async (password) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No authenticated user found.');
        }

        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.error(`User document with email ${currentUser.email} does not exist.`);
            throw new Error(`User document with email ${currentUser.email} does not exist.`);
        }

        const userDocRef = querySnapshot.docs[0].ref;
        await deleteDoc(userDocRef);
        await deleteUser(currentUser);

        return { success: true };
    } catch (error) {
        console.error("Error deleting user: ", error);
        throw error;
    }
};


export const UpdateProfileApi = async (user) => {
    const idToken = getUserData(); 

    const data = {
        idToken: idToken,
        displayName: user.name,
        email: user.email,
        returnSecureToken: true,
    };

    await axios.post(UPDATE_PROFILE_URL, data);
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.error(`User document with email ${user.email} does not exist.`);
        throw new Error(`User document with email ${user.email} does not exist.`);
    }

    const userDocRef = querySnapshot.docs[0].ref;
    await updateDoc(userDocRef, {
        name: user.name,
        email: user.email,
    });
};


const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export async function getUsers() {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return userList;
}


export const getUserById = async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        throw new Error(`User with ID ${userId} does not exist.`);
    }

    return { id: userDoc.id, ...userDoc.data() };
};

export const updateUser = async (userId, updatedUser) => {
    const userDocRef = doc(db, 'users', userId);

    await updateDoc(userDocRef, {
        name: updatedUser.name,
        email: updatedUser.email,
        gender: updatedUser.gender,
        dob: updatedUser.dob,
    });
};

export const deleteUserById = async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    await deleteDoc(userDocRef);
};
