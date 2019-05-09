sap.ui.define(["de/htwberlin/adbkt/basic1/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("de.htwberlin.adbkt.basic1.controller.Db", {
		onInit: function () {
			self = this;

		},
		onButton1Press: function (oEvent) {
			sap.m.MessageToast.show('Read from DB ... ');

			var dbid = self.getView().byId('dbid').getValue();
			$.ajax({
				url: `http://127.0.0.1:3000/db?dbid=${dbid}`,
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
			sap.m.MessageToast.show('Import to DB ... ');
			//self = this;
			$.ajax({
				url: `http://127.0.0.1:3000/import`,
				//url: `http://141.45.33.224:3000/`,
				type: 'GET',
				success: function () {
					//var log = self.getView().byId('log');
					//log.setValue(JSON.stringify("Daten erfolgreich eingetragen", null, 2));
					//log.setValue("Daten erfolgreich eingetragen");
					var log = self.getView().byId('log');
					log.setValue("erfolgreich");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
				},

			});
			log.setValue("erfolgreich importiert");
		},

		onButton3Press: function (oEvent) {
			sap.m.MessageToast.show('Delete DB rows ... ');
			//self = this;
			$.ajax({
				url: `http://127.0.0.1:3000/reset`,
				type: 'GET',
				success: function () {
					var log = self.getView().byId('log');
					log.setValue(JSON.stringify("Datenbankeinträge gelöscht"));
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}
			});
			log.setValue("erfolgreich gelöscht");
		},

	});
});