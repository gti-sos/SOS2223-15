var Datastore = require('nedb'), db = new Datastore;
const BASE_API_URL = "/api/v1";
const rutaMMS = BASE_API_URL + '/loss-jobs';
const API_DOC_PORTAL = '';

//DATA MARIO

    var población_media = [
        {province: "Almería", year: 2021, gender:"Ambos sexos",  low_due_to_placement: 110379, no_renovation: 60831, other_reason: 22827},
        {province:"Cadíz", year: 2022, gender:"Ambos sexos",  low_due_to_placement:246181, no_renovation:124697, other_reason:26756},
        {province:"Sevilla", year:2022, gender:"Ambos sexos",  low_due_to_placement:403262, no_renovation:172309, other_reason:27654},
        {province:"Almería", year:2022, gender:"Hombres",  low_due_to_placement:51771, no_renovation:27381, other_reason:11507},
        {province:"Córdoba", year:2022, gender:"Mujeres",  low_due_to_placement:90524, no_renovation:40810, other_reason:8721},
        {province:"Almería", year:2022, gender:"Mujeres",  low_due_to_placement:58608, no_renovation:33450, other_reason:11320},
        {province:"Córdoba",year:2022, gender:"Mujeres",  low_due_to_placement:90524, no_renovation:40810, other_reason:8721},
        {province:"Sevilla",year:2022, gender:"Mujeres",  low_due_to_placement:200597, no_renovation:101940, other_reason:13677},
        {province:"Jaén", year:2022, gender:"Mujeres",  low_due_to_placement:79768, no_renovation:33345, other_reason:10257},
        {province:"Huelva",year:2022, gender:"Mujeres",  low_due_to_placement:80325, no_renovation:30317, other_reason:9049},
        {province:"Cadíz",year:2022, gender:"Hombres",  low_due_to_placement:124802, no_renovation:51697, other_reason:14619},
        {province:"Córdoba",year:2022, gender:"Hombres",  low_due_to_placement:88957, no_renovation:27166, other_reason:11413},
        {province:"Granada",year:2022, gender:"Hombres",  low_due_to_placement:83366, no_renovation:35666, other_reason:9755},
        {province:"Huelva",year:2022, gender:"Hombres",  low_due_to_placement:68019, no_renovation:21665, other_reason:7518},
        {province:"Sevilla",year:2022, gender:"Hombres",  low_due_to_placement:195063, no_renovation:70369, other_reason:13977}];

   
    
        module.exports.register = (app, db) => {

          app.get(rutaMMS + "/loadInitialData", (req, res) => {
      
              db.find({}, function (err, filteredList) {
                  if (err) {
                      res.sendStatus(500, "INTERNAL SERVER ERROR");
                      return;
                  }
                  if (filteredList == 0) {
                      for (var i = 0; i < población_media.length; i++) {
                          db.insert(población_media[i]);
                      }
                      res.sendStatus(200, "OK.")
                      return;
                  }else{
                  res.sendStatus(200, "INITIALIZED")
              }
              });
          })
      
      
          //Redirect /docs
          app.get(BASE_API_URL+"/loss-jobs/docs",(req,res)=>{
            res.redirect(API_DOC_PORTAL);
          });
      
      
          app.get(rutaMMS, (req, res) => {
      
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
      
          app.get(rutaMMS + "/:province", (req, res) => {
      
              var province = req.params.province
              var from = req.query.from;
              var to = req.query.to;
      
      
              for (var i = 0; i < Object.keys(req.query).length; i++) {
                  var element = Object.keys(req.query)[i];
                  if (element != "from" && element != "to") {
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
      
                  filteredList = filteredList.filter((reg) => {
                      return (reg.province == province);
                  });
      
                  var from = req.query.from;
                  var to = req.query.to;
      
                  if (from > to) {
                      res.sendStatus(400, "BAD REQUEST");
                      return;
                  }
      
                  if (from != null && to != null && from <= to) {
                      filteredList = filteredList.filter((reg) => {
                          return (reg.year >= from && reg.year <= to);
                      });
      
                  }
      
                  if (filteredList == 0) {
                      res.sendStatus(404, "NO EXIST");
                      return;
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
      
      
          app.get(rutaMMS + "/:province/:year", (req, res) => {
      
              var province = req.params.province
              var year = req.params.year
      
              db.find({}, function (err, filteredList) {
      
                  if (err) {
                      res.sendStatus(500, "INTERNAL SERVER ERROR");
                      return;
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
          })
      
      
          app.post(rutaMMS, (req, res) => {
      
              if (comprobar_body(req)) {
                  res.sendStatus(400, "BAD REQUEST - INCORRECT PARAMETERS");
              } else {
                  db.find({}, function (err, filteredList) {
      
                      if (err) {
                          res.sendStatus(500, "INTERNAL SERVER ERROR");
                          return;
                      }
      
                      filteredList = filteredList.filter((reg) => {
                          return (req.body.province == reg.province && req.body.year == reg.year)
                      })
      
                      if (filteredList.length != 0) {
                          res.sendStatus(409, "CONFLICT");
                      } else {
                          db.insert(req.body);
                          res.sendStatus(201, "CREATED");
                      }
                  })
              }
          })
      
      
          app.post(rutaMMS + "/:province", (req, res) => {
              res.sendStatus(405, "METHOD NOT ALLOWED");
          })
      
      
          app.put(rutaMMS, (req, res) => {
              res.sendStatus(405, "METHOD NOT ALLOWED");
          })
      
      
          app.put(rutaMMS + "/:province/:year", (req, res) => {
      
      
              if (comprobar_body(req)) {
                  res.sendStatus(400, "BAD REQUEST - INCORRECT PARAMETERS");
                  return;
              }
              var provinceR = req.params.province;
              var yearR = req.params.year;
              var body = req.body;
      
              db.find({}, function (err, filteredList) {
                  if (err) {
                      res.sendStatus(500, "INTERNAL SERVER ERROR");
                      return;
                  }
      
      
                  filteredList = filteredList.filter((reg) => {
                      return (reg.province == provinceR && reg.year == yearR);
                  });
                  if (filteredList == 0) {
                      res.sendStatus(404, "NO EXIST");
                      return;
                  }
      
      
      
                  if (provinceR != body.province || yearR != body.year) {
                      res.sendStatus(400, "BAD REQUEST");
                      return;
                  }
      
      
      
                  db.update({$and:[{province: String(provinceR)}, {year: parseInt(yearR)}]}, {$set: body}, {},function(err, numUpdated) {
                      if (err) {
                          res.sendStatus(500, "INTERNAL SERVER ERROR");
                      }else{
                          res.sendStatus(200,"UPDATED");
                      }
                  });
              })
          })
      
      
      
          app.delete(rutaMMS,(req, res)=>{
              db.remove({}, { multi: true }, (err, numRemoved)=>{
                  if (err){
                      res.sendStatus(500,"INTERNAL SERVER ERROR");
                      return;
                  }
                  res.sendStatus(200,"DELETED");
                  return;
              });
          })
      
      
      
          app.delete(rutaMMS+"/:province/:year",(req, res)=>{
              var province = req.params.province;
              var year = req.params.year;
      
              db.find({province: province, year: parseInt(year)}, {}, (err, filteredList)=>{
                  if (err){
                      res.sendStatus(500,"INTERNAL SERVER ERROR");
                      return;
                  }
                  if(filteredList==0){
                      res.sendStatus(404,"NOT FOUND");
                      return;
                  }
                  db.remove({province: province, year: year}, {}, (err, numRemoved)=>{
                      if (err){
                          res.sendStatus(500,"INTERNAL SERVER ERROR");
                          return;
                      }
                  
                      res.sendStatus(200,"DELETED");
                      return;
                  });
              });
      
          })
      
      
      
          function comprobar_body(req) {
              return (req.body.province == null |
                  req.body.year == null |
                  req.body.gender == null |
                  req.body.low_due_to_placement == null |
                  req.body.no_renovation == null |
                  req.body.other_reason == null);
          }
      
          function paginacion(req, lista){
      
              var res = [];
              const limit = req.query.limit;
              const offset = req.query.offset;
              
              if(limit < 1 || offset < 0 || offset > lista.length){
                  res.push("INCORRECT PARAMETERS");
                  return res;
              }
      
              res = lista.slice(offset,parseInt(limit)+parseInt(offset));
              return res;
      
          }
      }