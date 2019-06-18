const hanaClient = require("@sap/hana-client");
const connection = hanaClient.createConnection();
const ta = require("@sap/textanalysis");

module.exports = {
    readFromHdb: function (hdb, sql, params, handleRows, infoHandler) {
        connection.connect(hdb, (err) => {
            if (err) {
                return console.error("Connection error", err);
            }

            var stmt = connection.prepare(sql);
            stmt.exec(params, (err, rows) => {
                connection.disconnect();

                if (err) {
                    return console.error('SQL execute error:', err);
                }

                handleRows(rows);
                infoHandler(`Query '${sql}' returned ${rows.length} items`);
            });
        });
    },

    writeIntoHdb: function (hdb, sql, params) {
        connection.connect(hdb, (err) => {
            if (err) {
                return console.error("Connection error", err);
            }

            var stmt = connection.prepare(sql);
            stmt.exec(params, (err) => {
                connection.disconnect();

                if (err) {
                    return console.error('SQL execute error:', err);
                }

            });
        });
    },

    analyseTextAndGetAdressen: function (hdb, getGeoCoordinates, result, res, type) {
        console.log("starting text analysis");
        connection.connect(hdb, (err) => {
            if (err) {
                return console.error("Connection error", err);
            }
            const values = {
                DOCUMENT_TEXT: result,
                LANGUAGE_CODE: 'DE',
                CONFIGURATION: 'EXTRACTION_CORE',
                RETURN_PLAINTEXT: 0
            };
            ta.analyze(values, connection, function done(err, parameters, rows) {
                if (err) {
                    return console.error('error', err);
                }
                console.log("finished text analysis");
                const addressRows = rows.filter(row => row.TYPE == 'ADDRESS1');
                if (addressRows.length != 2) {
                    console.log(addressRows.length + " addresses were given. Only 2 allowed!")
                    res.type('application/json').send({message: 'Problem!'});
                    connection.close();
                } else {
                    addressRows.forEach(function (row, index) {
                        console.log(row.TOKEN);
                        getGeoCoordinates(row.TOKEN);
                    });
                }

            });
        });
    },
};
