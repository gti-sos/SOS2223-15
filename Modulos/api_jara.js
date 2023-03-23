
var Datastore = require('nedb'), db = new Datastore;
const BASE_API_URL = "/api/v1";
const recurso_url = BASE_API_URL + "/jobseekers-studies";
const API_DOC = "https://documenter.getpostman.com/view/25974926/2s93RMTuJy";

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

    db.insert(jobseekers);

    function pagination(req, lista) {

        var res = [];
        const limit = req.query.limit;
        const offset = req.query.offset;

        if (limit < 1 || offset < 0 || offset > lista.length) {
            res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
            return res;
        }
        res = lista.slice(offset, parseInt(limit) + parseInt(offset));
        return res;

    };

    //Docs
    app.get(recurso_url + "/docs", (req, res) => {
        console.log("/GET jobseekers-studies/docs");
        res.redirect(API_DOC);
    });

    //GET al recurso
    app.get(recurso_url, (req, res) => {
        console.log("/GET jobseekers-studies");
        // Empezamos viendo los registros de la db y eliminamos el _id.
        db.find({}, { _id: 0 }, (err, data) => {
            // Comprobamos los errores que han podido surgir
            if (err) {
                console.log(`Error getting jobseekers-studies`);
                // El estado es el 500 de Internal Server Error
                res.sendStatus(500);
                // Comprobamos si existen datos:
            } else if (data.length == 0) {
                console.log(`Ruta jobseekers-studies Not Found`);
                // Si no existen datos usamos el estado es 404 de Not Found
                res.send(data);
            } else {
                // Tenemos que inicializar los valores necesarios para filtrar: tenemos que ver el limit y offset
                let i = -1;
                if (!req.query.offset) {
                    var offset = -1;
                } else {
                    var offset = parseInt(req.query.offset);
                }
                // Tenemos que filtrar los datos, para ver cada posible campo y devolver true si no se pasa en la query, 
                // y si es un parámetro en la query se comprueba la condicion
                let datos = data.filter((x) => {
                    return (((req.query.year == undefined) || (parseInt(req.query.year) === x.year)) &&
                        ((req.query.from == undefined) || (parseInt(req.query.from) <= x.year)) &&
                        ((req.query.to == undefined) || (parseInt(req.query.to) >= x.year)) &&
                        ((req.query.gender == undefined) || (req.query.gender === x.gender)) &&
                        ((req.query.territory == undefined) || (req.query.territory === x.territory)) &&
                        ((req.query.type == undefined) || (req.query.type === x.type)) &&
                        ((req.query.primary_over == undefined) || (parseInt(req.query.primary_over) <= x.primary)) &&
                        ((req.query.primary_under == undefined) || (parseInt(req.query.primary_under) >= x.primary)) &&
                        ((req.query.fp_program_over == undefined) || (parseInt(req.query.fp_program_over) <= x.fp_program)) &&
                        ((req.query.fp_program_under == undefined) || (parseInt(req.query.fp_program_under) >= x.fp_program)) &&
                        ((req.query.general_education_over == undefined) || (parseInt(req.query.general_education_over) <= x.general_education)) &&
                        ((req.query.general_education_under == undefined) || (parseInt(req.query.general_education_under) >= x.general_education)) &&
                        ((req.query.total_over == undefined) || (parseInt(req.query.total_over) <= x.total)) &&
                        ((req.query.total_under == undefined) || (parseInt(req.query.total_under) >= x.total)));
                }).filter((x) => {
                    // La paginación
                    i = i + 1;
                    if (req.query.limit == undefined) {
                        var cond = true;
                    } else {
                        var cond = (offset + parseInt(req.query.limit)) >= i;
                    }
                    return (i > offset) && cond;
                });

                // Comprobamos si tras el filtrado sigue habiendo datos, si no hay:
                if (datos.length == 0) {
                    console.log(`jobseekers-studies not found`);
                    // Estado 404: Not Found
                    res.sendS(datos);
                    // Si por el contrario encontramos datos
                } else {
                    console.log(`Datos de jobseekers-studies devueltos: ${datos.length}`);
                    // Devolvemos dichos datos, estado 200: OK
                    res.json(datos);
                }
            }
        })
    });

    //GET al recurso
    /*app.get(recurso_url, (request, response) => {
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
    });*/

    //POST al recurso
    app.post(recurso_url, (request, response) => {
        const year = request.body.year;
        const gender = request.body.gender;
        const territory = request.body.territory;
        const type = request.body.type;
        console.log("New POST to /jobseekers-studies"); //console.log en el servidor  
        db.find({}, function (err, data) {
            if (err) {
                res.sendStatus(500, "Client Error");
            }
            // Validar que se envíen todos los campos necesarios
            const requiredFields = ['year', 'gender', 'territory', 'type', 'primary', 'fp_program', 'general_education', 'total'];
            for (const field of requiredFields) {
                if (!request.body.hasOwnProperty(field)) {
                    response.status(400).json(`Missing required field: ${field}`);
                    return;
                }
            }
            // Verificar que la solicitud se hizo en la ruta correcta
            if (request.originalUrl !== '/api/v1/jobseekers-studies') {
                res.status(405).json('Método no permitido');
                return;
            } else {

                // Verificar si el recurso ya existe
                data = data.filter((obj) => {
                    return (year == obj.year && gender == obj.gender && territory == obj.territory && type == obj.type)
                });
                if (data.length != 0) {
                    // Si el recurso ya existe, devolver un código de respuesta 409
                    response.status(409).json(`El recurso ya existe.`);
                } else {
                    // Si el recurso no existe, agregarlo a la lista y devolver un código de respuesta 201
                    db.insert(request.body);
                    response.sendStatus(201);
                }
            }
        });
    });

    //POST al recurso
    /*app.post(recurso_url, (request, response) => {
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
    });*/

    //PUT al recurso
    app.put(recurso_url, (request, response) => {
        response.sendStatus(405).send('No se permite hacer un PUT en esta ruta');
    });

    //DELETE al recurso
    app.delete(recurso_url, (req, res) => {
        db.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500, "Client Error");
            }
            if (!req.body || Object.keys(req.body).length === 0) {
                db.remove({}, { multi: true }, (err, numRemoved) => {
                    if (err) {
                        res.sendStatus(500, "ERROR EN CLIENTE");
                        return;
                    } else {
                        res.sendStatus(200, "DELETED");
                    }
                });
            } else {
                const { year, gender, territory, type } = req.body;
                db.find({}, function (err, data) {
                    if (err) {
                        res.sendStatus(500, "Client Error");
                    }
                    // Buscar el objeto en la matriz evolution_stats
                    data = data.filter((obj) => {
                        return (year == obj.year && gender == obj.gender && territory == obj.territory && type == obj.type);
                    });
                    db.remove({ year: year, gender: gender, territory: territory, type: type }, {}, (err, numRemoved) => {
                        if (err) {
                            res.sendStatus(500, "ERROR EN CLIENTE");
                            return;
                        }
                        if (data === []) {
                            // Si el objeto no se encuentra, devolver un código de respuesta 404 Not Found
                            res.status(404).json('El objeto no existe');
                        } else {
                            res.sendStatus(200, "DELETED");
                            return;
                        }
                    });
                });
            }


        });
    });

    //DELETE al recurso
    /*app.delete(recurso_url, (request, response) => {
        if (!request.body || Object.keys(request.body).length === 0) {
            jobseekers = [];
            console.log("New DELETE to /jobseekers-studies");
            response.status(200).send("Datos borrados correctamente");
        } else {
            const { year, gender, territory, type } = request.body;
            const objIndex = jobseekers.findIndex(x => x.year === parseInt(year) && x.gender === gender && x.territory === territory && x.type === type);
            if (objIndex === -1) {
                response.sendStatus(404).send('El dato no existe');
            } else {
                jobseekers.splice(objIndex, 1);
                response.status(200).send("Dato borrado correctamente");
            }
        }
    });*/

    //GET a ruta loadInitialData
    /*var new_data = [];
    app.get(recurso_url + "/loadInitialData", (request, response) => {
        if (new_data.length === 0) {
            new_data.push(jobseekers);
            response.json(new_data);
            console.log("Se han creado datos para /jobseekers-studies/loadInitialData");
        } else {
            response.json(new_data);
        }
    });*/

    //GET a ruta loadInitialData
    app.get(recurso_url + "/loadInitialData", (req, res) => {
        db.find({}, function (err, data) {
            if (err) {
                res.sendStatus(500, "CLIENT ERROR");

            }
            console.log(data);
            if (data.length === 0) {
                for (var i = 0; i < jobseekers.length; i++) {
                    db.insert(jobseekers[i]);
                }
                res.sendStatus(200);
                console.log("Se han creado datos")
            } else {
                res.json('El arreglo ya contiene datos');
                console.log('El arreglo ya contiene datos')
            }
        });
    });

    /*
    //POST a loadInitialData
    app.post(recurso_url + "/loadInitialData", (request, response) => {
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

    //No se puede hacer PUT a loadInitialData
    app.put(recurso_url + "/loadInitialData", (request, response) => {
        response.sendStatus(405).send('No se permite hacer un PUT en esta ruta');
    });

    //DELETE a loadInitialData
    app.delete(recurso_url, (request, response) => {
        new_data = [];
        response.status(200).send("Datos actualizados correctamente");
    });
    */

    //GET a los recursos de una ciudad
    app.get(recurso_url + '/:city', (req, res) => {
        const from = req.query.from;
        const to = req.query.to;
        const year = req.query.year;
        const gender = req.query.gender;
        const city = req.params.city;
        const type = req.query.type;
        const primary = req.query.primary;
        const fp_program = req.query.fp_program;
        const general_education = req.query.general_education;
        const total = req.query.total;

        db.find({}, function (err, data) {
            if (err) {
                res.sendStatus(500, "Client Error");
            }
            if (from && to) {
                // Lógica para devolver los datos de la ciudad para el periodo especificado
                data = data.filter((obj) => {
                    return (obj.territory == city && obj.period >= from && obj.period <= to);
                });
                //GET de datos del periodo
                if (from >= to) {
                    response.status(400).json("El rango es erróneo");
                } else {
                    console.log(`/GET to /jobseekers-studies/${city}?from=${from}&to=${to}`); //console.log en el servidor
                data.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(data);
                }

            } else if (year) {
                data = data.filter((obj) => {
                    return (obj.year == year && obj.territory == city);
                });
                console.log(`/GET to /jobseekers-studies/${city}?${year}`); //console.log en el servidor
                data.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(data);
            } else if (type) {
                data = data.filter((obj) => {
                    return (obj.type == type);
                });
                console.log(`/GET to /jobseekers-studies/${city}?${fp_program}`); //console.log en el servidor
                data.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(data);
            } else if (gender) {
                data = data.filter((obj) => {
                    return (obj.gender == gender && obj.territory == city);
                });
                console.log(`/GET to /jobseekers-studies/${city}?${gender}`); //console.log en el servidor
                data.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(data);
            }
            else {
                // Lógica para devolver los datos de la ciudad
                data = data.filter((obj) => {
                    return (obj.territory == city);
                });
                if (data.length === 0) {
                    res.status(404).json('La ruta solicitada no existe');
                } else {
                    console.log("/GET a una ciudad concreta");
                    data.forEach((e) => {
                        delete e._id;
                    });
                    if (req.query.limit != undefined || req.query.offset != undefined) {
                        data = pagination(req, data);
                    }
                    res.status(200).json(data);
                }
            }
        });
    });

    //GET a los recursos de una ciudad
    /*app.get(recurso_url + "/:territory", (request, response) => {
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
    });*/

    //No se puede hacer PUT al recurso de una ciudad
    /*app.put(recurso_url + "/:territory", (request, response) => {
        response.sendStatus(405).send('No se permite hacer un PUT en esta ruta');
    });*/

    //DELETE a los datos de una ciudad concreta
    app.delete(recurso_url + '/:territory', (req, res) => {
        const territory = req.params.territory;
        db.find({}, function (err, data) {
            if (err) {
                res.sendStatus(500, "Client Error");
            }
            data = data.filter((obj) => {
                return (obj.territory === territory);
            });
            if (data.length === 0) {
                res.status(404).json(`No se encontraron datos para ${territory}`);
            } else {
                data = data.filter((obj) => { return (obj.territory === territory); });
                if (data) {
                    db.remove({ territory: territory }, { multi: true }, (err, numRemoved) => {
                        if (err) {
                            res.sendStatus(500, "ERROR EN CLIENTE");
                            return;
                        }
                        else {
                            res.sendStatus(200, "DELETED");
                            return;
                        }
                    });
                } else {
                    res.status(404).json(`No se encontraron datos para eliminación ${territory}`);
                }
            }
        });
    });

    //DELETE a los recursos de una ciudad
    /*app.delete(recurso_url + "/:territory", (request, response) => {
        const territory = request.params.territory;
        const filteredStats = jobseekers.filter(stats => stats.territory === territory);

        if (filteredStats.length === 0) {
            response.status(404).json(`No se encontraron datos para ${territory}`);
        } else {
            const newData = jobseekers.filter(stats => stats.territory !== territory);
            const deleted = newData.length !== jobseekers.length;
            jobseekers = newData;

            if (deleted) {
                console.log(`New DELETE to /jobseekers-studies/${territory}`);
                response.status(200).send("Datos borrados correctamente");
            } else {
                response.status(404).json(`No se encontraron datos para /jobseekers-studies/${territory}`);
            }
        }
    });*/

    //GET a un dato concreto
    app.get(recurso_url + '/:year/:gender/:territory/:type', (req, res) => {
        const { year, gender, territory, type } = req.params;
        db.find({}, function (err, data) {

            if (err) {
                res.sendStatus(500, "Client Error");
            }
            // Buscamos las estadísticas para el territorio y el año indicados
            data = data.filter((obj) => {
                return (year == obj.year && gender == obj.gender && territory == obj.territory && type == obj.type);
            });
            if (data) {
                data.forEach((e) => {
                    delete e._id;
                });
                if (req.query.limit != undefined || req.query.offset != undefined) {
                    data = pagination(req, data);
                }
                res.status(200).json(data);
            } else {
                res.status(404).json('La ruta solicitada no existe');
            }
            console.log("Solicitud /GET")
        });
    });

    //GET a un dato concreto
    /*app.get(recurso_url + "/:year/:gender/:territory/:type", (request, response) => {
        const { year, gender, territory, type } = request.params;

        const dato = jobseekers.find(x => x.year === parseInt(year) && x.gender === gender && x.territory === territory && x.type === type);
        if (dato) {
            response.status(200).json(dato);
            console.log(`New GET to /jobseekers-studies/${year}/${gender}/${territory}/${type}`);
        } else {
            response.status(404).send("Ruta no existente");
        }
    });*/

    //No se puede hacer POST a un dato concreto
    app.post(recurso_url + "/:year/:gender/:territory/:type", (request, response) => {
        response.sendStatus(405).send('No se permite hacer un POST en esta ruta');
    });

    //PUT a un dato concreto
    app.put(recurso_url + '/:year/:gender/:territory/:type', (req, res) => {
        const { year, gender, territory, type } = request.params;

        const body = req.body;
        db.find({}, function (err, data) {

            if (err) {
                res.status(500).json("Client Error");
            }
            data = data.filter((obj) => {
                return (year === obj.year && gender === obj.gender && territory === obj.territory && type === obj.type);
            });
            if (!data || year !== body.year || gender !== body.gender || territory !== body.territory || type !== body.type) {
                git
                return res.status(400).json('Estadística errónea');
            } else {
                data.primary = req.body.primary || data.primary;
                data.fp_program = req.body.fp_program || data.fp_program;
                data.general_education = req.body.general_education || data.general_education;
                data.total = req.body.total || data.total;

                db.update({ $and: [{ year: parseInt(year) }, { gender: String(gender) }, { territory: String(territory) }, { type: String(type) }] }, { $set: body }, {}, function (err, numUpdated) {
                    if (err) {
                        res.status(500).json("INTERNAL SERVER ERROR");
                    } else {
                        res.sendStatus(200, "UPDATED");
                    }
                });
            }
        });
    });

    //PUT a un dato concreto
    /*app.put(recurso_url + "/:year/:gender/:territory/:type", (request, response) => {
        const { year, gender, territory, type } = request.params;
        var body = request.body;
        var updated = false;

        if (body.year === parseInt(year) && body.gender === gender && body.territory === territory && body.type === type) { // verifica si los valores de año coinciden
            jobseekers = jobseekers.map(x => {
                if (x.year === parseInt(year) && x.gender === gender && x.territory === territory && x.type === type) {
                    x.primary = body.primary;
                    x.fp_program = body.fp_program;
                    x.general_education = body.general_education
                    x.total = body.total;
                    updated = true;
                }
                return x;
            });

            if (updated) {
                console.log(`New PUT a /jobseekers-studies/${year}/${gender}/${territory}/${type}`);
                response.status(200).send("Actualizado");
            } else {
                console.log("No se ha encontrado el dato");
                response.status(400).send("No se ha encontrado el dato");
            }
        } else {
            console.log("Los datos de la URL no coinciden con los datos de la solicitud");
            response.status(400).send("Los datos de la URL no coinciden con los datos de la solicitud");
        }
    });*/

    //DELETE a un dato concreto
    app.delete(recurso_url + '/:year/:gender/:territory/:type', (req, res) => {
        const { year, gender, territory, type } = request.params;
        db.find({}, function (err, data) {
            if (err) {
                res.sendStatus(500);
            }
            data = data.filter((obj) => {
                return (obj.year === year && obj.gender === gender && obj.territory === territory &&obj.type === type);
            });
            if (data.length === 0) {
                res.status(404).json(`No se encontraron datos`);
            } else {
                data = data.filter((obj) => { return (obj.year === year && obj.gender === gender && obj.territory === territory &&obj.type === type); });
                if (data) {
                    db.remove({ $and: [{ year: parseInt(year) }, { gender: String(gender) }, { territory: String(territory) }, { type: String(type) }] }, { multi: true }, (err, numRemoved) => {
                        if (err) {
                            res.sendStatus(500);
                            return;
                        } else if (numRemoved === 0) {
                            res.sendStatus(404, "ERROR EN CLIENTE: Documentos no encontrados");
                            return;
                        }
                        else {
                            res.sendStatus(200, "DELETED");
                            return;
                        }

                    });
                } else {
                    res.status(404).json(`No se encontraron datos que coincidan con los criterios de eliminación`);
                }
            }
        });
    });

    //DELETE a un dato concreto
    /*app.delete(recurso_url + "/:year/:gender/:territory/:type", (request, res) => {
        const { year, gender, territory, type } = request.params;
        const filteredStats = jobseekers.filter(x => x.year === parseInt(year) && x.gender === gender && x.territory === territory && x.type === type);

        if (filteredStats.length === 0) {
            res.status(404).json(`No se encontraron datos para /jobseekers-studies/${year}/${gender}/${territory}/${type}`);
        } else {
            const newData = jobseekers.filter(x => x.year !== parseInt(year) && x.gender !== gender && x.territory !== territory && x.type !== type);
            const deleted = newData.length !== jobseekers.length;
            jobseekers = newData;

            if (deleted) {
                console.log(`New DELETE to /jobseekers-studies/${year}/${gender}/${territory}/${type}`);
                response.status(200).send("Datos borrados correctamente");
            } else {
                res.status(404).json(`No se encontraron datos para /jobseekers-studies/${year}/${gender}/${territory}/${type}`);
            }
        }
    });*/
};