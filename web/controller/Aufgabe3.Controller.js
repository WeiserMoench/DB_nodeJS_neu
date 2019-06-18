sap.ui.define(["de/htwberlin/adbkt/basic1/controller/BaseController",
	"de/htwberlin/adbkt/basic1/Cred"
], function (BaseController, Cred) {
	"use strict";

	return BaseController.extend("de.htwberlin.adbkt.basic1.controller.aufgabe3", {
		onInit: function () {

		},

		onFindButtonPress: function (oEvent) {
			sap.m.MessageToast.show('Die Streckensuche wird durchgeführt.. ');
            self = this;

			const eingabe = this.getView().byId('eingabezeile').getValue();

			//alert(eingabe)

            self.requestFahrrouteEineEingabe(eingabe);

/*			var startadresse = this.getView().byId('startadresse').getValue();
			var zieladresse = this.getView().byId('zieladresse').getValue();


			//Geocoding
			$.ajax({
				url: 'https://geocoder.api.here.com/6.2/geocode.json',
				type: 'GET',
				dataType: 'jsonp',
				jsonp: 'jsoncallback',
				data: {
					searchtext: startadresse,
					app_id: Cred.getHereAppId(),
					app_code: Cred.getHereAppCode(),
					gen: '9'
				},
				success: function (data) {
					var latStart = data.Response.View["0"].Result["0"].Location.DisplayPosition.Latitude;
					var lngStart = data.Response.View["0"].Result["0"].Location.DisplayPosition.Longitude;


					$.ajax({
						url: 'https://geocoder.api.here.com/6.2/geocode.json',
						type: 'GET',
						dataType: 'jsonp',
						jsonp: 'jsoncallback',
						data: {
							searchtext: zieladresse,
							app_id: Cred.getHereAppId(),
							app_code: Cred.getHereAppCode(),
							gen: '9'
						},
						success: function (data) {
							var latStop = data.Response.View["0"].Result["0"].Location.DisplayPosition.Latitude;
							var lngStop = data.Response.View["0"].Result["0"].Location.DisplayPosition.Longitude;


							alert("Start: " + latStart + " " + lngStart + "\nStop: " + latStop + " " + lngStop);

							self.requestFahrrouteZweiFelder(latStart, lngStart, latStop, lngStop);


						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
						}
					})

					//alert("test" + lat + " " + lng);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}
			});*/
		},

		requestFahrrouteZweiFelder: function (latStart, lngStart, latStop, lngStop) {
			var log = self.getView().byId('log');

			//sap.m.MessageToast.show(lat + '\n' + lng);
			self = this;
			$.ajax({

				url: `http://127.0.0.1:3000/route?latStart=${latStart}&lngStart=${lngStart}&latStop=${latStop}&lngStop=${lngStop}`,
				type: 'GET',

				success: function (data) {
					var log = self.getView().byId('log');
					log.setValue(JSON.stringify(data, null, 2));
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}

			});
		},

		onButton2Press: function (oEvent) {
			sap.m.MessageToast.show('Import Nodes ... ');
			//self = this;
			$.ajax({
				url: `http://127.0.0.1:3000/importBerlin`,
				type: 'GET',
				success: function () {
					var log = self.getView().byId('log');
					log.setValue(JSON.stringify("DB reloaded"));
				},
				error: function (jqXHR, textStatus, errorThrown) {
					//sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}
			});
			log.setValue("Tabelle nodes erfolgreich importiert");
		},

		onButton3Press: function (oEvent) {
			sap.m.MessageToast.show('Import edges ... ');
			//self = this;
			$.ajax({
				url: `http://127.0.0.1:3000/importEdges`,
				type: 'GET',
				success: function () {
					var log = self.getView().byId('log');
					log.setValue(JSON.stringify("Edge data imported"));
				},
				error: function (jqXHR, textStatus, errorThrown) {
					//sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}
			});
			log.setValue("Tabelle edges erfolgreich importiert");
		},

		onButton4Press: function (oEvent) {
			sap.m.MessageToast.show('Test find shortest path.');
			//self = this;
			$.ajax({
				url: `http://127.0.0.1:3000/testShortestPath`,
				type: 'GET',
				success: function () {
					var log = self.getView().byId('log');
					log.setValue(JSON.stringify("shortest path = "));
				},
				error: function (jqXHR, textStatus, errorThrown) {
					//sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}
			});
			log.setValue("shortest path is shown...");
		},

    requestFahrrouteEineEingabe: function (eingabezeile) {
        //alert("FahrrouteEineEingabe aufgerufen");
        self = this;

        const ermittleKoordinaten = self.ermittleKoordinaten();

        $.ajax({

            url: `http://127.0.0.1:3000/textanalyse?eingabe=${eingabezeile}&funktion=${ermittleKoordinaten}`,
            type: 'GET',

            success: function (data) {
                alert("erfolgreich beim Controller angekommen");
                data.forEach(function(item, index) {
                    console.log(item, index);
                });

                var log = self.getView().byId('log');
                log.setValue(JSON.stringify(data, null, 2));

                /*$.ajax({

                    url: `http://127.0.0.1:3000/route?latStart=${latStart}&lngStart=${lngStart}&latStop=${latStop}&lngStop=${lngStop}`,
                    type: 'GET',

                    success: function (data) {

                        var log = self.getView().byId('log');
                        log.setValue(JSON.stringify(data, null, 2));
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
                    }

                });*/

            },
            error: function (jqXHR, textStatus, errorThrown) {
                sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
            }

        });
    },

    ermittleKoordinaten: function(adresse){

        $.ajax({
            url: 'https://geocoder.api.here.com/6.2/geocode.json',
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            data: {
                searchtext: adresse,
                app_id: Cred.getHereAppId(),
                app_code: Cred.getHereAppCode(),
                gen: '9'
            },
            success: function (data) {
                return data;

                alert("Daten erhalten");

            },
            error: function (jqXHR, textStatus, errorThrown) {
                sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
            }
        })

    }

	});
});
