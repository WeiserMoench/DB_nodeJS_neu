const express = require('express')
const app = express()
const port = 3000

const config = require('./config');
const db = require('./db');
//const Cred = require('web/Cred.js');


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/db', (req, res, next) => {
    const sql = `SELECT * FROM adbkt.reg where id=?`;
    var dbid = req.query.dbid;
    console.log(`dbid: ${dbid}`);
    const params = [dbid];
    db.readFromHdb(
        config.hdb,
        sql,
        params,
        rows => res.type('application/json').send(rows),
        info => console.log(info)
    );
});

app.get('/tanka', (req, res, next) => {
    const sql = `Select BRAND, Street, House_Number, Post_Code, City, Dis from Import_Tankstellen as Tabelle1 INNER JOIN (SELECT UUID, DIS from (Select UUID, NEW ST_Point('POINT('|| latitude || ' '|| longitude ||' )', 4326).ST_Distance(new ST_Point('Point( `+ req.query.lat + ` ` + req.query.lng + `)', 4326), 'kilometer')AS DIS FROM IMPORT_Tankstellen) where DIS <=`+ req.query.distance+`) as Tabelle2 ON Tabelle1.UUID = Tabelle2.UUID ORDER BY Dis ASC`;// SELECT * FROM U558587.IMPORT_TANKSTELLEN where LATITUDE=? and LONGITUDE=?
    console.log(req.query);
    var lat = req.query.lat;
    var lng = req.query.lng;
    var distance = req.query.distance;
    console.log(`lat: ${lat}`);
    console.log(`lng: ${lng}`);
    console.log(`distance: ${distance}`);
    params =[];
    db.readFromHdb(
        config.hdb,
        sql,
        params,
        rows => res.type('application/json').send(rows),
        info => console.log("Test 1")
    );

});

//diese Methode fragt bei der Datenbank die zurück zu legende Route ab
app.get('/route', (req, res, next) => {
    const sql = ``;
    var latStart = req.query.latStart;
    var lngStart = req.query.lngStart;
    var latStop = req.query.latStop;
    var lngStop = req.query.lngStop;
    console.log(`latStart: ${latStart}`);
    console.log(`lngStart: ${lngStart}`);
    console.log(`latStop: ${latStop}`);
    console.log(`lngStop: ${lngStop}`);
    params =[];
    db.readFromHdb(
        config.hdb,
        sql,
        params,
        rows => res.type('application/json').send(rows),
        info => console.log(info)
    );

});

app.get('/mult', (req, res, next) => {
    res.send(`${req.query.num1 * req.query.num2}`);
});

app.get('/', (req, res, next) => {
    res.send(`Hallo Welt`);
});

app.get('/reset', (req, res, next) => {
    const sql1 = `DELETE FROM U558587.Import_Tankstellen`;
    const params = [];
    db.writeIntoHdb(
        config.hdb,
        sql1,
        params,
        console.log("Inhalt der Tabelle Import gelöscht"),
    )
});


