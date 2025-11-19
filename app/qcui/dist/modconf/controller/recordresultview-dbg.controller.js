sap.ui.define([
    "core/generic/genericlistview"
],

    function (genericlistview) {
        "use strict";

        return genericlistview.extend("modconfcontroller.recordresultview", {

            onInit: function () {
                genericlistview.prototype.onInit.apply(this, arguments);

            },
            onBeforeShow: function (oEvent) {
                //this.validateAccess();
                this.initialize();

            },
            initialize: async function () {
                this.setPageId("recordresultlv");
                this.setFormTitle("Record Result View");
                this.setBackwardRoute("LandingPageIndex");

                this.setListViewDataSourceProperties("GET", "/odata/v4/record-result/RecordResultHead", "", "value");
                this.setListViewDisplayColumns(["Inspection Lot", "Material Code", "Plant", "Serial/Batch", "Status", "action"]);
                this.setListViewDataColumns(["InspectionLot", "Material", "Plant", "SerialNumber", "Status", "Edit"]);

                this.setFormSubTitle("Result List");
                this.setListViewFilterColumn("stglvInspectionLot", "Inspection Lot", "Cfl", "eq", "String", "InspectionLot", "cflForInspectionLot");
                this.setListViewFilterColumn("stglvMaterial", "Material", "Cfl", "eq", "String", "Material", "cflForMaterial");
                this.setListViewFilterColumn("stglvSerial", "SerialNumber", "Cfl", "eq", "String", "SerialNumber", "cflForSerial");
                this.setListViewEditProperty("ID");
                this.setForwardRoute("RouterNameRecordResultEntryForm");
                //this.setBackwardRoute("RouteIndex");
                await this.showListView(this.getPageId());
            },
            cflForInspectionLot: async function () {
                this.setCflTitle('Inspection Lot List');
                await this.createNewModelUsingAPI("GET", "/odata/v4/record-result/RecordResultHead", "", this.getCflListViewDataSourceModelName());
                this.setCflDisplayColumns(["Inspection Lot"]);
                this.setCflDataColumns(["InspectionLot"]);
                this.setCflValueAndDisplay("", "", "stglvInspectionLot", "InspectionLot");
                this.showCfl("stglvInspectionLot", this.getCflListViewDataSourceModelName(), "value", this.onClosecflForInspection.bind(this));
            },
            onClosecflForInspection: function () {
                let x = this.getCflObject();
            },
            cflForMaterial: async function () {
                this.setCflTitle('Material List');
                await this.createNewModelUsingAPI("GET", "/odata/v4/record-result/RecordResultHead", "", this.getCflListViewDataSourceModelName());
                this.setCflDisplayColumns(["Material"]);
                this.setCflDataColumns(["Material"]);
                this.setCflValueAndDisplay("", "", "stglvMaterial", "Material");
                this.showCfl("stglvMaterial", this.getCflListViewDataSourceModelName(), "value", this.onClosecflForMaterial.bind(this));
            },
            onClosecflForMaterial: function () {
                let x = this.getCflObject();
            },
            cflForSerial: async function () {
                this.setCflTitle('Serial/Batch List');
                await this.createNewModelUsingAPI("GET", "/odata/v4/record-result/RecordResultHead", "", this.getCflListViewDataSourceModelName());
                this.setCflDisplayColumns(["Serial/Batch"]);
                this.setCflDataColumns(["SerialNumber"]);
                this.setCflValueAndDisplay("", "", "stglvSerial", "SerialNumber");
                this.showCfl("stglvSerial", this.getCflListViewDataSourceModelName(), "value", this.onClosecflForSerial.bind(this));
            },
            onClosecflForSerial: function () {
                let x = this.getCflObject();
            }
        });
    });
