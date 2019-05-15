sap.ui.define(["de/htwberlin/adbkt/basic1/controller/BaseController"], function (BaseController) {
	"use strict";

	return BaseController.extend("de.htwberlin.adbkt.basic1.controller.Main", {
		onInit: function () {},

		onPressHello: function (oEvent) {
			this.getRouter().navTo("hello");
		},
		onPressMvc: function (oEvent) {
			this.getRouter().navTo("mvc");
		},
		onPressGeo: function (oEvent) {
			this.getRouter().navTo("geo");
		},
		onPressService: function (oEvent) {
			this.getRouter().navTo("service");
		},
		onPressOrderMan: function (oEvent) {
			this.getRouter().navTo("orderMan");
		},
		onPressOutbound: function (oEvent) {
			this.getRouter().navTo("outbound");
		},
		onPressOutbound2: function (oEvent) {
			this.getRouter().navTo("outbound2");
		},
		onPressDb: function (oEvent) {
			this.getRouter().navTo("db");
		},
		onPressAufgabe3: function (oEvent) {
			this.getRouter().navTo("aufgabe3");
		},

	});

});
