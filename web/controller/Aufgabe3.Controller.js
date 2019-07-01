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

//find next public transport station nearby
//Code von https://developer.here.com/api-explorer/rest/public_transit/station-search-proximity
		onButton4Press: function (oEvent) {

			$.ajax({
			  url: 'https://transit.api.here.com/v3/stations/by_geocoord.json',
			  type: 'GET',
			  dataType: 'jsonp',
			  jsonp: 'callbackFunc',
			  data: {
			    center: '52.534314000000,13.328703000000',
			    radius: '350',
					app_id: Cred.getHereAppId(),
					app_code: Cred.getHereAppCode(),
					gen: '9',
			    max: '3'
			  },
			  success: function (data) {
			    alert(JSON.stringify(data));
			  },
				failure: function(err) {
					alert(JSON.stringify(err));
				}
			});

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

		processResponseNextStation: function( data){
			let i;
			for( i=1; i < data["Res"]["Stations"]["Stn"].length; i++) {
				var cstn = data["Res"]["Stations"]["Stn"][i];
				let j;
				for( j=1; j < cstn["Transports"]["Transport"].length; j++) {
					var first_letter = cstn["Transports"]["Transport"][j]["name"].charAt(0);
					if( first_letter == "S" || first_letter == "U") {
						return cstn["name"];
					}
				}
			}
		},

    requestFahrrouteEineEingabe: function (eingabezeile) {
        //alert("FahrrouteEineEingabe aufgerufen");
        self = this;

        //const ermittleKoordinaten = self.ermittleKoordinaten();

        $.ajax({

            url: `http://127.0.0.1:3000/textanalyse?eingabe=${eingabezeile}`,//&funktion=${ermittleKoordinaten}`,
            type: 'GET',
						// adresses_start_end = Rueckgabe der Textanalyse
            success: function( addresses_start_end) {

								$.ajax({
										url: 'https://geocoder.api.here.com/6.2/geocode.json',
										type: 'GET',
										dataType: 'jsonp',
										jsonp: 'jsoncallback',
										data: {
												searchtext: addresses_start_end[0] + ", Berlin",
												app_id: Cred.getHereAppId(),
												app_code: Cred.getHereAppCode(),
												gen: '9'
										},
										success: function (latlngstart) {


											var latstart = latlngstart.Response.View["0"].Result["0"].Location.DisplayPosition.Latitude;
											var lngstart = latlngstart.Response.View["0"].Result["0"].Location.DisplayPosition.Longitude;

											$.ajax({
												url: 'https://transit.api.here.com/v3/stations/by_geocoord.json',
												type: 'GET',
												dataType: 'jsonp',
												jsonp: 'callbackFunc',
												data: {
													center: latstart + "," + lngstart,
													radius: '3000',
													app_id: Cred.getHereAppId(),
													app_code: Cred.getHereAppCode(),
													max: '20'
												},
												success: function ( stations_start) {

													//Start-Haltestelle
													var stnname_start = self.processResponseNextStation( stations_start);

													$.ajax({
															url: 'https://geocoder.api.here.com/6.2/geocode.json',
															type: 'GET',
															dataType: 'jsonp',
															jsonp: 'jsoncallback',
															data: {
																	searchtext: addresses_start_end[1] + ", Berlin",
																	app_id: Cred.getHereAppId(),
																	app_code: Cred.getHereAppCode(),
																	gen: '9'
															},
															success: function (latlngend) {


																var latend = latlngend.Response.View["0"].Result["0"].Location.DisplayPosition.Latitude;
																var lngend = latlngend.Response.View["0"].Result["0"].Location.DisplayPosition.Longitude;

																$.ajax({
																	url: 'https://transit.api.here.com/v3/stations/by_geocoord.json',
																	type: 'GET',
																	dataType: 'jsonp',
																	jsonp: 'callbackFunc',
																	data: {
																		center: latend + "," + lngend,
																		radius: '3000',
																		app_id: Cred.getHereAppId(),
																		app_code: Cred.getHereAppCode(),
																		max: '20'
																	},
																	success: function (stations_end) {

																		//Ziel-Haltestelle
																		var stnname_end = self.processResponseNextStation( stations_end);

																		var log = self.getView().byId('log');
																		log.setValue(stnname_start + " -> " + stnname_end);

																		// Uebermittlung an find-shortest-path in srv.js
																		$.ajax({
																		 	url: `http://127.0.0.1:3000/testShortestPath?stnname_start=${stnname_start}&stnname_end=${stnname_end}`,
																			type: 'GET',

																			success: function (data) {
																				var log = self.getView().byId('log');
																				sap.m.MessageToast.show( data);
																				log.setValue( data);
																			},
																			error: function (jqXHR, textStatus, errorThrown) {
																				sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
																			}
																		})

																	},
																	failure: function(err) {
																		alert(JSON.stringify(err));
																	}
																});

															},
															error: function (jqXHR, textStatus, errorThrown) {
																	alert("Error.");
															}
													})

												},
												failure: function(err) {
													alert(JSON.stringify(err));
												}
											});

										},
										error: function (jqXHR, textStatus, errorThrown) {
												alert("Error.");
										}
								})

                // var log = self.getView().byId('log');
                // log.setValue( "E" + JSON.stringify(data[0], null, 2));

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

    },


		findNextStation: function( geolocs) {

			sap.m.MessageToast.show('Test findNextStation.');

			$.ajax({
			  url: 'https://transit.api.here.com/v3/stations/by_geocoord.json',
			  type: 'GET',
			  dataType: 'jsonp',
			  jsonp: 'callbackFunc',
			  data: {
			    center: '55.7541,37.6200',
			    radius: '350',
			    app_id: 'devportal-demo-20180625',
			    app_code: '9v2BkviRwi9Ot26kp2IysQ',
			    max: '3'
			  },
			  success: function (data) {
			    alert(JSON.stringify(data));
			  },
				failure: function(err) {
					alert(JSON.stringify(err));
				}
			});

			// log.setValue("Tabelle nodes erfolgreich importiert");
		},

		getCoordinatesFromText: function( long, lat) {

			sap.m.MessageToast.show('Test erhalte Koordinaten.');

			$.ajax({
			  url: 'https://transit.api.here.com/v3/stations/by_geocoord.json',
			  type: 'GET',
			  dataType: 'jsonp',
			  jsonp: 'callbackFunc',
			  data: {
			    center: '55.7541,37.6200',
			    radius: '350',
			    app_id: 'devportal-demo-20180625',
			    app_code: '9v2BkviRwi9Ot26kp2IysQ',
			    max: '3'
			  },
			  success: function (data) {
			    alert(JSON.stringify(data));
			  },
				failure: function(err) {
					alert(JSON.stringify(err));
				}
			});

			// log.setValue("Tabelle nodes erfolgreich importiert");
		},


	});
});
