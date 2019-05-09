sap.ui.define(["de/htwberlin/adbkt/basic1/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("de.htwberlin.adbkt.basic1.controller.Db", {
		onInit: function () {

		},
		onButton1Press: function (oEvent) {
			sap.m.MessageToast.show('Read from DB ... ');
			self = this;
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
			sap.m.MessageToast.show('import to DB ... ');
			self = this;
			$.ajax({
				url: `http://127.0.0.1:3000/import`,
				type: 'GET',
				success: function (data) {
					var log = self.getView().byId('log');
					log.setValue("erfolgreich");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}
			});
		},

	});
});