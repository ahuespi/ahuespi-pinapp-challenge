// Configuración de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCwNYPNspvBntINPES6RyK3hXqfy0X3cnQ",
    authDomain: "ahuespi-pinapp-challenge.firebaseapp.com",
    projectId: "ahuespi-pinapp-challenge",
    storageBucket: "ahuespi-pinapp-challenge.appspot.com",
    messagingSenderId: "809292502601",
    appId: "1:809292502601:web:dd04b43cdacc072c65d198"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Fin de la configuración de Firebase

// Obtengo todos los pacientes de la DB
const getClients = async () => {
    const clients = await getDocs(collection(db, "clients"));
    const listClients = clients.docs.map((list) => list.data());
    console.log(listClients)
}


getClients()