app.get('/import', (req, res, next) => {

    const parse = require('csv-parse');
    var request = require('request');

    var url = 'https://dev.azure.com/tankerkoenig/362e70d1-bafa-4cf7-a346-1f3613304973/_apis/git/repositories/0d6e7286-91e4-402c-af56-fa75be1f223d/Items?path=%2Fstations%2Fstations.csv&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=master&download=true&resolveLfs=true&%24format=octetStream&api-version=5.0-preview.1'

    request.get(url , function (error, response, body) { //
        if (!error && response.statusCode == 200) {
            var csv = body;
            const output = []
            parse(
                csv
            , {
                trim: true,
                skip_empty_lines: true,
                    from_line: 2
                })
               .on('readable', function(){
                    let record
                    while (record = this.read()) {
                        output.push(record)
                    }
                })
                .on('end', function(){

                    var sql = 'Insert into U558587.Import_Tankstellen VALUES (?,?,?,?,?,?,?,?,?)';
                    //console.log(`output: ${output}`);
                    var params = output;

                    db.writeIntoHdb(
                        config.hdb,
                        sql,
                        params,
                    )

                })

        }
    });


    console.log("Import_Tankstellen wurde aufgerufen")
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


//Methode läd alle Haltestellen des VBB Netzes herunter und fügt sie in die Datenbanktabelle "Haltestellen_VBB" im Benutzer U558587 ein
app.get('/importVBB', (req, res, next) => {

    const parse = require('csv-parse');
    var request = require('request');

    var url = 'http://127.0.0.1/stops.txt';
    request.get(url , function (error, response, body) { //
        if (!error && response.statusCode == 200) {
            console.log("Code 200");
            var csv = body;
            const output = []
            parse(
                csv
                , {
                    delimiter: ',',
                    trim: true,
                    skip_empty_lines: true,
                    from_line: 2
                })
                .on('readable', function(){
                    let record
                    while (record = this.read()) {
                        output.push(record)
                    }
                })
                .on('end', function(){

                    var sql = 'Insert into U558587.Haltestellen_VBB (stop_id,stop_code,stop_name,stop_desc,stop_lat,stop_lon,location_type,parent_station,wheelchair_boarding) VALUES (?,?,?,?,?,?,?,?,?)';
                    console.log(`output: ${output}`);
                    var params = output;

                    db.writeIntoHdb(
                        config.hdb,
                        sql,
                        params,
                    )

                })

        }
    });


    console.log("ImportVBB wurde aufgerufen")
});

//Methode lädt alle S und U Haltestellen Berlins herunter und fügt sie in die Datenbanktabelle "Nodes" im Benutzer U558587 ein
app.get('/importBerlin', (req, res, next) => {

    const parse = require('csv-parse');
    var request = require('request');

    var url = 'http://127.0.0.1:8081/ressources/S_U_Bahnhoefe_v2.csv';
    request.get(url , function (error, response, body) { //
        if (error) { console.log("error line 201") }
        console.log("status code " + response.statusCode)
        if (!error && response.statusCode == 200) {
            console.log("Code 200");

            var csv = body;
            const output = []
            parse(
                csv
                , {
                    delimiter: ';',
                    trim: true,
                    skip_empty_lines: true,
                    from_line: 2
                })
                .on('readable', function(){
                    let record
                    while (record = this.read()) {
                        output.push(record)
                    }
                })
                .on('end', function(){

                    var sql = 'Insert into U558587.Nodes (\"stop_name\", \"stop_lat\", \"stop_long\", \"coordinate\") VALUES (?,?,?,?)';
                    console.log(`output: ${output}`);
                    var params = output;

                    db.writeIntoHdb(
                        config.hdb,
                        sql,
                        params,
                    )

                })

        }
    });


    console.log("ImportBerlin Nodes Tabelle wurde aufgerufen")
});

function importEdgeFromFile( url) {

    const hanaClient = require("@sap/hana-client");
    const connection = hanaClient.createConnection();

    const parse = require('csv-parse');
    var request = require('request');

    // var url = 'http://127.0.0.1:8081/ressources/linien/s_bahn_linien.txt';
  //  var url = 'http://graphics.cs.uni-magdeburg.de/misc/s_bahn_linien_neu.txt';
    request.get(url , function (error, response, body) { //
        if (error) { console.log("error line 201") }
        console.log("status code " + response.statusCode)
        if (!error && response.statusCode == 200) {
            console.log("Code 200");

            var csv = body;
            const output = []
            parse(
                csv
                , {
                    delimiter: ';',
                    trim: true,
                    //rtrim: true,
                    skip_lines_with_error: true,
                    skip_empty_lines: true,
                    from_line: 1
                })
                .on('readable', function(){
                    let record
                    while (record = this.read()) {
                        output.push(record)
                    }
                })
                .on('end', function(){

                  connection.connect(config.hdb);

                  const len = output.length;
                  let i;
                  for (i=1; i<len; i++) {

                    var line = output[i][0];

                    const len_j=output[i].length;
                    let j;
                    for(j=1; j < output[i].length-1; j++){
                      if( output[i][j+1].length > 0) {

                        console.log(line + " : '" + output[i][j] + "' -> '" + output[i][j+1] + "'.");

                        //synchrone DB-Connection, um node_id als Ergebnis zu erhalten (Blocking Aufruf), um danach die Tabelle mit dem Ergebnis zu befuellen
                        var sql_str1 = "SELECT \"node_ID\", \"stop_lat\", \"stop_long\" FROM Nodes WHERE \"stop_name\" LIKE '%" + output[i][j] +"%' LIMIT 1";
                        var result1 = connection.exec( sql_str1, []);
                        console.log(sql_str1)

                        var sql_str2 = "SELECT \"node_ID\", \"stop_lat\", \"stop_long\" FROM Nodes WHERE \"stop_name\" LIKE '%" + output[i][j+1] +"%' LIMIT 1";
                        var result2 = connection.exec( sql_str2, []);

                        console.log( line + " : " + JSON.stringify( result1) + " -> " + JSON.stringify( result2));
                        console.log(line + " : " + output[i][j] + " -> " + output[i][j+1]);

                        if( result1.length > 0 && result2.length) {

                          console.log( line + " : " + JSON.stringify( result1[0]["node_ID"]) + " -> " + JSON.stringify( result2[0]["node_ID"]));

                          // Bestimmen der Distanz zwischen den Haltestellen bzw jeder Kante
                          const sql_dist = `Select NEW ST_Point('Point(`+ result1[0]["stop_lat"] + ` ` + result1[0]["stop_long"] +` )', 4326).ST_Distance(new ST_Point('Point(`+ result2[0]["stop_lat"] + ` ` + result2[0]["stop_long"] +` )', 4326), 'kilometer') AS dist FROM dummy`;
                          result_dist = connection.exec( sql_dist);
                          console.log( JSON.stringify( result_dist[0]["DIST"]));

                          var sql_insert1 = "Insert into U558587.Edges ( \"start\", \"end\", \"line\", \"start_name\", \"end_name\", \"distance\") VALUES ( " + JSON.stringify( result1[0]["node_ID"]) + ", " + JSON.stringify( result2[0]["node_ID"]) + ", '" + line + "', '" + output[i][j] +"', '" + output[i][j+1] + "', " + JSON.stringify( Math.round( result_dist[0]["DIST"] * 1000)) + ")";
                          result_insert1 = connection.exec( sql_insert1);

                          //um den Graph bidirektional zu machen
                          var sql_insert2 = "Insert into U558587.Edges ( \"start\", \"end\", \"line\", \"start_name\", \"end_name\", \"distance\") VALUES ( " + JSON.stringify( result2[0]["node_ID"]) + ", " + JSON.stringify( result1[0]["node_ID"]) + ", '" + line + "', '" + output[i][j+1] +"', '" + output[i][j] + "', " + JSON.stringify( Math.round( result_dist[0]["DIST"] * 1000)) + ")";
                          result_insert2 = connection.exec( sql_insert2);
                        }
                      }
                    }
                  }

                  console.log("Dataimport edges completed");
                  connection.disconnect();

                })

        }
    });

}

//Methode lädt alle S und U Haltestellen Berlins herunter und fügt sie in die Datenbanktabelle "Edges" im Benutzer U558587 ein
app.get('/importEdges', (req, res, next) => {

  importEdgeFromFile( 'http://127.0.0.1:8081/ressources/linien/s_bahn_linien.txt');
  importEdgeFromFile( 'http://127.0.0.1:8081/ressources/linien/u_bahn_linien.txt');

  console.log("Import Edges Tabelle wurde aufgerufen")
});

app.get('/testShortestPath', (req, res, next) => {

  // Two sql statements : look up node id by station name

  const hanaClient = require("@sap/hana-client");
  const connection = hanaClient.createConnection();
  connection.connect(config.hdb);

  var stnname_start = req.query.stnname_start;
  var stnname_end = req.query.stnname_end;
  var sql_station_start = "Select \"node_ID\" FROM Nodes WHERE \"stop_name\" LIKE '%" + stnname_start + "%' LIMIT 1";
  var sql_station_end = "Select \"node_ID\" FROM Nodes WHERE \"stop_name\" LIKE '%" + stnname_end + "%' LIMIT 1";
  console.log( "sql_station_start : " + sql_station_start);
  console.log( "sql_station_end : " + sql_station_end);
  // .substring(1,stnname_start.length-2))

  var result_start = connection.exec( sql_station_start, []);
  var result_end = connection.exec( sql_station_end, []);
  console.log( "Start-Haltestelle: " + JSON.stringify( result_start));
  console.log( "Ziel-Haltestelle: " + JSON.stringify( result_end));

  var nodeid_start = result_start[0]["node_ID"];
  var nodeid_end = result_end[0]["node_ID"];

  // var sql_str = "CALL \"U558587\".\"find_shortest_path\"( START_NODE_ID => " + JSON.stringify(nodeid_start) + ", END_NODE_ID => " + JSON.stringify(nodeid_end) + ", EDGE_NAME => ?)";
  var sql_str = "CALL \"U558587\".\"find_shortest_path_dist\"( START_NODE_ID => " + JSON.stringify(nodeid_start) + ", END_NODE_ID => " + JSON.stringify(nodeid_end) + ", EDGE_NAME => ?, totalDistance => ?)";
  console.log(sql_str);
  // TODO: how to access totalDistance computed in find_shortest_path_dist
  var result = connection.exec( sql_str, []);
  console.log( JSON.stringify( result))

  connection.disconnect();

  // Finden der Umsteigebahnhoefe
  var total_distance = 0.;
  var total_route = "";
  let i;
//  var lenght=result.length;
//  var max = lenght-1;
  for (i=0; i<=result.length-1; i++) {
    var line = "Linie: " + result[i]["line"] + " *** Haltestelle: ";
    total_distance += result[i]["distance"];
//    console.log("Route element " + result[i]["route"]);
//    console.log(" Zähler i in for Schleife " + i );
    console.log(line);
    //console.console.log(" Teilstreckendistanz: " + total_distance);
    total_route += line + result[i]["start_name"] + " *** Distanz zur naechsten Station: " + result[i]["distance"] + " m" +"\n";
    if( i<result.length-1 && result[i]["line"] != result[i+1]["line"]){
      total_route += "\nBitte Umsteigen bei " + result[i]["line"] + " zu " + result[i+1]["line"] + " an der Station " + result[i]["end_name"] + "\n\n";
      console.log( "Umsteigen bei " + result[i]["line"] + " zu " + result[i+1]["line"] + " an der Station " + result[i]["end_name"] );
 //       console.log(" Zähler i in if " + i );
    }else if(i==result.length-1){
        total_route += "\nBitte Austeigen an der Station: " + result[i]["end_name"] + "\n\n";
        console.log( "Bitte Austeigen an der Station " + result[i]["end_name"] );
    }
  }

 // console.log(" Zähler i außerhalb for schleife " + i );
  console.log( "Total distance: " + JSON.stringify(total_distance));
  total_route += "\nGesamtdistanz: " + JSON.stringify(total_distance / 1000.) + " km";
  console.log( total_route);

  // zuerckgeben des Ergenisstrings an Controller:
  res.type('application/json').send( [total_route]);

});

app.get('/textanalyse', (req, res, next) => {

    var eingabe = req.query.eingabe;
    console.log(`Die Eingabe lautete: ${eingabe}`);
    /*var adressen = */
        // testanalyse(eingabe);

    const hanaClient = require("@sap/hana-client");
    const connection = hanaClient.createConnection();
    const ta = require("@sap/textanalysis");

    console.log("starting text analysis");
    connection.connect(config.hdb, (err) => {
        if (err) {
            return console.error("Connection error", err);
        }
        const values = {
            DOCUMENT_TEXT: eingabe,
            LANGUAGE_CODE: 'DE',
            CONFIGURATION: 'EXTRACTION_CORE',
            RETURN_PLAINTEXT: 0
        };
        ta.analyze(values, connection, function done(err, parameters, rows) {
            if (err) {
                return console.error('error', err);
            }
            console.log("finished text analysis 2");
            const addressRows = rows.filter(row => row.TYPE == 'ADDRESS1');
            if (addressRows.length != 2) {
                var msg =[];
                msg.push("Bitte zwei Adressen eingeben. Sollten es zwei Adressen gewesen sein, kann SAP Textanalyse die eine Adresse nicht erkennen.");
                res.type('application/json').send(msg);
                console.log(addressRows.length + " addresses were given. Only 2 allowed!")
            } else {
                var adress = [];
                addressRows.forEach(function (row, index) {
                    adress.push(row.TOKEN + ", Berlin");
                });
                connection.disconnect();
                adress.forEach(function (item, index) {
                    console.log(item, index);
                });
                res.type('application/json').send( adress);
            }
        });

    });

});
