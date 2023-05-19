
import Datastore from 'nedb'
var db = new Datastore;

const rutaCOVD = "/api/v2/covd";

const BASE_API_URL = "/api/v2";
const rutaAMR = BASE_API_URL + '/salary-stats';
const API_DOC_PORTAL = "https://documenter.getpostman.com/view/26059557/2s93JzMgXR";
const API_DOC_PORTAL_2 = "https://documenter.getpostman.com/view/26059557/2s93XsYRor";

function loadBackend_angel_2 (app) {

    
    app.use(`${rutaCOVD}`, function(req, res) {
        var apiExterna = "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats";
        var requestHeaders = {
            "X-RapidAPI-Key": "b72bf7a6a9mshc58f9ea15845135p17ac66jsne782008c78e3",
            "X-RapidAPI-Host": "covid-19-coronavirus-statistics.p.rapidapi.com"
          };
        req.pipe(request({ url: apiExterna, headers: requestHeaders })).pipe(res);
     });
     
     
    var salario_medio = [
        {
            province: "Almería",
            gender: "male",
            year: 2021,
            salaried: 162525,
            average_salary: 21311,
            standard_deviation: 12172
        },
        {
            province: "Almería",
            gender: "female",
            year: 2021,
            salaried: 133150,
            average_salary: 20786,
            standard_deviation: 10696
        },
        {
            province: "Cádiz",
            gender: "male",
            year: 2021,
            salaried: 237225,
            average_salary: 25200,
            standard_deviation: 14633
        },
        {
            province: "Cádiz",
            gender: "female",
            year: 2021,
            salaried: 197100,
            average_salary: 22189,
            standard_deviation: 10835
        },
        {
            province: "Córdoba",
            gender: "male",
            year: 2021,
            salaried: 159800,
            average_salary: 23220,
            standard_deviation: 12819
        },
        {
            province: "Córdoba",
            gender: "female",
            year: 2021,
            salaried: 138800,
            average_salary: 21573,
            standard_deviation: 10790
        },
        {
            province: "Granada",
            gender: "male",
            year: 2021,
            salaried: 177625,
            average_salary: 24186,
            standard_deviation: 13778
        },
        {
            province: "Granada",
            gender: "female",
            year: 2021,
            salaried: 161125,
            average_salary: 22691,
            standard_deviation: 11540
        },
        {
            province: "Huelva",
            gender: "male",
            year: 2021,
            salaried: 124500,
            average_salary: 22875,
            standard_deviation: 12677
        },
        {
            province: "Huelva",
            gender: "female",
            year: 2021,
            salaried: 126975,
            average_salary: 19305,
            standard_deviation: 8513
        },
        {
            province: "Almería",
            gender: "male",
            year: 2020,
            salaried: 156725,
            average_salary: 21163,
            standard_deviation: 11718
        },
        {
            province: "Almería",
            gender: "female",
            year: 2020,
            salaried: 128225,
            average_salary: 20535,
            standard_deviation: 10149
        }
    ];



    db.insert(salario_medio);
    //console.log("Insertados datos al comenzar");


    //Redirect /docs
    app.get(BASE_API_URL + "/salary-stats/docs", (req, res) => {
        res.redirect(API_DOC_PORTAL);
    });
    app.get(BASE_API_URL + "/salary-stats/docs2", (req, res) => {
        res.redirect(API_DOC_PORTAL_2);
    });


    //APARTADO CREAR 10 O MÁS DATOS RANDOM

    app.get(BASE_API_URL + "/salary-stats/loadInitialData", (req, res) => {
        db.find({}, function (err, filteredList) {

            if (err) {
                res.sendStatus(500, "CLIENT ERROR");

            }
            console.log(filteredList);
            if (filteredList.length === 0) {
                for (var i = 0; i < salario_medio.length; i++) {
                    db.insert(salario_medio[i]);
                }
                res.sendStatus(200);
                console.log("Se han creado datos")
            } else {
                res.json('Ya tiene los datos');
                //res.json(datos_random)
                console.log('Ya tiene los datos')
            }
        });
    });


    //CODIGO PARA MOSTRAR LAS ESTADÍSTICAS A PARTIR DE LA QUERY.

    //GET a salary-stats por cada uno de los distintos campos individualmente por query (excepto from y to, que puede ir juntos).
    app.get('/api/v2/salary-stats', (req, res) => {
        const salaried_behind = req.query.salaried_behind;
        const average_salary_behind = req.query.average_salary_behind;
        const standard_deviation_over = req.query.standard_deviation_over;
        console.log("/GET salary-stats");

        // Empezamos viendo los registros de la db y eliminamos el _id.
        db.find({}, { _id: 0 }, (err, filteredList) => {

            // Comprobamos los errores que han podido surgir
            if (err) {

                console.log(`Error getting salary-stats`);

                // El estado es el 500 de Internal Server Error
                res.sendStatus(500);

                // Comprobamos si existen datos:
            } else if (filteredList.length == 0) {

                console.log(`Ruta salary-stats Not Found`);

                // Si no existen datos usamos el estado es 404 de Not Found
                res.sendStatus(404);

            } else {

                // Tenemos que inicializar los valores necesarios para filtrar: tenemos que ver el limit y offset
                let i = -1;
                if (!req.query.offset || parseInt(req.query.offset) == 0) {
                    var offset = -1;
                } else {
                    var offset = parseInt(req.query.offset)-1; //Le resto 1 para que de bien el resultado al usar offset
                }

                // Tenemos que filtrar los datos, para ver cada posible campo y devolver true si no se pasa en la query, 
                // y si es un parámetro en la query se comprueba la condicion
                let datos = filteredList.filter((x) => {
                    return (((req.query.year == undefined) || (parseInt(req.query.year) === x.year)) &&
                        ((req.query.from == undefined) || (parseInt(req.query.from) <= x.year)) &&
                        ((req.query.to == undefined) || (parseInt(req.query.to) >= x.year)) &&
                        ((req.query.province == undefined) || (req.query.province === x.province)) &&
                        ((req.query.gender == undefined) || (req.query.gender === x.gender)) &&
                        ((req.query.salaried == undefined) || (parseInt(req.query.salaried_behind) <= x.salaried)) &&
                        ((req.query.average_salary == undefined) || (parseInt(req.query.average_salary_behind) <= x.average_salary)) &&
                        ((req.query.standard_deviation == undefined) || (parseInt(req.query.standard_deviation_over) >= x.average_salary)));
                }).filter((x) => {
                    // La paginación
                    i = i + 1;
                    if ((req.query.limit == undefined)) { // Si no se da limit, devuelve todos los datos a partir del offset.
                        var cond = true;
                    } else { // Si se da un limit, se devuelven todos los datos a partir del offset y además cumplen la condición cond.
                        var cond = (offset + parseInt(req.query.limit)) >= i;
                    }
                    return (i > offset) && cond;
                });

                // Comprobamos si tras el filtrado sigue habiendo datos, si no hay:
                if (datos.length == 0) {

                    
                    console.log(`salary-stats not found.`);
                    res.status(404).json(datos);
                    return;
                    

                    // Si por el contrario encontramos datos
                } else {
                    if(salaried_behind != undefined){
                        datos = datos.filter((reg) => {
                            return (reg.salaried <= salaried_behind);
                        });
                        if( average_salary_behind != undefined){ // Si nos dan salaried_behind y average_salary_behind
                            datos = datos.filter((reg) => {
                                return (reg.average_salary <= average_salary_behind);
                            });
                            if(standard_deviation_over != undefined){ // Si además nos dan un standard_deviation_over además del average_salary_behind
                                datos = datos.filter((reg) => {
                                    return (reg.standard_deviation >= standard_deviation_over);
                                });
                            }
                        } else if( (average_salary_behind == undefined) && (standard_deviation_over != undefined) ){ // Si nos dan salaried y standard_deviation_over pero no nos dan  average_salary_behind.
                            datos = datos.filter((reg) => {
                                return (reg.standard_deviation >= standard_deviation_over);
                            });
                        }
                        if(datos.length==1){
                            console.log(`Showing the one resource`);
                            res.status(200).json(datos[0]);
                            return;
                        }else{
                            res.status(200).json(datos);
                            console.log(`Showing resources behind a specified salaried_behind`);
                            return; // Ponemos el return para que terminen los ifs y no salte al siguiente else
                        }
                    }
                    if(average_salary_behind != undefined){ // Si no nos dan un salaried_behind, pero sí un average_salary_behind, entonces....
                        datos = datos.filter((reg) => {
                            return (reg.average_salary <= average_salary_behind);
                        });
                        if( standard_deviation_over != undefined){
                            datos = datos.filter((reg) => {
                                return (reg.standard_deviation >= standard_deviation_over);
                            });
                        }
                        if(datos.length==1){
                            console.log(`Showing the only resource returned with a average_salary_behind behind the one given.`);
                            res.status(200).json(datos[0]);
                            return;
                        }
                        console.log(`Showing resources behind a specified average_salary_behind`);
                        res.status(200).json(datos);
                        return;
                    }
                    if(standard_deviation_over != undefined){
                        datos = datos.filter((reg) => {
                            return (reg.standard_deviation >= standard_deviation_over);
                        });
                        if(datos.length==1){
                            console.log(`Showing the only resource returned with a standard_deviation over the one given.`);
                            res.status(200).json(datos[0]);
                            return;
                        }
                        console.log(`Showing resources over a specified standard_deviation`);
                        res.status(200).json(datos);
                        return;
                    }
                    else{
                        console.log(`Datos de salary-stats devueltos: ${datos.length}`);
                        // Devolvemos dichos datos, estado 200: OK
                        if(datos.length==1 && req.query.offset==undefined && req.query.limit==undefined){
                            console.log(`Showing one resource with a specified salaried, average_salary and standard_deviation`);
                            res.status(200).json(datos[0]);
                            return;
                        }else if (datos.length==1){ // Este caso es para cuando se especifican parámetros que no son ni salaried_behind ni average_salary_behind ni standard_deviation_over por query y sólo se devuelve 1 dato.
                            res.status(200).json(datos[0]);
                            return;
                            //console.log(datos.length)
                        } else{
                            res.status(200).json(datos);
                            return;
                        }
                    }
                }
            }
        })
    });

    //MÉTODOS TABLA AZUL.

    const rutaBase = '/api/v2/salary-stats';

    app.post(BASE_API_URL + "/salary-stats", (request, response) => {
        //var NewEvolution = request.body;
        const province = request.body.province;
        const year = request.body.year;
        const gender = request.body.gender;
        const salaried = request.body.salaried;
        const average_salary = request.body.average_salary;
        const standard_deviation = request.body.standard_deviation;
        console.log("New POST to /salary-stats"); //console.log en el servidor
        if (comprobar_tipos( province,gender,year,salaried,average_salary,standard_deviation) ) {
            response.sendStatus(400, "BAD REQUEST - INCORRECT PARAMETERS");
            console.log(`INCORRECT PARAMETER TYPE`);

        } else {
        db.find({}, function (err, filteredList) {

            if (err) {
                response.sendStatus(500, "CLIENT ERROR");
            }

            // Validar que se envíen todos los campos necesarios
            const requiredFields = ['province', 'gender', 'year', 'salaried', 'average_salary', 'standard_deviation'];
            for (const field of requiredFields) {
                if (!request.body.hasOwnProperty(field)) {
                    console.log(request.body);
                    return response.status(400).json(`Missing required field: ${field}`);
                    
                }
            }
            for(var elem of Object.keys(request.body)){ // Con Object.keys(request.body), obtenemos todas las claves del objeto request.body
                if(!requiredFields.includes(elem)){
                    return response.status(400).json(`There are fields that does not match the structure, as: ${elem}`);
                }
            }
            // Verificar que la solicitud se hizo en la ruta correcta
            if (request.originalUrl !== '/api/v2/salary-stats') {
                response.status(405).json('Método no permitido');
            } else {

                // Verificar si el recurso ya existe
                //const existingObject = salario_medio.find(obj => obj.province === province && obj.year === year);
                filteredList = filteredList.filter((obj) => {
                    return (province == obj.province && gender == obj.gender && year == obj.year)
                });
                //const existingObject = db.find({province : NewEvolution.province, year : NewEvolution.year});
                if (filteredList.length != 0) {
                    // Si el recurso ya existe, devolver un código de respuesta 409
                    response.status(409).json(`El recurso ya existe.`);
                } else {
                    // Si el recurso no existe, agregarlo a la lista y devolver un código de respuesta 201                    
                    db.insert(request.body);
                    //salario_medio.push(request.body);
                    response.sendStatus(201);
                }
            }
        });
    }
    });


    // Método PUT para la ruta base
    app.put(rutaBase, (req, res) => {
        res.status(405).json('El método PUT no está permitido en esta ruta');
    });


    // Ruta específica que no permite el método POST
    const rutaEspecifica = '/api/v2/salary-stats/loadInitialData';
    app.post(rutaEspecifica, (req, res) => {
        res.status(405).json('El método POST no está permitido en esta ruta');
    });

    //Código para hacer búsquedas dada una provincia y luego un año o un género o un número de asalariados, ... así con todos los campos.
    app.get('/api/v2/salary-stats/:province', (req, res) => {
        const province = req.params.province.toLowerCase();
        const from = req.query.from;
        const to = req.query.to;
        //const province = req.query.province;
        const year = req.query.year;
        const gender = req.query.gender;
        const salaried = req.query.salaried;
        const average_salary = req.query.average_salary;
        const standard_deviation = req.query.standard_deviation;

        db.find({}, function (err, filteredList) {

            if (err) {
                res.sendStatus(500, "Client Error");
            }
            if (from && to) {
                // Lógica para devolver los datos dada una provincia y otro dato especificado.
                filteredList = filteredList.filter((obj) => {
                    return (obj.province.toLowerCase() == province && obj.year >= from && obj.year <= to);
                });
                console.log(`/GET to /salary-stats/${province}?from=${from}&to=${to}`); //Usando from y to.
                filteredList.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(filteredList);
            } else if (gender) { // Filtrando por provincia y género.
                filteredList = filteredList.filter((obj) => {
                    return (obj.gender == gender && obj.province.toLowerCase() == province);
                });
                console.log(`/GET to /salary-stats/${province}?${gender}`); //console.log en el servidor
                filteredList.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(filteredList);

            } else if (year) { // Filtrando por provincia y año.
                filteredList = filteredList.filter((obj) => {
                    return (obj.year == year && obj.province.toLowerCase() == province);
                });
                console.log(`/GET to /salary-stats/${province}?${year}`); //console.log en el servidor
                filteredList.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(filteredList);
            } else if (salaried) {
                filteredList = filteredList.filter((obj) => {
                    return (obj.salaried == salaried && obj.province.toLowerCase() == province);
                });
                console.log(`/GET to /salary-stats/${province}?${salaried}`); //console.log en el servidor
                filteredList.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(filteredList);
            } else if (average_salary) {
                filteredList = filteredList.filter((obj) => {
                    return (obj.average_salary == average_salary && obj.province.toLowerCase() == province);
                });
                console.log(`/GET to /salary-stats/${province}?${average_salary}`); //console.log en el servidor
                filteredList.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(filteredList);
            } else if (standard_deviation) {
                filteredList = filteredList.filter((obj) => {
                    return (obj.standard_deviation == standard_deviation && obj.province.toLowerCase() == province);
                });
                console.log(`/GET to /salary-stats/${province}?${standard_deviation}`); //console.log en el servidor
                filteredList.forEach((e) => {
                    delete e._id;
                });
                res.status(200).json(filteredList);
            }
            else {
                // Lógica para devolver los datos de la ciudad
                filteredList = filteredList.filter((obj) => {
                    return (obj.province.toLowerCase() == province);
                });
                if (filteredList.length === 0) {
                    res.status(404).json('La ruta solicitada no existe');
                } else {
                    console.log("/GET a una ciudad concreta");
                    filteredList.forEach((e) => {
                        delete e._id;
                    });
                    if (req.query.limit != undefined || req.query.offset != undefined) {
                        filteredList = pagination(req, filteredList);
                    }
                    res.status(200).json(filteredList);
                }
            }
        });
    });



    //Nuevo GET para poder buscar recursos por un id especificado por parámetros.
    app.get('/api/v2/salary-stats/:province/:gender/:year', (req, res) => {
        const province = req.params.province.toLowerCase();
        const gender = req.params.gender.toLowerCase();
        const year = req.params.year;
        
        db.find({}, function (err, filteredList) {

            if (err) {
                res.sendStatus(500, "Client Error");
            }else {
                filteredList = filteredList.filter((obj) => {
                    return ( obj.province.toLowerCase() == province && obj.gender == gender && obj.year == year);
                });
                console.log(`GET realizado con éxito`); //console.log en el servidor
                filteredList.forEach((e) => {
                    delete e._id;
                });
                if (filteredList.length === 0) {
                    res.status(404).json('There is no resource with the given id.');
                } else {
                    console.log(`GET to /salary-stats/${province}/${gender}/${year}`);
                    res.status(200).json(filteredList[0]);
                }
            }
        });
    });



    //CODIGO PARA PODER HACER UN GET A UNA CIUDAD Y AÑO ESPECÍFICOS.
    app.get('/api/v2/salary-stats/:province/:year', (req, res) => {
        const { province, year } = req.params;
        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "Client Error");
            }
            // Buscamos las estadísticas para el territorio y el año indicados
            filteredList = filteredList.filter((obj) => {
                return (obj.province.toLowerCase() == province.toLowerCase() && obj.year === parseInt(year));
            });

            if (filteredList) {
                filteredList.forEach((e) => {
                    delete e._id;
                });
                if (req.query.limit != undefined || req.query.offset != undefined) {
                    filteredList = pagination(req, filteredList);
                }
                res.status(200).json(filteredList);
            } else {
                res.status(404).json('La ruta solicitada no existe');
            }
            console.log("Solicitud /GET")
        });
    });
    //CODIGO PARA ACTUALIZAR MEDIANTE PUT UNA RUTA CONCRETA DADA UNA PROVINCIA Y UN AÑO POR PARÁMETROS.
    app.put('/api/v2/salary-stats/:province/:gender/:year', (req, res) => {
        const province = req.params.province;
        const gender = req.params.gender;
        const year = req.params.year;
        const provincebody = req.body.province;
        const genderbody = req.body.gender;
        const yearbody = req.body.year;
        const body = req.body;
        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "Client Error");
            }
            filteredList = filteredList.filter((obj) => {
                return (obj.province.toLowerCase() == province.toLowerCase() && obj.year === parseInt(year));
            });
            if (filteredList.length === 0 || province !== provincebody || gender !== genderbody || parseInt(year) !== yearbody) { 
                //console.log(filteredList.length)
                //console.log(typeof province,typeof provincebody,typeof gender, typeof genderbody,typeof year,typeof yearbody)
                return res.status(400).json('No resource found with such parameters (url and body resource id must be the same).');
            } else {
                db.update({ province: String(province), gender: String(gender), year: parseInt(year) }, { $set: body }, { multi: true }, function (err, numUpdated) {
                    if (err) {
                        res.sendStatus(500, "INTERNAL SERVER ERROR");
                    } else {
                        console.log(yearbody) //mostrar por consola
                        res.sendStatus(200, "UPDATED");
                    }
                });
            }
        });
    });




    //METODO DELETE PARA BORRAR LA COLECCIÓN.
    app.delete(BASE_API_URL + "/salary-stats", (req, res) => {
        db.remove({}, { multi: true }, (err, numRemoved) => {

            if (err) {
                res.sendStatus(500, "Client Error");
            }
            if (!req.body || Object.keys(req.body).length === 0) { // Delete a la colección
                db.remove({}, { multi: true }, (err, numRemoved) => {
                    if (err) {
                        res.sendStatus(500, "ERROR EN CLIENTE");
                        return;
                    } else {
                        res.sendStatus(200, "DELETED");
                        console.log("Deleted all data.");
                    }

                });
            } else { //Delete a un recurso concreto.
                const { province, gender, year } = req.body;
                db.find({}, function (err, filteredList) {

                    if (err) {
                        res.sendStatus(500, "Client Error");
                    }
                    // Buscar el objeto en la matriz salario_medio
                    filteredList = filteredList.filter((obj) => {
                        return (obj.province === province && obj.gender === gender && obj.year === year);
                    });
                    db.remove({ province: province, gender: gender, year: year }, {}, (err, numRemoved) => {
                        if (err) {
                            res.sendStatus(500, "ERROR EN CLIENTE");
                            return;
                        }
                        if (filteredList === []) {
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

    //DELETE PARA UN RECURSO ESPECÍFICO.
    app.delete(BASE_API_URL + '/salary-stats/:province/:gender/:year', (req, res) => {
        const province = req.params.province;
        const gender = req.params.gender;
        const year = req.params.year;
        db.find({}, function (err, filteredList) {

            if (err) {
                res.sendStatus(500, "Client Error");
            }
            //const filteredStats = salario_medio.filter(stats => stats.province === province);
            filteredList = filteredList.filter((obj) => {
                return (obj.province === province && obj.gender === gender && obj.year === parseInt(year));
            });
            if (filteredList.length === 0) {
                res.status(404).json(`No se encontraron datos para ${province} y ${year}`);
            } else {
                if (filteredList) {
                    db.remove({ province: province, gender: gender, year: parseInt(year) }, {}, (err, numRemoved) => {
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
                    res.status(404).json(`No se encontraron datos que coincidan con los criterios de eliminación para ${province}`);
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

    function comprobar_tipos(province, gender, year, salaried, average_salary, standard_deviation) { //Esta función es para comprobar que los datos introducidos en el POST son correctos.
        return ( typeof province !== "string" ||
            typeof gender !== "string" ||
            typeof year !== "number" ||
            typeof salaried !== "number" ||
            typeof average_salary !== "number" ||
            typeof standard_deviation !== "number");
    }

    
    // Manejador de errores
    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError) {
            // Enviar una respuesta con un código de estado 400 Bad Request si hay un error de sintaxis en el JSON
            res.status(400).json('La solicitud contiene un JSON no válido');
        } else if (err.status === 401) {
            // Enviar una respuesta con un código de estado 401 Unauthorized si no se proporcionó un token de autenticación válido
            res.status(401).json('No se proporcionó un token de autenticación válido');
        } else {
            // Enviar una respuesta con un código de estado 500 Internal Server Error si ocurrió un error no previsto
            res.status(500).json('Ha ocurrido un error interno en el servidor');
        }
    });


    /*
    //VERIFICAR SI METODO POST ES A ESA URL
    app.use((req, res, next) => {
        // Verificar si la solicitud es un POST y si no es en la ruta correcta
        if (req.method === 'POST' && req.originalUrl !== '/api/v2/salary-stats') {
            res.status(405).json('Método no permitido');
            return;
        }

        // Enviar una respuesta con un código de estado 404 Not Found si la ruta no se encuentra
        res.status(404).json('La ruta solicitada no existe');
    });

    // Manejador de rutas no encontradas
    app.use((req, res) => {
        // Enviar una respuesta con un código de estado 404 Not Found si la ruta no se encuentra
        res.status(404).json('La ruta solicitada no existe');
    });

*/

};

export { loadBackend_angel_2 };