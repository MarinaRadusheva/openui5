/*!
 * ${copyright}
 */

sap.ui.define([
	"sap/base/util/UriParameters",
	"sap/m/Button",
	"sap/m/library",
	"sap/m/Dialog",
	"sap/m/Input",
	"sap/m/Label",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/ui/core/sample/common/Controller",
	"sap/ui/core/Title",
	"sap/ui/core/date/UI5Date",
	"sap/ui/layout/form/ColumnLayout",
	"sap/ui/layout/form/SimpleForm",
	"sap/ui/model/Sorter",
	"sap/ui/model/odata/v4/ODataModel",
	"sap/ui/test/TestUtils"
], function (UriParameters, Button, mobileLibrary, Dialog, Input, Label, MessageToast, Text,
		Controller, Title, UI5Date, _ColumnLayout, SimpleForm, Sorter, ODataModel, TestUtils) {
	"use strict";

	// shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType,
		sOptimisticBatch = UriParameters.fromQuery(window.location.search).get("optimisticBatch");

	return Controller.extend("sap.ui.core.sample.odata.v4.LateProperties.Main", {
		onCleanUpOptimisticBatchCache : function (oEvent) {
			var oTimeStamp = UI5Date.getInstance(Date.now()
				- parseInt(oEvent.getParameter("id").split("days")[1]) * 60 * 60 * 24 * 1000);

			ODataModel.cleanUpOptimisticBatch(oTimeStamp).then(function () {
				MessageToast.show("Deleted optimistic batch cache entries older than: "
					+ oTimeStamp);
			}, function (oError) {
				MessageToast.show("Cache cleanup failed: " + oError);
			}).catch();
		},
		onInit : function () {
			var bOptimisticBatch,
				that = this;

			if (sOptimisticBatch === null) {
				// optimistic batch enabled via OPA
				bOptimisticBatch = TestUtils.retrieveData("optimisticBatch");
				if (TestUtils.retrieveData("addSorter")) {
					// this changes the payload for the current 1st batch
					this.byId("SalesOrderList").getBinding("items").sort(
						new Sorter("SalesOrderID", true));
				}
			} else {
				bOptimisticBatch = sOptimisticBatch === "true";
			}

			if (bOptimisticBatch !== undefined) {
				this.oView.getModel().setOptimisticBatchEnabler(function () {
					return Promise.resolve(bOptimisticBatch);
				});
			}

			// simulate some UI initialization work in order to prevent failing OPA because of
			// error log: "#sendBatch called before optimistic batch payload could be read"
			setTimeout(function () {
				that.oView.byId("SalesOrderList").getBinding("items").resume();
			}, 20);
		},
		onOpenEditDeliveryDate : function (oEvent) {
			var oDialog = new Dialog({
					title : "Edit Delivery Date",
					content : new SimpleForm({
						layout : "ColumnLayout",
						content : [
							new Title({text : "Sales Order"}),
							new Label({text : "Sales Order ID "}),
							new Text({id : "SalesOrderID", text : "{SCHDL_2_SO/SalesOrderID}",
								tooltip : "SalesOrderID reused from Sales Orders"}),
							new Label({text : "Note"}),
							new Text({id : "Note", text : "{SCHDL_2_SO/Note}",
								tooltip : "Note fetched as late property"}),
							new Label({text : "Gross Amount"}),
							new Text({id : "GrossAmount", text : "{SCHDL_2_SO/GrossAmount}",
								tooltip : "GrossAmount fetched as late property"}),
							new Label({text : "Buyer"}),
							new Text({id : "CompanyName", text : "{SCHDL_2_SO/SO_2_BP/CompanyName}",
								tooltip : "CompanyName reused from Sales Orders->SO_2_BP"}),
							new Label({text : "Buyer WEB Address"}),
							new Text({id : "WebAddress", text : "{SCHDL_2_SO/SO_2_BP/WebAddress}",
								tooltip : "WebAddress fetched as late property within already "
									+ "expanded Sales Orders->SO_2_BP"}),
							new Label({text : "Buyer EMail Address"}),
							new Text({id : "EmailAddress",
								text : "{SCHDL_2_SO/SO_2_BP/EmailAddress}",
								tooltip : "EmailAddress fetched as late property within already "
									+ "expanded Sales Orders->SO_2_BP"}),
							new Title({text : "Schedule"}),
							new Label({text : "Schedule Key"}),
							new Text({id : "ScheduleKey", text : "{ScheduleKey}",
								tooltip : "ScheduleKey reused from Schedules"}),
							new Label({text : "Item Key"}),
							new Text({id : "ItemKey", text : "{ItemKey}",
								tooltip : "ItemKey reused from Schedules"}),
							new Label({text : "Delivery Date"}),
							new Input({id : "DeliveryDate", value : "{DeliveryDate}",
								tooltip : "DeliveryDate fetched as late property"})
						]
					}),
					beginButton : new Button({
						id : "confirmEditDeliveryDialog",
						press : function () {
							var oModel = oDialog.getModel();

							if (oModel.hasPendingChanges("UpdateGroup")) {
								oModel.submitBatch("UpdateGroup").then(function () {
									MessageToast.show("Delivery Date saved");
								});
							}
							oDialog.close();
							oDialog.destroy();
						},
						text : "Confirm",
						type : ButtonType.Emphasized
					}),
					endButton : new Button({
						id : "cancelEditDeliveryDialog",
						text : "Cancel",
						press : function () {
							oDialog.getModel().resetChanges("UpdateGroup");
							oDialog.close();
							oDialog.destroy();
						}
					})
				});

			this.getView().addDependent(oDialog);

			oDialog.setBindingContext(oEvent.getSource().getBindingContext());
			oDialog.open();
		},
		onSalesOrderSelect : function (oEvent) {
			this.byId("SO_2_SCHDL").setBindingContext(
				oEvent.getParameter("listItem").getBindingContext());
		}
	});
});
