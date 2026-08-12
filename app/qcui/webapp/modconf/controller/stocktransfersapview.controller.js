sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast"
],

    function (genericentryform, MessageToast) {
        "use strict";

        return genericentryform.extend("modconfcontroller.stocktransfersapview", {
            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
            },
            onBeforeShow: function (oEvent) {
                //this.validateAccess();
                this.setFormMode("3");
                this.isValidUser();
                this.initialize();
            },
            initialize: async function () {
                debugger;
                this.setPageId("stocktransfersaplv");
                this.setFormTitle("Inspection Lot List");
                this.setBackwardRoute("LandingPageIndex");
                this.setForwardRoute("RouterNameInspectionLotDecisionForm");
                this.setFormSubTitle("Inspection List");
                this.SetDocumentModel();
                this.LoadInspectionLotData();
                this.setEntryFormDataSourceURLToAddData("/odata/v4/record-result-sap/RecordResultSAPHead");
                await this.showEntryForm();
            },
            SetDocumentModel: function () {
                try {
                    var modelData = {
                        "value": [
                            {
                                "RowNumber": null,
                                "ID": "",
                                "InspectionLot": "",
                                "Material": "",
                                "Serial":"",
                                "Plant": "",
                                "PostDate": "",
                                "Quantity": "",
                                "Status": "",
                                "Summary": "",
                                "SerialBatchDetails": [
                                    {
                                        "Status": ""
                                    }
                                ]
                            }
                        ]
                    }
                    let oModel = new sap.ui.model.json.JSONModel(modelData);
                    this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                }
                catch (error) {
                    console.log(error);
                    MessageToast.show(error);
                }
            },
             OnExport: function () {
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    let jsonData = viewModel.getData().value || [];  // Make sure to access the data array

                    // Convert JSON data to worksheet
                    var worksheet = XLSX.utils.json_to_sheet(jsonData);

                    // Create a new workbook and append the worksheet
                    var workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

                    // Export the file to user
                    XLSX.writeFile(workbook, "InspectionLotExport.xlsx");
                }
           ,
            OnExport: function () {

            ///////////////
            let MainModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    let MainjsonData = MainModel.getData().value || [];
            debugger;
            var aParametersDetails2 = MainjsonData.map(function(item) {
                return {
                    InspectionLot: item.InspectionLot,
                    Material: item.Material,
                    Plant: item.Plant,
                    PostDate: item.PostDate,
                    Status: item.Status,
                    Summary:item.Summary                
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

            onPressBack: function () {
                try {
                    this.router.navTo("LandingPageIndex");
                }
                catch (error) {
                    console.log(error);
                    MessageToast.show(error);
                }
            },
            LoadInspectionLotData: async function () {
                try {
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/odata/v4/record-result-sap/RecordResultSAPHead?$orderby=PostDate desc&$expand=SerialBatchDetails`,
                        '',
                        'InspectionLotList'
                    );
                    const data = this.getView().getModel('InspectionLotList').getData();
                    const { value = [] } = data || {};
                    value.forEach((element, index) => {
                        element.RowNumber = index + 1;
                        let DraftCount = 0, PPCount = 0, PostedCount = 0;
                        const { SerialBatchDetails = [] } = element;
                        let _Serial="";
                        SerialBatchDetails.forEach((dataValue, index) => {

                            if (dataValue.Status == "Draft") {
                                DraftCount = DraftCount + 1;
                            }
                            if (dataValue.Status == "Ready To Post") {
                                PPCount = PPCount + 1;
                            }
                            if (dataValue.Status == "Posted") {
                                PostedCount = PostedCount + 1;
                            }
                             _Serial=_Serial+","+dataValue.SerialBatchNumber;
                        });
                     
element.Serial=_Serial;
                        element.Summary = `D-${DraftCount}, RTP-${PPCount}, P-${PostedCount}`;
                    });
                    viewModel.setProperty(`/value`, value);
                }
                catch (error) {
                    console.log(error);
                    MessageToast.show(error);
                }
            },
            onPressMakeDecision: function (oEvent) {
                var oButton = oEvent.getSource();
               // debugger;
                // Step 2: Get the binding context of the row containing the button
                var oBindingContext = oButton.getBindingContext(this.getEntryFormDataSourceModelName());
                console.log("Binding Context:", oBindingContext);
                let oRowObject = oBindingContext.getProperty("ID");
                console.log("ID:", oRowObject);
                if (!oBindingContext) {
                    console.error("Binding context not found");
                    MessageToast.show("Binding context not found");
                    return;
                }
                let oModel = this.getView().getModel('sysModel');
                //alert(JSON.stringify(oModel));
                oModel.setProperty('/route/routeData/lastUniqueId', oRowObject);
                this.getView().setModel(oModel, 'sysModel');

                var sPath = oBindingContext.getPath(); // e.g., "/Role/1"
                console.log("Binding Path:", sPath);
                this.setRouteData("2", oRowObject);
                this.setListViewEditPropertyValue(oRowObject);

                this.router.navTo(this.getForwardRoute());
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
            onSearch: function (oEvent) {
                var sQuery = oEvent.getParameter("newValue"); // Get search input
                var filters = [];
                var filter1 = new sap.ui.model.Filter({ path: "InspectionLot", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter2 = new sap.ui.model.Filter({ path: "Material", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter3 = new sap.ui.model.Filter({ path: "Plant", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter4 = new sap.ui.model.Filter({ path: "Status", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter5 = new sap.ui.model.Filter({ path: "Summary", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                filters = [filter1, filter2, filter3, filter4, filter5];
                var finalFilter = new sap.ui.model.Filter({ filters: filters, and: false });
                var otable = this.byId("smSerialBatchDetails");
                otable.getBinding("items").filter(finalFilter);
            }
        });
    });
