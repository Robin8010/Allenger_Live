sap.ui.define([
    "core/generic/genericlistview"
    
],

    function (genericlistview) {
        "use strict";

        return genericlistview.extend("modconfcontroller.recordresultsapview", {

            onInit: function () {
                genericlistview.prototype.onInit.apply(this, arguments);
                
debugger;
            },
            onBeforeShow: function (oEvent) {
                //this.validateAccess();
                this.isValidUser();
                this.initialize();

            },
            initialize: async function () {
                this.setPageId("recordresultsaplv");
                this.setFormTitle("SAP Record Result View");
                this.setBackwardRoute("LandingPageIndex");

                this.setListViewDataSourceProperties("GET", "/odata/v4/record-result-sap/RecordResultSAPHead?$orderby=PostDate desc", "", "value");
                this.setListViewDisplayColumns(["Inspection Lot", "Material Code", "Plant", "Status", "Post Date", "action"]);
                this.setListViewDataColumns(["InspectionLot", "Material", "Plant", "Status", "PostDate", "Edit"]);

                this.setFormSubTitle("Result List");
                this.setListViewFilterColumn("stglvInspectionLot", "Inspection Lot", "Cfl", "eq", "String", "InspectionLot", "cflForInspectionLot");
                this.setListViewFilterColumn("stglvMaterial", "Material", "Cfl", "eq", "String", "Material", "cflForMaterial");
                this.setListViewFilterColumn("stglvPlant", "Plant", "Cfl", "eq", "String", "Plant", "cflForPlant");
                this.setListViewFilterColumn("stglvStatus", "Status", "Cfl", "eq", "String", "Status", "cflForStatus");
                this.setListViewFilterColumn("stglvDate", "PostDate", "Cfl", "eq", "String", "PostDate", "cflForDate");
                this.setListViewEditProperty("ID");
                this.setForwardRoute("RouterNameRecordResultSAPEntryForm");
                //this.setBackwardRoute("RouteIndex");
                await this.showListView(this.getPageId());
            },
            cflForInspectionLot: async function () {
                this.setCflTitle('Inspection Lot List');
                await this.createNewModelUsingAPI("GET", "/odata/v4/record-result-sap/RecordResultSAPHead?$apply=groupby((InspectionLot))", "", this.getCflListViewDataSourceModelName());
                this.setCflDisplayColumns(["Inspection Lot"]);
                this.setCflDataColumns(["InspectionLot"]);
                this.setCflValueAndDisplay("", "", "stglvInspectionLot", "InspectionLot");
                this.showCfl("stglvInspectionLot", this.getCflListViewDataSourceModelName(), "value", this.onClosecflForInspection.bind(this));
            },
            cflForStatus: async function () {
                this.setCflTitle('Status List');
                await this.createNewModelUsingAPI("GET", "/odata/v4/record-result-sap/RecordResultSAPHead?$apply=groupby((Status))", "", this.getCflListViewDataSourceModelName());
                this.setCflDisplayColumns(["Status"]);
                this.setCflDataColumns(["Status"]);
                this.setCflValueAndDisplay("", "", "stglvStatus", "Status");
                this.showCfl("stglvStatus", this.getCflListViewDataSourceModelName(), "value", this.onClosecflForInspection.bind(this));
            },
             cflForDate: async function () {
                this.setCflTitle('Status List');
                await this.createNewModelUsingAPI("GET", "/odata/v4/record-result-sap/RecordResultSAPHead?$apply=groupby((PostDate))", "", this.getCflListViewDataSourceModelName());
                this.setCflDisplayColumns(["PostingDate"]);
                this.setCflDataColumns(["PostDate"]);
                this.setCflValueAndDisplay("", "", "stglvDate", "PostDate");
                this.showCfl("stglvDate", this.getCflListViewDataSourceModelName(), "value", this.onClosecflForInspection.bind(this));
            },
             cflForPlant: async function () {
                this.setCflTitle('Plant List');
                await this.createNewModelUsingAPI("GET", "/odata/v4/record-result-sap/RecordResultSAPHead?$apply=groupby((Plant))", "", this.getCflListViewDataSourceModelName());
                this.setCflDisplayColumns(["Plant"]);
                this.setCflDataColumns(["Plant"]);
                this.setCflValueAndDisplay("", "", "stglvPlant", "Plant");
                this.showCfl("stglvPlant", this.getCflListViewDataSourceModelName(), "value", this.onClosecflForInspection.bind(this));
            },
            onClosecflForInspection: function () {
                let x = this.getCflObject();
            },
            OnExport1:function()
            {
                  let viewModel = this.getView().getModel("ListViewDataSourceModel");
                var fileName="Inspection Lot"
                 var jsonString = JSON.stringify(viewModel.getData(), null, 2);  // Pretty-print JSON

                var blob = new Blob([jsonString], { type: "application/json" });

            // Create a link and trigger download
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            },
            OnExport: function () {

            ///////////////
            let MainModel = this.getView().getModel("ListViewDataSourceModel");
                    let MainjsonData = MainModel.getData().value || [];
            debugger;
            var aParametersDetails2 = MainjsonData.map(function(item) {
                return {
                    InspectionLot: item.InspectionLot,
                    Material: item.Material,
                    Plant: item.Plant,
                    PostDate: item.PostDate,
                    Status: item.Status
                   
                };
            });
            // Create the new model structure
            var oConvertedData = {
                "Final": aParametersDetails2
            };

            var oModelB = new sap.ui.model.json.JSONModel();
            oModelB.setData(oConvertedData);
            this.getView().setModel(oModelB, "ConvertedModel");

            // Create and set new model
           debugger;
            ///////////////
                    let viewModel = this.getView().getModel("ConvertedModel");
                    let jsonData = viewModel.getData().Final||[];  // Make sure to access the data array

                    // Convert JSON data to worksheet
                    var worksheet = XLSX.utils.json_to_sheet(jsonData);

                    // Create a new workbook and append the worksheet
                    var workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

                    // Export the file to user
                    XLSX.writeFile(workbook, "InspectionLotExport.xlsx");
                }
           ,
            
            cflForMaterial: async function () {
                this.setCflTitle('Material List');
                await this.createNewModelUsingAPI("GET", "/odata/v4/record-result-sap/RecordResultSAPHead?$apply=groupby((Material))", "", this.getCflListViewDataSourceModelName());
                this.setCflDisplayColumns(["Material"]);
                this.setCflDataColumns(["Material"]);
                this.setCflValueAndDisplay("", "", "stglvMaterial", "Material");
                this.showCfl("stglvMaterial", this.getCflListViewDataSourceModelName(), "value", this.onClosecflForMaterial.bind(this));
            },
            onClosecflForMaterial: function () {
                let x = this.getCflObject();
            },            
           isValidUser: function () {
                // let loginInfo=this.getLoginInfo();
                // let userid = loginInfo.UserID;

                const loginModel = this.getOwnerComponent().getModel('UserModel');
                if (!loginModel || loginModel === 'undefined') {
                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                    router.navTo("RouteLogin");
                    MessageToast.show("Not a valid user.");
                }
            },
           
        
        });
    });
