import Datastore from 'nedb'
var db = new Datastore;
//const BASE_API_URL = "/api/v2";
//const rutaMMS = BASE_API_URL + '/loss-jobs';
const API_DOC_PORTAL = 'https://documenter.getpostman.com/view/26052697/2s93XzwMYW';

//DATA MARIO
function loadBackend_mario_2(app) {
  var población_media = [
    { province: "Almeria", year: 2021, gender: "Ambos sexos", low_due_to_placement: 110379, no_renovation: 60831, other_reason: 22827 },
    { province: "Cadiz", year: 2022, gender: "Ambos sexos", low_due_to_placement: 246181, no_renovation: 124697, other_reason: 26756 },
    { province: "Sevilla", year: 2022, gender: "Ambos sexos", low_due_to_placement: 403262, no_renovation: 172309, other_reason: 27654 },
    { province: "Almeria", year: 2022, gender: "Hombres", low_due_to_placement: 51771, no_renovation: 27381, other_reason: 11507 },
    { province: "Cordoba", year: 2022, gender: "Mujeres", low_due_to_placement: 90524, no_renovation: 40810, other_reason: 8721 },
    { province: "Almeria", year: 2022, gender: "Mujeres", low_due_to_placement: 58608, no_renovation: 33450, other_reason: 11320 },
    { province: "Cordoba", year: 2022, gender: "Mujeres", low_due_to_placement: 90524, no_renovation: 40810, other_reason: 8721 },
    { province: "Sevilla", year: 2022, gender: "Mujeres", low_due_to_placement: 200597, no_renovation: 101940, other_reason: 13677 },
    { province: "Jaen", year: 2022, gender: "Mujeres", low_due_to_placement: 79768, no_renovation: 33345, other_reason: 10257 },
    { province: "Huelva", year: 2022, gender: "Mujeres", low_due_to_placement: 80325, no_renovation: 30317, other_reason: 9049 },
    { province: "Cadiz", year: 2022, gender: "Hombres", low_due_to_placement: 124802, no_renovation: 51697, other_reason: 14619 },
    { province: "Cordoba", year: 2022, gender: "Hombres", low_due_to_placement: 88957, no_renovation: 27166, other_reason: 11413 },
    { province: "Granada", year: 2022, gender: "Hombres", low_due_to_placement: 83366, no_renovation: 35666, other_reason: 9755 },
    { province: "Huelva", year: 2022, gender: "Hombres", low_due_to_placement: 68019, no_renovation: 21665, other_reason: 7518 },
    { province: "Sevilla", year: 2022, gender: "Hombres", low_due_to_placement: 195063, no_renovation: 70369, other_reason: 13977 }];


    
  db.insert(población_media);
  //console.log("Insertados datos al comenzar");

  const BASE_API_URL = "/api/v2";

  //Redirect /docs
  app.get(BASE_API_URL + "/loss-jobs/docs", (req, res) => {
    res.redirect(API_DOC_PORTAL);
  });


  app.post(BASE_API_URL + "/loss-jobs", (request, response) => {
    //var NewEvolution = request.body;
    const province = request.body.province;
    const year = request.body.year;
    console.log("New POST to /loss-jobs"); //console.log en el servidor
    db.find({}, function (err, filteredList) {

      if (err) {
        res.sendStatus(500, "CLIENT ERROR");
      }

      // Validar que se envíen todos los campos necesarios
      const requiredFields = ['province', 'year', 'gender', 'low_due_to_placement', 'no_renovation', 'other_reason'];
      for (const field of requiredFields) {
        if (!request.body.hasOwnProperty(field)) {
          return response.status(400).json(`Missing required field: ${field}`);
        }
      }
      // Verificar que la solicitud se hizo en la ruta correcta
      if (request.originalUrl !== '/api/v2/loss-jobs') {
        res.status(405).json('Método no permitido');
      } else {

        // Verificar si el recurso ya existe
        //const existingObject = población_media.find(obj => obj.province === province && obj.year === year);
        filteredList = filteredList.filter((obj) => {
          return (province == obj.province && year == obj.year)
        });
        //const existingObject = db.find({province : NewEvolution.province, year : NewEvolution.year});
        if (filteredList.length != 0) {
          // Si el recurso ya existe, devolver un código de respuesta 409
          response.status(409).json(`El recurso ya existe.`);
        } else {
          // Si el recurso no existe, agregarlo a la lista y devolver un código de respuesta 201
          db.insert(request.body);
          //población_media.push(request.body);
          response.sendStatus(201);
        }
      }
    });
  });




  //APARTADO CREAR 10 O MÁS DATOS RANDOM

  app.get(BASE_API_URL + "/loss-jobs/loadInitialData", (req, res) => {
    db.find({}, function (err, filteredList) {

      if (err) {
        res.sendStatus(500, "CLIENT ERROR");

      }
      console.log(filteredList);
      if (filteredList.length === 0) {
        for (var i = 0; i < población_media.length; i++) {
          db.insert(población_media[i]);
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
  //GET a loss-jobs
  app.get('/api/v2/loss-jobs', (req, res) => {
    const low_due_to_placement_behind = req.query.low_due_to_placement_behind;
    const no_renovation_behind = req.query.no_renovation_behind;
    const other_reason_over = req.query.other_reason_over;

    console.log("/GET loss-jobs");

    // Empezamos viendo los registros de la db y eliminamos el _id.
    db.find({}, { _id: 0 }, (err, filteredList) => {

      // Comprobamos los errores que han podido surgir
      if (err) {

        console.log(`Error getting loss-jobs`);

        // El estado es el 500 de Internal Server Error
        res.sendStatus(500);

        // Comprobamos si existen datos:
      } else if (filteredList.length == 0) {

        console.log(`Ruta loss-jobs Not Found`);

        // Si no existen datos usamos el estado es 404 de Not Found
        res.sendStatus(404);

      } else {

        // Tenemos que inicializar los valores necesarios para filtrar: tenemos que ver el limit y offset
        let i = -1;
        if (!req.query.offset) {
          var offset = -1;
        } else {
          var offset = parseInt(req.query.offset) - 1;
        }

        // Tenemos que filtrar los datos, para ver cada posible campo y devolver true si no se pasa en la query, 
        // y si es un parámetro en la query se comprueba la condicion
        let datos = filteredList.filter((x) => {
          return (((req.query.year == undefined) || (parseInt(req.query.year) === x.year)) &&
            ((req.query.from == undefined) || (parseInt(req.query.from) <= x.year)) &&
            ((req.query.to == undefined) || (parseInt(req.query.to) >= x.year)) &&
            ((req.query.province == undefined) || (req.query.province === x.province)) &&
            ((req.query.gender == undefined) || (req.query.gender === x.gender)) &&
            ((req.query.low_due_to_placement == undefined) || (parseInt(req.query.low_due_to_placement))) &&
            ((req.query.no_renovation == undefined) || (parseInt(req.query.no_renovation))) &&
            ((req.query.other_reason == undefined) || (parseInt(req.query.other_reason))));
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

          console.log(`loss-jobs not found`);
          // Estado 404: Not Found
          res.sendStatus(404);

          // Si por el contrario encontramos datos
        } else {
          if(low_due_to_placement_behind != undefined){
            datos = datos.filter((reg) => {
                return (reg.low_due_to_placement <= low_due_to_placement_behind);
            });
            if( no_renovation_behind != undefined){ // Si nos dan salaried_behind y average_salary_behind
                datos = datos.filter((reg) => {
                    return (reg.no_renovation <= no_renovation_behind);
                });
                if(other_reason_over != undefined){ // Si además nos dan un standard_deviation_over además del average_salary_behind
                    datos = datos.filter((reg) => {
                        return (reg.other_reason >= other_reason_over);
                    });
                }
            } else if( (no_renovation_behind == undefined) && (other_reason_over != undefined) ){ // Si nos dan salaried y standard_deviation_over pero no nos dan  average_salary_behind.
                datos = datos.filter((reg) => {
                    return (reg.other_reason >= other_reason_over);
                });
            }
            if(datos.length==1){
                console.log(`Showing the one resource`);
                res.status(200).json(datos[0]);
                return;
            }else{
                res.status(200).json(datos);
                console.log(`Showing resources behind a specified low_due_to_placement_behind`);
                return; // Ponemos el return para que terminen los ifs y no salte al siguiente else
            }
        }
        if(no_renovation_behind != undefined){ // Si no nos dan un low_due_to_placement_behind, pero sí un no_renovation_behind, entonces....
            datos = datos.filter((reg) => {
                return (reg.no_renovation <= no_renovation_behind);
            });
            if( other_reason_over != undefined){
                datos = datos.filter((reg) => {
                    return (reg.other_reason >= other_reason_over);
                });
            }
            if(datos.length==1){
                console.log(`Showing the only resource returned with a no_renovation_behind behind the one given.`);
                res.status(200).json(datos[0]);
                return;
            }
            console.log(`Showing resources behind a specified no_renovation_behind`);
            res.status(200).json(datos);
            return;
        }
        if(other_reason_over != undefined){
            datos = datos.filter((reg) => {
                return (reg.other_reason >= other_reason_over);
            });
            if(datos.length==1){
                console.log(`Showing the only resource returned with a other_reason over the one given.`);
                res.status(200).json(datos[0]);
                return;
            }
            console.log(`Showing resources over a specified other_reason`);
            res.status(200).json(datos);
            return;
        }
        else{

          console.log(`Datos de loss-jobs devueltos: ${datos.length}`);

          // Devolvemos dichos datos, estado 200: OK
          if (datos.length == 1 && req.query.offset == undefined && req.query.limit == undefined) {
            res.status(200).json(datos[0]);
            return;
          } else if(datos.length==1) {
            res.status(200).json(datos[0]);
            //console.log(datos.length)
          }else{
            res.status(200).json(datos);
            return;
          }

        }
      }
      }
    })
  });

  //MÉTODOS TABLA AZUL.
  const rutaBase = '/api/v2/loss-jobs';

  app.post(rutaBase, (request, response) => {
    //var NewEvolution = request.body;
    const province = request.body.province;
    const year = request.body.year;
    const gender = request.body.gender;
    const low_due_to_placement = request.body.low_due_to_placement;
    const no_renovation = request.body.no_renovation;
    const other_reason = request.body.other_reason;
    console.log("New POST to /loss-jobs"); //console.log en el servidor
    if (comprobar_tipos( province,gender,year,low_due_to_placement,no_renovation,other_reason) ) {
        response.sendStatus(400, "BAD REQUEST - INCORRECT PARAMETERS");
        console.log(`INCORRECT PARAMETER TYPE`);

    } else {
    db.find({}, function (err, filteredList) {

        if (err) {
            response.sendStatus(500, "CLIENT ERROR");
        }

        // Validar que se envíen todos los campos necesarios
        const requiredFields = ['province', 'year', 'gender', 'low_due_to_placement', 'no_renovation', 'other_reason'];
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
        if (request.originalUrl !== '/api/v2/loss-jobs') {
            response.status(405).json('Método no permitido');
        } else {

            // Verificar si el recurso ya existe
            //const existingObject = salario_medio.find(obj => obj.province === province && obj.year === year);
            filteredList = filteredList.filter((obj) => {
                return (province == obj.province && year == obj.year && gender == obj.gender)
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
  const rutaEspecifica = '/api/v2/loss-jobs/loadInitialData';
  app.post(rutaEspecifica, (req, res) => {
    res.status(405).json('El método POST no está permitido en esta ruta');
  });

  //CODIGO PARA PODER HACER GET A UNA CIUDAD ESPECÍFICA Y A UNA CIUDAD Y yearO CONCRETO.
  app.get('/api/v2/loss-jobs/:province', (req, res) => {
    const province = req.params.province.toLowerCase();
    const from = req.query.from;
    const to = req.query.to;
    const man = req.query.man;
    //const province = req.query.province;
    const year = req.query.year;
    const gender = req.query.gender;
    const low_due_to_placement = req.query.low_due_to_placement;
    const no_renovation = req.query.no_renovation;
    const other_reason = req.query.other_reason;

    db.find({}, function (err, filteredList) {
      if (err) {
        res.sendStatus(500, "Client Error");
      }
      if (from && to) {
        // Lógica para devolver los datos de la ciudad para el yearo especificado
        filteredList = filteredList.filter((obj) => {
          return (obj.province.toLowerCase() == province && obj.year >= from && obj.year <= to);
        });
        console.log(`/GET to /loss-jobs/${province}?from=${from}&to=${to}`); //console.log en el servidor
        filteredList.forEach((e) => {
          delete e._id;
        });
        res.status(200).json(filteredList);
      } else if (year) {
        filteredList = filteredList.filter((obj) => {
          return (obj.year == year && obj.province.toLowerCase() == province);
        });
        console.log(`/GET to /loss-jobs/${province}?${year}`); //console.log en el servidor
        filteredList.forEach((e) => {
          delete e._id;
        });
        res.status(200).json(filteredList);
      } else if (gender) {
        filteredList = filteredList.filter((obj) => {
          return (obj.gender == gender && obj.province.toLowerCase() == province);
        });
        console.log(`/GET to /loss-jobs/${province}?${gender}`); //console.log en el servidor
        filteredList.forEach((e) => {
          delete e._id;
        });
        res.status(200).json(filteredList);

      } else if (man) {
        filteredList = filteredList.filter((obj) => {
          return (obj.man == man && obj.province.toLowerCase() == province);
        });
        console.log(`/GET to /loss-jobs/${province}?${gender}`); //console.log en el servidor
        filteredList.forEach((e) => {
          delete e._id;
        });
        res.status(200).json(filteredList);
      } else if (low_due_to_placement) {
        filteredList = filteredList.filter((obj) => {
          return (obj.low_due_to_placement == low_due_to_placement && obj.province.toLowerCase() == province);
        });
        console.log(`/GET to /loss-jobs/${province}?${low_due_to_placement}`); //console.log en el servidor
        filteredList.forEach((e) => {
          delete e._id;
        });
        res.status(200).json(filteredList);
      } else if (no_renovation) {
        filteredList = filteredList.filter((obj) => {
          return (obj.no_renovation == no_renovation && obj.province.toLowerCase() == province);
        });
        console.log(`/GET to /loss-jobs/${province}?${no_renovation}`); //console.log en el servidor
        filteredList.forEach((e) => {
          delete e._id;
        });
        res.status(200).json(filteredList);
      } else if (other_reason) {
        filteredList = filteredList.filter((obj) => {
          return (obj.other_reason == other_reason && obj.province.toLowerCase() == province);
        });
        console.log(`/GET to /loss-jobs/${province}?${other_reason}`); //console.log en el servidor
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
        }
      }
    });
  });
  //CODIGO PARA PODER HACER UN GET A UNA CIUDAD Y FECHA ESPECÍFICA.
  app.get('/api/v2/loss-jobs/:province/:year', (req, res) => {
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


  //CODIGO PARA PODER HACER UN GET A UNA CIUDAD,FECHA Y GENERO ESPECÍFICA.
  app.get('/api/v2/loss-jobs/:province/:year/:gender', (req, res) => {
    const { province, year, gender } = req.params;
    db.find({}, function (err, filteredList) {

      if (err) {
        res.sendStatus(500, "Client Error");
      }
      // Buscamos las estadísticas para el territorio y el año indicados
      filteredList = filteredList.filter((obj) => {
        return (obj.province.toLowerCase() == province.toLowerCase() && obj.year === parseInt(year) && obj.gender === gender);
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
  //CODIGO PARA ACTUALIZAR MEDIANTE PUT UNA RUTA CONCRETA.
  app.put('/api/v2/loss-jobs/:province/:year/:gender', (req, res) => {
    const province = req.params.province;
    const year = parseInt(req.params.year);
    const provincebody = req.body.province;
    const yearbody = req.body.year;
    const body = req.body;
    const gender = req.params.gender;
    const genderbody = req.body.gender;
    db.find({}, function (err, filteredList) {

      if (err) {
        res.sendStatus(500, "Client Error");
      }
      filteredList = filteredList.filter((obj) => {
        return (obj.province === province && obj.year === year && obj.gender == gender);
      });
      if (!filteredList || province !== provincebody || year !== yearbody || gender !== genderbody) {
        return res.status(400).json('Estadística errónea');
      } else {
        filteredList.gender = req.body.gender || filteredList.gender;
        filteredList.low_due_to_placement = req.body.low_due_to_placement || filteredList.low_due_to_placement;
        filteredList.no_renovation = req.body.no_renovation || filteredList.no_renovation;
        filteredList.other_reason = req.body.other_reason || filteredList.other_reason;

        db.update({ $and: [{ province: String(province) }, { year: parseInt(year) }] }, { $set: body }, {}, function (err, numUpdated) {
          if (err) {
            res.sendStatus(500, "INTERNAL SERVER ERROR");
          } else {
            res.sendStatus(200, "UPDATED");
          }
        });
      }
    });
  });

  //CODIGO PARA ACTUALIZAR MEDIANTE PUT UNA CIUDAD
  app.put('/api/v2/loss-jobs/:province', (req, res) => {
    const province = req.params.province;
    const provincebody = req.body.province;
    const body = req.body;
    db.find({}, function (err, filteredList) {

      if (err) {
        res.sendStatus(500, "Client Error");
      }
      filteredList = filteredList.filter((obj) => {
        return (obj.province === province);
      });
      if (filteredList.length === 0 || province !== provincebody) {
        return res.status(400).json('Estadística errónea');
      } else {
        db.update({ province: String(province) }, { $set: body }, { multi: true }, function (err, numUpdated) {
          if (err) {
            res.sendStatus(500, "INTERNAL SERVER ERROR");
          } else {
            res.sendStatus(200, "UPDATED");
          }
        });
      }
    });
  });

  //METODO DELETE PARA LA RUTA BASE PARA BORRAR DATO ESPECÍFICO.
  app.delete(BASE_API_URL + "/loss-jobs", (req, res) => {
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
        const { year, province } = req.body;
        db.find({}, function (err, filteredList) {

          if (err) {
            res.sendStatus(500, "Client Error");
          }
          // Buscar el objeto en la matriz población_media
          filteredList = filteredList.filter((obj) => {
            return (obj.province === province && obj.year === year);
          });
          db.remove({ province: province, year: year }, {}, (err, numRemoved) => {
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

  //DELETE PARA UNA RUTA ESPECÍFICA DE UNA CIUDAD.
  app.delete('/api/v2/loss-jobs/:province/:year/:gender', (req, res) => {
    const province = req.params.province;
    const year = req.params.year;
    const gender = req.params.gender;
    db.find({}, function (err, filteredList) {

      if (err) {
        res.sendStatus(500, "Client Error");
      }
      //const filteredStats = población_media.filter(stats => stats.province === province);
      filteredList = filteredList.filter((obj) => {
        return (obj.province === province && obj.year === parseInt(year) && obj.gender === gender);
      });
      if (filteredList.length === 0) {
        res.status(404).json(`No se encontraron datos para ${province}`);
      } else {
        filteredList = filteredList.filter((obj) => { return (obj.province === province && obj.year === parseInt(year) && obj.gender === gender); });

        if (filteredList) {
          db.remove({ province: province, year: parseInt(year), gender: gender }, { multi: true }, (err, numRemoved) => {
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
  function comprobar_tipos(province, year, gender, low_due_to_placement, no_renovation, other_reason) { //Esta función es para comprobar que los datos introducidos en el POST son correctos.
    return ( typeof province !== "string" ||
        typeof year !== "number" ||
        typeof gender !== "string" ||
        typeof low_due_to_placement !== "number" ||
        typeof no_renovation !== "number" ||
        typeof other_reason !== "number");
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

}

export { loadBackend_mario_2 };