
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
        { year: 2006, gender: 'Ambos-sexos', territory: 'Cádiz', type: 'Otros-DENOs', primary: 125, fp_program: 188, general_education: 3.164, total: 4.590 },
        { year: 2007, gender: 'Ambos-sexos', territory: 'Almería', type: 'Parados-registrados', primary: 1344, fp_program: 1241, general_education: 16823, total: 29870 },
        { year: 2007, gender: 'Ambos-sexos', territory: 'Almería', type: 'TEAS', primary: 61, fp_program: 44, general_education: 2196, total: 4921 },
        { year: 2007, gender: 'Ambos-sexos', territory: 'Almería', type: 'Otros-DENOs', primary: 58, fp_program: 60, general_education: 669, total: 1127 },
        { year: 2007, gender: 'Ambos-sexos', territory: 'Almería', type: 'Demandantes-no-ocupados-(DENOs)', primary: 1463, fp_program: 1345, general_education: 19687, total: 35918 },
        { year: 2007, gender: 'Ambos-sexos', territory: 'Almería', type: 'Demandantes-ocupados', primary: 336, fp_program: 412, general_education: 4013, total: 9082 }

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
        console.log("new GET to /jobseekers-studies/docs");
        res.redirect(API_DOC);
    });

    //GET al recurso
    app.get(recurso_url, (req, res) => {
        console.log("New GET to /jobseekers-studies");
        // Empezamos viendo los registros de la db y eliminamos el _id.
        db.find({}, { _id: 0 }, (err, data) => {
            if (err) {
                console.log(`Error getting jobseekers-studies`);
                res.sendStatus(500);
                // Comprobamos si existen datos:
            } else if (data.length == 0) {
                console.log(`Ruta /jobseekers-studies Not Found`);
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
                    res.sendStatus(400);
                    // Si por el contrario encontramos datos
                } else {
                    console.log(`Datos de jobseekers-studies: ${datos.length}`);
                    res.json(datos);
                }
            }
        })
    });

    //POST al recurso
    app.post(recurso_url, (request, response) => {
        const year = request.body.year;
        const gender = request.body.gender;
        const territory = request.body.territory;
        const type = request.body.type;
        console.log("New POST to /jobseekers-studies"); //console.log en el servidor  
        db.find({}, function (err, data) {
            if (err) {
                res.sendStatus(500);
            }
            // Validar que se envíen todos los campos necesarios
            const requiredFields = ['year', 'gender', 'territory', 'type', 'primary', 'fp_program', 'general_education', 'total'];
            for (const field of requiredFields) {
                if (!request.body.hasOwnProperty(field)) {
                    response.status(400).json(`Missing required field: ${field}`);
                    return;
                } 
                if(request.body.length!=8){
                    response.sendStatus(400).json(`El número de campos no es correcto`)
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
                    response.status(409).json(`Recurso ya existente.`);
                } else {
                    // Si el recurso no existe, agregarlo a la lista y devolver un código de respuesta 201
                    db.insert(request.body);
                    response.sendStatus(201);
                }
            }
        });
    });

    //PUT al recurso
    app.put(recurso_url, (request, response) => {
        response.sendStatus(405).send('No se permite hacer un PUT en esta ruta');
    });

    //DELETE al recurso
    app.delete(recurso_url, (req, res) => {
        db.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500);
            }
            if (!req.body || Object.keys(req.body).length === 0) {
                db.remove({}, { multi: true }, (err, numRemoved) => {
                    if (err) {
                        res.sendStatus(500);
                        return;
                    } else {
                        res.sendStatus(200);
                    }
                });
            } else {
                const { year, gender, territory, type } = req.body;
                db.find({}, function (err, data) {
                    if (err) {
                        res.sendStatus(500);
                    }
                    // Buscar el objeto en la matriz evolution_stats
                    data = data.filter((obj) => {
                        return (year == obj.year && gender == obj.gender && territory == obj.territory && type == obj.type);
                    });
                    db.remove({ year: year, gender: gender, territory: territory, type: type }, {}, (err, numRemoved) => {
                        if (err) {
                            res.sendStatus(500);
                            return;
                        }
                        if (data === []) {
                            // Si el objeto no se encuentra, devolver un código de respuesta 404 Not Found
                            res.status(404).json('El objeto no existe');
                        } else {
                            res.sendStatus(200);
                            return;
                        }
                    });
                });
            }


        });
    });

    //GET a ruta loadInitialData
    app.get(recurso_url + "/loadInitialData", (req, res) => {
        db.find({}, function (err, data) {
            if (err) {
                res.sendStatus(500);

            }
            console.log(data);
            if (data.length === 0) {
                for (var i = 0; i < jobseekers.length; i++) {
                    db.insert(jobseekers[i]);
                }
                res.sendStatus(200);
                console.log("Se han creado datos")
            } else {
                res.json('El recurso ya contiene datos');
                console.log('El recurso ya contiene datos')
            }
        });
    });

    //GET a los datos de una ciudad
    app.get(recurso_url + '/:territory', (req, res) => {
        const from = req.query.from;
        const to = req.query.to;
        const year = req.query.year;
        const gender = req.query.gender;
        const territory = req.params.territory;
        const type = req.query.type;
        /*const primary = req.query.primary;
        const fp_program = req.query.fp_program;
        const general_education = req.query.general_education;
        const total = req.query.total;*/

        db.find({}, function (err, data) {
            if (err) {
                res.sendStatus(500);
            }
            if (from && to) {
                // Lógica para devolver los datos de la ciudad para el periodo especificado
                data = data.filter((obj) => {
                    return (obj.territory == territory && obj.year >= from && obj.year <= to);
                });
                //GET de datos del periodo
                if (from >= to) {
                    response.status(400).json("El rango es erróneo");
                } else {
                    console.log(`New GET to /jobseekers-studies/${territory}?from=${from}&to=${to}`);
                    data.forEach((e) => {
                        delete e._id;
                    });
                    res.status(200).json(data);
                }

            } else if (year) {
                data = data.filter((obj) => {
                    return (obj.year == year && obj.territory == citerritoryty);
                });
                console.log(`New GET to /jobseekers-studies/${territory}?${year}`);
                data.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(data);
            } else if (type) {
                data = data.filter((obj) => {
                    return (obj.type == type && obj.territory == territory);
                });
                console.log(`New GET to /jobseekers-studies/${territory}?${type}`);
                data.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(data);
            } else if (gender) {
                data = data.filter((obj) => {
                    return (obj.gender == gender && obj.territory == territory);
                });
                console.log(`New GET to /jobseekers-studies/${territory}?${gender}`); //console.log en el servidor
                data.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(data);
            }
            else {
                // Lógica para devolver los datos de la ciudad
                data = data.filter((obj) => {
                    return (obj.territory == territory);
                });
                if (data.length === 0) {
                    res.status(404).json('La ruta solicitada no existe');
                } else {
                    console.log(`New GET to /jobseekers-studies/${territory}`);
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


    //DELETE a los datos de una ciudad
    app.delete(recurso_url + '/:territory', (req, res) => {
        const territory = req.params.territory;
        db.find({}, function (err, data) {
            if (err) {
                res.sendStatus(500);
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
                            res.sendStatus(500);
                            return;
                        }
                        else {
                            res.sendStatus(200);
                            return;
                        }
                    });
                } else {
                    res.status(404).json(`No se encontraron datos para eliminación ${territory}`);
                }
            }
        });
    });

    //GET a un dato concreto
    app.get(recurso_url + '/:year/:gender/:territory/:type', (req, res) => {
        const { year, gender, territory, type } = req.params;
        db.find({}, function (err, data) {

            if (err) {
                res.sendStatus(500);
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
            console.log(`New GET to /jobseekers-studies/${year}/${gender}/${territory}/${type}`)
        });
    });


    //No se puede hacer POST a un dato concreto
    app.post(recurso_url + "/:year/:gender/:territory/:type", (request, response) => {
        response.sendStatus(405).send('No se permite hacer un POST en esta ruta');
    });

    //PUT a un dato concreto
    app.put(recurso_url + "/:year/:gender/:territory/:type", (req, res) => {
        const { gender, territory, type } = req.params;
        const year = parseInt(req.params.year);
        const yearbody = req.body.year;
        const genderbody = req.body.gender;
        const territorybody = req.body.territory;
        const typebody = req.body.type;
        const body = req.body;
        db.find({}, function (err, filteredList) {
    
          if (err) {
            res.sendStatus(500);
          }
          filteredList = filteredList.filter((obj) => {
            return (obj.year === year && obj.gender == gender && obj.territory === territory && obj.type === type );
          });
          if (!filteredList || year !== yearbody || gender !== genderbody || territory !== territorybody || type !== typebody) {
              return res.status(400).json('Estadística errónea');
        } else {
            filteredList.primary = req.body.primary || filteredList.primary;
            filteredList.fp_program = req.body.fp_program || filteredList.fp_program;
            filteredList.general_education = req.body.general_education || filteredList.general_education;
            filteredList.total = req.body.total || filteredList.total;
            
            db.update({ $and: [ { year: parseInt(year) }, { territory: String(territory) }] }, { $set: body }, {}, function (err, numUpdated) {
                if (err) {
                    res.sendStatus(500, "INTERNAL SERVER ERROR");
                  } else {
                      res.sendStatus(200, "UPDATED");
                  }
              });
          }
        });
      });


    //DELETE a un dato concreto
    app.delete(recurso_url + '/:year/:gender/:territory/:type', (req, res) => {
        const { year, gender, territory, type } = req.params;
        db.find({}, function (err, data) {

            if (err) {
                res.sendStatus(500, "Client Error");
            }
            //const filteredStats = salario_medio.filter(stats => stats.province === province);
            data = data.filter((obj) => {
                return (obj.year === parseInt(year) && obj.gender === gender && obj.territory === territory && obj.type === type);
            });
            if (data.length === 0) {
                res.status(404).json(`No se encontraron datos para ${province} y ${year}`);
            } else {
                if (data) {
                    db.remove({ year: parseInt(year), gender: gender, territory: territory, type: type }, {}, (err, numRemoved) => {
                        if (err) {
                            res.sendStatus(500, "ERROR EN CLIENTE");
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
                    res.status(404).json(`No se encontraron datos para ${territory}`);
                }
            }
        });
    });

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

};