
const BASE_API_URL = "/api/v1";
const recurso_url = BASE_API_URL + "/jobseekers-studies";

module.exports = (app) => {
    //-------------------------------------------------Parte Jara--------------------------------------------------------
    var jobseekers = [
        { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'Parados-registrados', primary: 1.062, fp_program: 1.232, general_education: 16.120, total: 27.469 },
        { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'TEAS', primary: 68, fp_program: 51, general_education: 2.394, total: 5.312 },
        { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'Otros-DENOs', primary: 40, fp_program: 64, general_education: 723, total: 1.177 },
        { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'Demandantes-no-ocupados-(DENOs)', primary: 1.170, fp_program: 1.347, general_education: 19.237, total: 33.957 },
        { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'Demandantes-ocupados', primary: 279, fp_program: 361, general_education: 3784, total: 7.902 },
        { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'Otros-demandantes-excluidos-del-paro-registrado', primary: 56, fp_program: 120, general_education: 1.942, total: 2.926 },
        { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'Total-demandantes-de-empleo', primary: 1.505, fp_program: 1.828, general_education: 24.963, total: 44.785 },
        { year: 2006, gender: 'Ambos-sexos', territory: 'Cádiz', type: 'Parados-registrados', primary: 2.644, fp_program: 7.560, general_education: 65.454, total: 99.399 },
        { year: 2006, gender: 'Ambos-sexos', territory: 'Cádiz', type: 'TEAS', primary: 28, fp_program: 242, general_education: 7.316, total: 13.494 },
        { year: 2006, gender: 'Ambos-sexos', territory: 'Cádiz', type: 'Otros-DENOs', primary: 125, fp_program: 188, general_education: 3.164, total: 4.590 }
    ];

    

    //GET al recurso
    app.get(recurso_url, (request, response) => {
        const from = request.query.from;
        const to = request.query.to;

        //buscar datos del periodo
        if (from && to) {
            const datosPeriodo = jobseekers.filter(x => { return x.year >= from && x.year <= to });
            //GET de datos del periodo
            if (from >= to) {
                response.status(400).json("El rango es erróneo");
            } else {
                response.status(200).json(datosPeriodo);
                console.log(`New GET to /jobseekers-studies?from${from}&to${to}`);
            }
        } else {
            const { year } = request.query;
            //GET de datos de un año
            if (year) {
                const datosAño = jobseekers.filter(x => x.year === parseInt(year));
                response.status(200).json(datosAño);
                console.log(`New GET to /jobseekers-studies from ${year}`);
            } else {
                //GET de datos del recurso entero
                console.log(`New GET to /jobseekers-studies`);
                response.status(200).json(jobseekers);
            }
        }
    });


    //POST al recurso
    app.post(recurso_url, (request, response) => {
        var newEntry = request.body;
        var num_param = 8;

        if (Object.keys(newEntry).length !== num_param) {
            //Error 400 si el número de parámetros es incorrecto
            response.status(400).send("Número de parámetros incorrecto");
        } else if (jobseekers.some(x => JSON.stringify(x) === JSON.stringify(newEntry))) {
            //Error 409 si el dato ya existe
            response.status(409).send("El dato ya existe");
        } else {
            console.log(`newEntry = <${JSON.stringify(newEntry, null, 2)}>`);
            console.log("New POST to /jobseekers-studies");
            jobseekers.push(newEntry);
            response.sendStatus(201).send('Nuevo dato creado correctamente');
        }
    });

    //PUT al recurso
    app.put(recurso_url, (request, response) => {
        response.sendStatus(405).send('No se permite hacer un PUT en esta ruta');
    });

    //DELETE al recurso
    app.delete(recurso_url, (request, response) => {
        if (!request.body || Object.keys(request.body).length === 0) {
            jobseekers = [];
            console.log("New DELETE to /jobseekers-studies");
            response.status(200).send("Datos borrados correctamente");
        } else {
            const { year, territory } = request.body;
            const objIndex = jobseekers.findIndex(x => x.year === year && x.territory === territory);
            if (objIndex === -1) {
                response.sendStatus(404).send('El dato no existe');
            } else {
                jobseekers.splice(objIndex, 1);
                response.status(200).send("Dato borrado correctamente");
            }
        }
    });

    //GET a ruta loadInitialData
    var new_data = [];
    app.get(recurso_url + "/loadInitialData", (request, response) => {
        if (new_data.length === 0) {
            new_data.push(jobseekers);
            response.json(new_data);
            console.log("Se han creado datos para /jobseekers-studies/loadInitialData");
        } else {
            response.json(new_data);
        }
    });

    //No se puede hacer POST a loadInitialData
    app.post(recurso_url + "/loadInitialData", (request, response) => {
        response.sendStatus(405).send('No se permite hacer un POST en esta ruta');
    });

    //PUT a loadInitialData
    app.put(recurso_url, (request, response) => {
        if (!request.body) {
            response.status(400).send("No hay datos");
        } else {
            new_data = request.body;
            response.status(200).send("Datos actualizados correctamente");
        }
    });

    //DELETE a loadInitialData
    app.delete(recurso_url, (request, response) => {
        new_data = [];
        response.status(200).send("Datos actualizados correctamente");
    });

    //GET a los recursos de una ciudad
    app.get(recurso_url + "/:territory", (request, response) => {
        const territory = request.params.territory;
        const from = request.query.from;
        const to = request.query.to;

        if (from && to) {
            const datosPeriodo = jobseekers.filter(x => x.territory === territory && x.year >= from && x.year <= to);
            //GET de datos del periodo
            if (from >= to) {
                response.status(400).json("El rango es erróneo");
            } else {
                response.status(200).json(datosPeriodo);
                console.log(`New GET to /jobseekers-studies/${territory}?from${from}&to${to}`);
            }
        } else {
            const datosTerrytory = jobseekers.filter(x => x.territory === territory);
            //GET de datos de una ciudad
            if (datosTerrytory.length === 0) {
                response.status(404).send("Ruta no existente");
            } else {
                response.status(200).json(datosTerrytory);
                console.log(`New GET to /jobseekers-studies/${territory}`);
            }
        }
    });

    //GET a un dato concreto
    app.get(recurso_url + "/:year/:gender/:territory/:type", (request, response) => {
        const { year, gender, territory, type } = request.params;

        const dato = jobseekers.find(x => x.year === parseInt(year) && x.gender === gender && x.territory === territory && x.type === type);
        if (dato) {
            response.status(200).json(dato);
            console.log(`New GET to /jobseekers-studies/${year}/${gender}/${territory}/${type}`);
        } else {
            response.status(404).send("Ruta no existente");
        }
    });

    //PUT a un dato concreto
    app.put(recurso_url + "/:year/:gender/:territory/:type", (request, response) => {
        const { year, gender, territory, type } = request.params;
        const yearbody = request.body.year;
        const genderbody = request.body.gender;
        const territorybody = request.body.territory;
        const typebody = request.body.type;

        const dato = jobseekers.find(x => x.year === parseInt(year) && x.gender === gender && x.territory === territory && x.type === type);
        if (!dato || yearbody !== year || genderbody !== gender || territorybody !== territory || typebody !== type) {
            response.status(400).send("Dato erróneo");
        } else {
            dato.primary = request.body.primary || dato.primary;
            dato.fp_program = request.body.fp_program || dato.fp_program;
            dato.general_education = request.body.general_education || dato.general_education;
            dato.total = request.body.total || dato.total;
            response.status(200).send("Datos actualizados correctamente");
        }
    });
};