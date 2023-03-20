var Datastore = require('nedb')
db = new Datastore;


const BASE_API_URL = "/api/v1";
const recurso_amr = BASE_API_URL + '/andalusian-population-salary-stats';
const API_DOC_PORTAL = "https://documenter.getpostman.com/view/26059557/2s93JzMgXR";

module.exports = (app) => {

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



    // GETs ------------------------------


    //GET a ruta loadInitialData (crea datos si no los hay ya creados).
    var crea_datos = [];


    app.get(recurso_amr + "/loadInitialData", (request, response) => {
        console.log("New loadInitialData Request to /andalusian-population-salary-stats")
        db.find({}, function (err, initialData) {
            if (err) { //Si ocurre un error al hacer la petición a la base de datos...
                response.sendStatus(500, "INTERNAL SERVER ERROR");
            } else { //Si todo va bien...
                if (initialData == 0) {
                    for (var i = 0; i < salario_medio.length; i++) {
                        db.insert(salario_medio[i]);
                    }
                    //response.sendStatus(200, "OK.")
                    response.json(initialData)
                } else {
                    //response.sendStatus(200, "INITIALIZED")
                    response.json(initialData.map((c) => {
                        delete c._id;
                        return c;
                    }))
                }
            }
        })
    });

    //Redirect /docs
    app.get(BASE_API_URL+"/andalusian-population-salary-stats/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });

    // GETs al recurso de varias formas. Teniendo en cuenta querys y sin tenerlas en cuenta. No están por separado porque puede funcionar
    // mal (a veces se ejecuta un get antes que otro y no devuelve el resultado esperado, será por el orden de ejecución de JS)

    /*
    app.get(recu, (req, res) => {
        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;

        for (var i = 0; i < Object.keys(req.query).length; i++) {
            var element = Object.keys(req.query)[i];
            if (element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset") {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }
        if (from > to) {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }
        db.find({}, function (err, filteredList) {

            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            if (year != null) {
                var filteredList = filteredList.filter((reg) => {
                    return (reg.year == year);
                });
                if (filteredList == 0) {
                    res.sendStatus(404, "NO EXIST");
                    return;
                }
            }
            if (from != null && to != null) {
                filteredList = filteredList.filter((reg) => {
                    return (reg.year >= from && reg.year <= to);
                });

                if (filteredList == 0) {
                    res.sendStatus(404, "NO EXIST");
                    return;
                }
            }
            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = paginacion(req, filteredList);
            }
            filteredList.forEach((element) => {
                delete element._id;
            });
            res.send(JSON.stringify(filteredList, null, 2));
        })
    })
    */


    /*
        app.get(recurso_amr, (request, response) => {
            const from = request.query.from; //Con el .query, cogemos todos los datos de la query de la url, es decir, lo que viene en la url tras la ? (url?year=2021)
            const to = request.query.to;
    
            //GET con rango de fechas si se especifica uno
            if (from && to) {
                const datosRango = salario_medio.filter(x => { return x.year >= from && x.year <= to });
                //GET de datos del periodo
                if (from >= to) {
                    response.status(400).json("El rango es erróneo");
                } else {
                    response.status(200).json(datosRango);
                    console.log(`New GET to /andalusian-population-salary-stats?from${from}&to${to}`);
                }
            } else {
                const year = request.query.year;
                //GET de datos de un año dado en la query (con la ?year=algo en la url)
                if (year) {
                    const datosAño = salario_medio.filter(x => x.year === parseInt(year));
                    response.status(200).json(datosAño);
                    console.log(`New GET to /andalusian-population-salary-stats from ${year}`);
                } else {
                    //GET de datos del recurso entero
                    console.log(`New GET to /andalusian-population-salary-stats`);
                    response.status(200).json(salario_medio);
                }
            }
        });
    
    */


    //Get filtrando por provincia, por género o por año
    app.get(recurso_amr, (req, res) => {
        var province = req.query.province
        var gender = req.query.gender
        var year = req.query.year
        console.log("New GET to /andalusian-population-salary-stats")

        db.find({}, function (err, filteredList) {

            if (province == undefined && gender == undefined && year == undefined) { //GET sin ningún filtro en la query.

                if (err) {
                    console.log(`Error getting contacts ${err}`);
                    res.sendStatus(500);
                } else {
                    res.json(filteredList);
                }

            } else if (province != undefined && gender == undefined && year == undefined) { //Si no se da un año ni género, filtramos por provincia.

                filtro_province(req, res, err, filteredList, province, gender, year);

            } else if (province == undefined && gender == undefined && year != undefined) { //Si no se da una provincia, filtramos por año.

                filtro_year(req, res, err, filteredList, province, gender, year);

            } else if (province == undefined && gender != undefined && year == undefined) { //Filtramos por género.

                filtro_gender(req, res, err, filteredList, province, gender, year);

            } else if (province != undefined && gender != undefined && year == undefined) { //Filtramos por provincia y género.

                filtro_province_gender(req, res, err, filteredList, province, gender, year);

            } else if (province != undefined && gender == undefined && year != undefined) { //Filtramos por provincia y año.

                filtro_province_year(req, res, err, filteredList, province, gender, year);

            } else if (province == undefined && gender != undefined && year != undefined) { //Filtramos por género y año

                filtro_gender_year(req, res, err, filteredList, province, gender, year);

            }
            else if (province != undefined && gender != undefined && year != undefined) { //Filtramos por provincia,género y año.

                filtro_province_gender_year(req, res, err, filteredList, province, gender, year);

            }
        })
    });

    //---------Funciones auxiliares para el método get de arriba-------

    function filtro_province(req, res, err, filteredList, province, gender, year) {
        if (err) {
            res.sendStatus(500, "INTERNAL SERVER ERROR");
        }
        filteredList = filteredList.filter((reg) => {
            return (reg.province == province);
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NO EXIST");
        }
        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = paginacion(req, filteredList);
            res.send(JSON.stringify(filteredList, null, 2));
        }
        filteredList.forEach((element) => {
            delete element._id;
        });
        res.send(JSON.stringify(filteredList, null, 2));
    }

    function filtro_year(req, res, err, filteredList, province, gender, year) {


        if (err) {
            res.sendStatus(500, "INTERNAL SERVER ERROR");
        }
        filteredList = filteredList.filter((reg) => {
            return (reg.year == parseInt(year));
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NO EXIST");
            return;
        }
        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = paginacion(req, filteredList);
            res.send(JSON.stringify(filteredList, null, 2));
        }
        filteredList.forEach((element) => {
            delete element._id;
        });
        res.send(JSON.stringify(filteredList, null, 2));
    }

    function filtro_gender(req, res, err, filteredList, province, gender, year) {
        if (err) {
            res.sendStatus(500, "INTERNAL SERVER ERROR");
        }
        filteredList = filteredList.filter((reg) => {
            return (reg.gender == gender);
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NO EXIST");
            return;
        }
        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = paginacion(req, filteredList);
            res.send(JSON.stringify(filteredList, null, 2));
        }
        filteredList.forEach((element) => {
            delete element._id;
        });
        res.send(JSON.stringify(filteredList, null, 2));
    }

    function filtro_province_gender(req, res, err, filteredList, province, gender, year) {
        if (err) {
            res.sendStatus(500, "INTERNAL SERVER ERROR");
        }
        filteredList = filteredList.filter((reg) => {
            return (reg.province == province);
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NO EXIST");
            return;
        }
        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = paginacion(req, filteredList);
            res.send(JSON.stringify(filteredList, null, 2));
        }
        filteredList.forEach((element) => {
            delete element._id;
        });
        res.send(JSON.stringify(filteredList, null, 2));
    }

    function filtro_province_year(req, res, err, filteredList, province, gender, year) {
        if (err) {
            res.sendStatus(500, "INTERNAL SERVER ERROR");
        }
        filteredList = filteredList.filter((reg) => {
            return (reg.province == province && reg.year == parseInt(year));
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NO EXIST");
            return;
        }
        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = paginacion(req, filteredList);
            res.send(JSON.stringify(filteredList, null, 2));
        }
        filteredList.forEach((element) => {
            delete element._id;
        });
        res.send(JSON.stringify(filteredList, null, 2));
    }

    function filtro_gender_year(req, res, err, filteredList, province, gender, year) {
        if (err) {
            res.sendStatus(500, "INTERNAL SERVER ERROR");
        }
        filteredList = filteredList.filter((reg) => {
            return (reg.province = province && reg.gender == gender && reg.year == year);
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NO EXIST");
            return;
        }
        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = paginacion(req, filteredList);
            res.send(JSON.stringify(filteredList, null, 2));
        }
        filteredList.forEach((element) => {
            delete element._id;
        });
        res.send(JSON.stringify(filteredList, null, 2));
    }

    function filtro_province_gender_year(req, res, err, filteredList, province, gender, year) {
        if (err) {
            res.sendStatus(500, "INTERNAL SERVER ERROR");
        }

        filteredList = filteredList.filter((reg) => {
            return (reg.province == province && reg.year == year);
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NO EXIST");
            return;
        }

        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = paginacion(req, filteredList);
            res.send(JSON.stringify(filteredList, null, 2));
        }
        filteredList.forEach((element) => {
            delete element._id;
        });
        res.send(JSON.stringify(filteredList, null, 2));
    }


    //GETs con parámetros en la URL--------

    app.get(recurso_amr + "/:province/:year", (req, res) => {

        var province = req.params.province
        var year = req.params.year

        db.find({}, function (err, filteredList) {

            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
            }

            filteredList = filteredList.filter((reg) => {
                return (reg.province == province && reg.year == year);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NO EXIST");
                return;
            }

            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = paginacion(req, filteredList);
                res.send(JSON.stringify(filteredList, null, 2));
            }
            filteredList.forEach((element) => {
                delete element._id;
            });
            res.send(JSON.stringify(filteredList[0], null, 2));
        });
    });

    app.get(recurso_amr + "/:year", (request, response) => {
        const year = request.params.year.slice([5]); // Con esto, obtenemos el valor de la clave "year" de la url, si es que se le pasa dicho parámetro al realizar la petición (en realidad devuelve "year=año", por eso se hace el slicing)
        if (year != undefined) {
            response.json(salario_medio.filter(m => m.year == year));
            console.log(`New Get to /andalusian-population-salary-stats filtering by year (${year})`);
            response.sendStatus(200);
        }
        else {
            response.json(salario_medio);
            console.log("New GET to /andalusian-population-salary-stats", year);
            response.sendStatus(200);
        }
    });



    //POSTs -----------------------------------------------------

    //POST al recurso
    app.post(recurso_amr, (request, response) => {
        var newEntry_amr = request.body;
        console.log(`newEntry = ${JSON.stringify(newEntry_amr, null, 2)}`);
        console.log("New POST to /andalusian-population-salary-stats");

        db.find({ province: newEntry_amr.province, gender: newEntry_amr.gender, year: newEntry_amr.year }, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
            } else {
                filteredList = filteredList.filter((reg) => {
                    return (req.body.province == reg.province && req.body.gender == reg.gender)
                })
            }
        });
        db.insert(newEntry_amr);
        response.sendStatus(201).send('Nuevo dato creado correctamente');
    });

    app.post(recurso_amr + "/:province", (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    });

    //No se puede hacer POST a loadInitialData
    app.post(recurso_amr + "/loadInitialData", (request, response) => {
        response.sendStatus(405).send('No se permite hacer un POST en esta ruta');
    });


   //PUTs ----------------------------------------------


    //PUT a un recurso (un dato concreto)

    /*
    app.put(recurso_amr + "/:province/:gender/:year", (request, response) => {
        const { province, gender, year } = request.params;
        var body = request.body;
        var updated = false;

        if (body.province === province && body.gender === gender && body.year === parseInt(year)) { // verifica si los valores de año coinciden
            people = people.map(x => {
                if (x.province === province && x.gender === gender && x.year === parseInt(year)) {
                    x.salaried = body.salaried;
                    x.average_salary = body.average_salary;
                    x.standard_deviation = body.standard_deviation;
                    updated = true;
                }
                return x;
            });

            if (updated) {
                console.log(`New PUT a /andalusian-population-salary-stats/${province}/${gender}/${year}`);
                response.status(200).send("Actualizado");
            } else {
                console.log("No se ha encontrado el dato");
                response.status(400).send("No se ha encontrado el dato");
            }
        } else {
            console.log("Los datos de la URL no coinciden con los datos de la solicitud");
            response.status(400).send(`Los datos de la URL no coinciden con los datos de la solicitudddd ${province} ${year} ${body.year} ${body.province}`); //Esto se mostrará en Postman cuando se haga una petición.
        }
    });
    */


 

    //PUT a la colección está prohibido.
    app.put(recurso_amr, (request, response) => {
        response.sendStatus(405).send('Method not allowed');
    });

    //PUT a un recurso.

    app.put(recurso_amr + "/:province/:gender/:year", (req, res) => {
        if (comprobar_body(req)) {
            res.sendStatus(400, "BAD REQUEST - INCORRECT PARAMETERS");
            return;
        }
        var province = req.params.province;
        var gender = req.params.gender;
        var year = req.params.year;
        var body = req.body;

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            filteredList = filteredList.filter((reg) => {
                return (reg.province == province && reg.gender == gender && reg.year == year);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NO EXIST");
                return;
            }
            if (province != body.province || gender != body.gender || year != body.year) {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
            db.update({$and:[{"province": String(province)},{"gender" : String(gender)}, {"year": parseInt(year)}]}, {$set: body}, {},function(err, numUpdated) {
                if (err) {
                    res.sendStatus(500, "INTERNAL SERVER ERROR");
                }else{
                    res.sendStatus(200,"UPDATED");
                }
            });
        })
    })




     //DELETE a un recurso

     app.delete(recurso_amr+"/:province/:gender/:year",(req, res)=>{
        var province = req.params.country;
        var gender = req.params.country;
        var year = req.params.year;

        db.find({province: province, gender : gender, year: parseInt(year)}, {}, (err, filteredList)=>{
            if (err){
                res.sendStatus(500,"INTERNAL SERVER ERROR");
                return;
            }
            if(filteredList==0){
                res.sendStatus(404,"NOT FOUND");
                return;
            }
            db.remove({province: province, gender : gender, year: parseInt(year)}, {}, (err, numRemoved)=>{
                if (err){
                    console.log(`Error deleting entry : ${province, gender, year}:${err} `)
                    res.sendStatus(500,"INTERNAL SERVER ERROR");
                    return;
                }
                console.log(`Removed entry ${entryRemoved}`)
                res.sendStatus(200,"DELETED");
                return;
                
            });
        });

    });

    //DELETE a la colección.
    app.delete(recurso_amr,(req, res)=>{
        db.remove({}, { multi: true }, (err, numRemoved)=>{
            if (err){
                console.log(`Error deleting /andalusian-population-salary-stats`);
                res.sendStatus(500,"INTERNAL SERVER ERROR");
                return;
            }
            console.log(`Data removed ${numRemoved}`);
            res.sendStatus(200,"DELETED");
            return;
        });
    });


   

    /*
        var filtro = salario_medio.filter(function(arr) {
            return arr[0].match("Almería");
        });
        
        var resultado = filtro.reduce((acc, curr) => {return acc + curr[4];}, 0)/filtro.length;
        
        app.get("/samples/AMR", (request, response)=> {
            response.send(`La media del salario medio entre ambos géneros en la provincia de ${filtro[0][0]} es ${resultado}`);
            console.log(resultado);
        });
        */

    function paginacion(req, lista) { //lista tendrá la lista que le pasemos al llamar a esta función en otros métodos de la API
        var res = [];
        const limit = req.query.limit;
        const offset = req.query.offset;
        if (limit < 1 || offset < 0 || offset > lista.length) {
            res.push("INCORRECT PARAMETERS");
            return res;
        }
        res = lista.slice(offset, parseInt(limit) + parseInt(offset)); //Spliteamos la lista slice(elemento por el que spliteamos, límite hasta donde devolveremos al hacer el split)
        return res;

    }

    function comprobar_body(req) {
        return (req.body.province == null |
            req.body.gender == null |
            req.body.year == null |
            req.body.salaried == null |
            req.body.average_salary == null |
            req.body.standard_deviation == null);
    }

};