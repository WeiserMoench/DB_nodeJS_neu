const express = require('express')
const app = express()
const port = 3000

const config = require('./config');
const db = require('./db');

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


    //var url = 'http://fiebelkorn24.de/stations.csv';
    //var url = 'https://wiki.htw-berlin.de/confluence/download/attachments/31623434/test.txt';
    //var url = 'http://fiebelkorn24.de/data.csv'
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


    console.log("Import wurde aufgerufen")
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


//Methode läd alle Haltestellen des VBB Netzes herunter und fügt sie in die Datenbanktabelle "Haltestellen_VBB" im Benutzer U558587 ein
app.get('/importVBB', (req, res, next) => {

    const parse = require('csv-parse');
    var request = require('request');


    //var url = 'http://fiebelkorn24.de/stations.csv';
    //var url = 'https://wiki.htw-berlin.de/confluence/download/attachments/31623434/test.txt';
    //var url = 'http://fiebelkorn24.de/data.csv'
    var url = 'http://fiebelkorn24.de/stops.txt';
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

