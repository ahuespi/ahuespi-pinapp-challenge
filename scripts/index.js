import { db, collection, addDoc, getDocs } from "./firebase.setting.js";

// Obtengo todos los clientes de la DB
const getClients = async () => {
    const getClients = await getDocs(collection(db, "clients"));
    const clients = getClients.docs.map((list) => list.data());
    const allAges = getClients.docs.map((client) => Number(client.data().age));

    // Muestro la lista de clientes
    clients.forEach((client) => {
        $('#clientList').append(`
            <div class="shadow-xl border rounded px-5 py-10 mt-2">
                <h5 class="font-bold text-xl">${client.firstName} ${client.lastName}</h5>
                <p >Nacimiento: ${client.birthday} (${client.age} años)</p>
            </div>            
        `)
    })

    // Muestro el promedio de edad
    const averageAges = calculateAverage(allAges)
    $('#averageAges').html(`${averageAges} años`)

    // Muestro la desviación
    const deviation = calculateDeviation(allAges, averageAges)
    $('#deviation').html(`${deviation}`)
}

// Calculo el promedio de edad
const calculateAverage = (ages) => {
    const averageCount = ages.reduce((prev, age) => prev + age, 0) / ages.length;
    return averageCount.toFixed(2);
}

// Calculo la desviacion estandar
const calculateDeviation = (ages, average) => {
    const getNominator = ages.map((i) => {
        const sumAges = i - average;
        const powAges = Math.pow(sumAges, 2);

        return powAges;
    })

    const sumNominatorValues = getNominator.reduce((prev, age) => prev + age, 0);
    const getDenominator = ages.length - 1;

    const standarDeviation = Math.sqrt(sumNominatorValues / getDenominator);

    return standarDeviation.toFixed(2);
}

$('#openModal').on('click', () => {
    alert('Amir')
})

const addClient = (e) => {
    e.preventDefault();
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const age = $('#age').val();
    const birthday = $('#birthday').val();

    try {
        const docRef = addDoc(collection(db, "clients"), {
            firstName: firstName,
            lastName: lastName,
            age: age,
            birthday: birthday
        });
        $('#form-success').show();
        console.log('Se envió')
    } catch (e) {
        $('#form-danger').show();
        console.log(e)
    }
}

$(document).ready(() => {
    getClients()
    $('#addClient').on('submit', addClient);
})