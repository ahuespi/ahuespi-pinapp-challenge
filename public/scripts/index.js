import { db, collection, addDoc, getDocs } from "./firebase.setting.js";

// Obtengo todos los clientes de la DB
const getClients = async () => {
    const getClients = await getDocs(collection(db, "clients"));
    const clients = getClients.docs.map((list) => list.data());
    const allAges = getClients.docs.map((client) => Number(client.data().age));
    $('.client__user').remove()
    // Muestro la lista de clientes
    clients.forEach((client) => {
        // Muestro la fecha probable de defunsion
        const deadDate = calculateDeadDate(client.birthday)
        $('#loading').hide()
        $('#clientList').append(`
            <div class="shadow-xl border rounded px-5 py-10 mt-2 client__user flex ">
                <div class="flex items-center justify-center bg-orange-50 h-12 w-12 rounded-full border border-orange-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div class="pl-5">
                    <h5 class="font-bold text-xl">${client.firstName} ${client.lastName}</h5>
                    <p class="text-xs text-gray-400" >Nacimiento: ${client.birthday} (${client.age} años)</p>
                    <p class="text-xs text-gray-400">Año est. de defunsion: ${deadDate} </p>
                </div>
                
            </div>            
        `)
    })

    // Muestro el promedio de edad
    const averageAges = calculateAverage(allAges)
    if (isNaN(averageAges)) {
        $('#averageAges').html(`No hay datos`)
    } else {
        $('#averageAges').html(`${averageAges} años`)
    }

    // Muestro la desviación
    const deviation = calculateDeviation(allAges, averageAges)
    $('#deviation').html(`${deviation}`)
}

// Agrego un cliente a la DB
const addClient = (e) => {
    e.preventDefault();
    $('#sendButton').attr('disabled', 'disabled')
    $('#sendButton').html('Creando...')

    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const age = $('#age').val();
    const birthday = $('#birthday').val();

    try {
        const addClient = addDoc(collection(db, "clients"), {
            firstName: firstName,
            lastName: lastName,
            age: age,
            birthday: birthday
        });
        setTimeout(() => {
            $('#sendButton').html('Usuario creado correctamente')
            $('#sendButton').css({
                'background': 'green',
                'color': 'white',
                'font-weight': 'bold'
            })
            setTimeout(() => {
                $('#formAddClient').fadeOut(250)
                getClients()
            }, 2000)
        }, 2000);
    } catch (e) {
        $('#sendButton').html('Error en la creacion del usuario')
        console.log(e)
    }
}

// Calculo el promedio de edad
const calculateAverage = (ages) => {
    const averageValue = ages.reduce((prev, age) => prev + age, 0) / ages.length;
    return averageValue.toFixed(2);
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
    const deviation = Math.sqrt(sumNominatorValues / getDenominator);

    return deviation.toFixed(2);
}

// Calculo fecha problable de muerte
const calculateDeadDate = (birthday) => {
    const lifeExpectancy = 75
    const year = parseInt(birthday.slice(0, 4));
    return year + lifeExpectancy
}

// Eventos
$('#openModal').on('click', () => {
    $('#formAddClient').fadeIn(250)
    $('#formAddClient').css('display', 'flex')
    $('#sendButton').html('Crear cliente')
    $('#sendButton').css({
        "color": 'white',
        "font-weight": 'bold',
        "background-color": "rgb(14 165 233 / 1)"
    })
})
$('#closeModal').on('click', () => {
    $('#formAddClient').fadeOut(250)
})

$(document).ready(() => {
    $('#addClient').on('submit', addClient);
    getClients()
})