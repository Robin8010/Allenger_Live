sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/core/BusyIndicator'
],
    function (genericentryform, MessageToast, MessageBox, BusyIndicator) {
        "use strict";
        var _RoleInfo = null, _LoginInfo;
        var oBusyIndicator;

        return genericentryform.extend("modconfcontroller.inspectionlotdecisionform", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
                //this.initialize();
                oBusyIndicator = BusyIndicator;
            },
            onBeforeShow: async function (oEvent) {
                this.identifyFormMode(oEvent);
                this.initialize();
                this.setEntryFormDataSourceURLForEditMode("/odata/v4/record-result-sap/RecordResultSAPHead(ID = " + this.getListViewEditPropertyValue() + ")?$expand=RecordResultDecisionHead($orderby=PostDate desc)");
                await this.showEntryForm();
                this.handleUIOperation();
            },
            initialize: async function () {
                this.setPageId("stocktransferf");
                this.setFormTitle("Inspection Lot Decision Form");
                this.setBackwardRoute("RouterNameStockTransferSAPViewForm");
                this.setForwardRoute("RouterNameInspectionLotStockTransferForm");
                this.setEntryFormDataSourceURLForNewMode("");

                //this.setEntryFormDataSourceURLToAddData("/odata/v4/inventory-transfer-sap/InventoryTransferSAPHead");
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/record-result-sap/RecordResultSAPHead('" + this.getListViewEditPropertyValue() + "')");
                this.setListViewFilterColumn();
                let oPath = jQuery.sap.getModulePath(
                    "testui",
                    "/modconf/model/inspectionlotdecisionform.json", // Edit Response Model
                );
                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                debugger;

                // let oPathSaveReq = jQuery.sap.getModulePath(
                //     "testui",
                //     "/modconf/model/stockTransferSaveRequest.json", //Save Request Model
                // );

                //let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                //this.getView().setModel(oModelSaveRequest, "stockTransferSaveRequest");
            },
            handleUIOperation: function () {
                const formMode = this.getFormMode();
                if (formMode === "2") {
                    this.handleFormInEditMode();
                }
                else {
                    this.ShowDefaultValues();
                    this.SetEnableDisableProperty(true);
                }
            },
            SetEnableDisableProperty: async function (value) {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                viewModel.setProperty(`/InspectionLotEnabled`, value);
                viewModel.setProperty(`/SerialNumberEnabled`, value);
                viewModel.setProperty(`/PostDateEnabled`, value);
                const status = viewModel.getProperty(`/Status`);
                if (status || status == "undefined" || status == "Draft") {
                    viewModel.setProperty(`/SubmitButtonEnabled`, !value);
                }
                else {
                    viewModel.setProperty(`/SubmitButtonEnabled`, false);
                }
                viewModel.refresh(true);
            },
            ShowDefaultValues: async function () {
                var oDate = new Date();
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: 'yyyy-MM-dd'
                });
                // Format the date
                var sFormattedDate = oDateFormat.format(oDate);
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                viewModel.setProperty(`/PostDate`, sFormattedDate);
                viewModel.refresh(true);
            },
            handleFormInEditMode: async function () {
                const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                var transferedQuantity = 0;
                const quantity = viewModel.getProperty("/Quantity");
                let isAddNewTransfer = true;
                const { RecordResultDecisionHead = [] } = viewModel.getData();
                await RecordResultDecisionHead.forEach((element, index) => {
                    element.RowNumber = index + 1;
                    const status = element.Status;
                    if (status == "Posted") {
                        transferedQuantity = Number(transferedQuantity) + Number(element.Quantity);
                    }
                    if (status == "Draft") {
                        isAddNewTransfer = false;
                    }
                });
                if (Number(quantity) == Number(transferedQuantity)) {
                    isAddNewTransfer = false;
                    const insStatus = viewModel.getProperty("/Status");
                    if (insStatus != "Completed" && insStatus != "UD-Posted") {
                        const inspectionLotID = viewModel.getProperty("/ID");
                        await this.UpdateRecordResultHeaderStatus(inspectionLotID, "Completed");
                    }
                }
                viewModel.setProperty(`/RecordResultDecisionHead`, RecordResultDecisionHead);
                viewModel.setProperty("/TransferedQuantity", transferedQuantity);
                viewModel.setProperty("/AddNewTransferEnable", isAddNewTransfer);
                viewModel.refresh(true);
                this.SetConstantValuesInEditMode();
                this.EnableDisableUDPostingButton();
                //this.CheckDocumentSummary();
            },
            SetConstantValuesInEditMode: function () {
                const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const StatusList = [
                    {
                        "StatusId": "Pending",
                        "StatusDesc": "Pending"
                    },
                    {
                        "StatusId": "Accepted",
                        "StatusDesc": "Accepted"
                    },
                    {
                        "StatusId": "Draft",
                        "StatusDesc": "Draft"
                    },
                    {
                        "StatusId": "Rejected",
                        "StatusDesc": "Rejected"
                    }
                ]
                viewModel.setProperty("/StatusList", StatusList);
                const ParameterStatusList = [
                    {
                        "StatusId": "Pending",
                        "StatusDesc": "Pending"
                    },
                    {
                        "StatusId": "Accepted",
                        "StatusDesc": "Accepted"
                    },
                    {
                        "StatusId": "Rejected",
                        "StatusDesc": "Rejected"
                    },
                    {
                        "StatusId": "NA",
                        "StatusDesc": "NA"
                    }
                ]
                viewModel.setProperty("/ParameterStatusList", StatusList);
                const UsageDecisionStockTypeList = [
                    {
                        "StockTypeId": "VMENGE01",
                        "StockTypeDesc": "To Unrestricted"
                    },
                    {
                        "StockTypeId": "VMENGE02",
                        "StockTypeDesc": "To Scrap"
                    },
                    {
                        "StockTypeId": "VMENGE03",
                        "StockTypeDesc": "To Sample Consumption"
                    },
                    {
                        "StockTypeId": "VMENGE04",
                        "StockTypeDesc": "To Blocked Stock"
                    },
                    {
                        "StockTypeId": "VMENGE05",
                        "StockTypeDesc": "To Reserves"
                    },
                    {
                        "StockTypeId": "VMENGE06",
                        "StockTypeDesc": "To New Material"
                    },
                    {
                        "StockTypeId": "VMENGE07",
                        "StockTypeDesc": "Return Inventory Posting"
                    }
                ]
                viewModel.setProperty("/UsageDecisionStockTypeList", UsageDecisionStockTypeList);
                this.getStorageLocation(viewModel.getProperty("/Plant"));
                //this.getStorageLocation();
                // const StorageLocationList = [
                //     {
                //         "StorageLocationId": "9022",
                //         "StorageLocationDesc": "9022"
                //     }
                // ];
                // viewModel.setProperty("/StorageLocationList", StorageLocationList);
            },
            getStorageLocation: async function (plantCode) {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                this.RemovesStorageLocation();
                await this.createNewModelUsingAPI(
                    'GET',
                    `/sap/opu/odata4/sap/zune_sb_storagelocation_api/srvd_a2x/sap/zune_sd_storagelocation_api/0001/ZUNE_CDS_StorageLoactionAPI?$filter=Plant eq '${plantCode}'`,
                    '',
                    'MStorageLocation'
                );
                const data = this.getView().getModel('MStorageLocation').getData();
                const { value = [] } = data || {};
                viewModel.setProperty(`/StorageLocationList`, value);
            },
            RemovesStorageLocation: function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const modelName = this.getEntryFormDataSourceModelName();
                const { StorageLocationList = [] } = viewModel.getData();
                for (let i = StorageLocationList.length - 1; i >= 0; i--) {
                    this.deleteRowWithoutConfirmation(modelName, 'StorageLocationList', i);
                }
            },
            CheckDocumentSummary: function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const { SerialBatchDetails = [] } = viewModel.getData();
                let documentSummary = "";
                let draft = 0, pendingPosting = 0, posted = 0;
                SerialBatchDetails.forEach((element, index) => {
                    element.RowNumber = index + 1;
                    element.AddParameters = true;
                    if (element.Status == "Ready To Post") {
                        pendingPosting = pendingPosting + 1;
                    }
                    else if (element.Status == "Posted") {
                        posted = posted + 1;
                    }
                    else {
                        draft = draft + 1
                    }
                });
                documentSummary = "Draft(" + draft + "), P-Posting(" + pendingPosting + "), Posted(" + posted + ")";
                viewModel.setProperty(`/DocumentSummary`, documentSummary);
            },
            onPressNewStockTransfer: function () {
                try {
                  
                    var oRowObject = "";
                    this.setRouteData("3", oRowObject);
                    this.setListViewEditPropertyValue(oRowObject);
                    this.router.navTo(this.getForwardRoute());
                } catch (error) {
                    console.log(error);
                    MessageToast.show(error);
                }
            },
            onStockTransfer: function (oEvent) {
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
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const plant = viewModel.getProperty("/Plant");
                const inspectionLot = viewModel.getProperty("/InspectionLot");
                let oModel = this.getView().getModel('sysModel');
                oModel.setProperty('/route/routeData/plant', plant);
                oModel.setProperty('/route/routeData/inspectionLot', inspectionLot);
                this.getView().setModel(oModel, 'sysModel');
                var sPath = oBindingContext.getPath(); // e.g., "/Role/1"
                console.log("Binding Path:", sPath);
                this.setRouteData("2", oRowObject);
                this.setListViewEditPropertyValue(oRowObject);

                this.router.navTo(this.getForwardRoute());
            },
            onPressUDPosting: async function () {
                try {
                    debugger;
                    oBusyIndicator.show(0);
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const status = viewModel.getProperty("/Status");
                    const transferedQuantity = viewModel.getProperty("/TransferedQuantity");
                    const quantity = viewModel.getProperty("/Quantity");
                    if (Number(transferedQuantity) == Number(quantity) && (status == "Draft" || status == "Completed")) {
                        await this.PostingUserDecisionToSAPSystem();
                    }
                    else {
                        if (status == "UD-Posted") {
                            MessageToast.show("Already posted");
                            viewModel.setProperty("/PostUD", false);
                            viewModel.refresh(true);
                        }
                        else {
                            MessageToast.show("Not posting, check status");
                        }
                    }
                    oBusyIndicator.hide();
                }
                catch (error) {
                    oBusyIndicator.hide();
                    message.show(error);
                }
            },
            PostingUserDecisionToSAPSystem: async function () {
                try {
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const inspectionChangeDateTime1 = await this.FetchInspectionLotChanngeTime(viewModel.getProperty("/InspectionLot"));
                    const inspectionChangeDateTime = this.convertDotNetDate(inspectionChangeDateTime1);
                    oBusyIndicator.show(0);
                    debugger;
                    let csrfTokenValue = "";
                    this.getResponseHeaderDataList().forEach(oHeaderDataObj => {
                        const headerDataKey = oHeaderDataObj.pHeaderKey;
                        const headerDataValue = oHeaderDataObj.pHeaderValue;
                        if (headerDataKey == "x-csrf-token") {
                            csrfTokenValue = headerDataValue;
                        }
                    });
                    var userDecisionData = {
                        "d": {
                            "InspectionLot": viewModel.getProperty("/InspectionLot"),
                            "InspLotUsageDecisionLevel": "L",
                            "InspectionLotQualityScore": "100",
                            "InspLotUsageDecisionCatalog": "3",
                            "SelectedCodeSetPlant": viewModel.getProperty("/Plant"),
                            "InspLotUsgeDcsnSelectedSet": "UD04",
                            "InspLotUsageDecisionCodeGroup": "UD04",
                            "InspectionLotUsageDecisionCode": "A1",
                            "InspLotUsageDecisionValuation": "A",
                            "InspLotUsgeDcsnFollowUpAction": "SWM_A",
                            "InspLotUsgeDcsnHasLongText": false,
                            "ChangedDateTime": inspectionChangeDateTime
                        }
                    }
                    console.log(userDecisionData);
                    const requestData = JSON.stringify(userDecisionData);
                    console.log(requestData);
                    debugger;
                    try {
                        var myHeaders = new Headers();
                        myHeaders.append("x-csrf-token", csrfTokenValue);
                        myHeaders.append("Content-Type", "application/json");
                        myHeaders.append("Cookie", "sap-XSRF_PTF_100=M0AHePSW9me4qTryjDfByg%3d%3d20250811153524Uu0peuZQZpNz9Lg8z-vNR05X0Rp0LOnVBw8s9Vjdie8%3d; sap-usercontext=sap-client=100");
                        const requestOptions = {
                            method: "POST",
                            headers: myHeaders,
                            body: requestData,
                            redirect: "follow"
                        };
                        debugger;
                        let isPostedSuccessfully = false;
                        await fetch(`/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspLotUsageDecision`, requestOptions)
                            .then(async (response) => {
                                debugger;
                                const textData = await response.text()
                                console.log("textData -" + textData);
                                if (response.ok) {
                                    isPostedSuccessfully = true;
                                    MessageToast.show("UD Posted.");
                                } else {
                                    MessageToast.show("Error in posting UD.. Check log.");
                                    isPostedSuccessfully = false;
                                }
                            })
                            .then((result) => console.log(result))
                            .catch((error) => {
                                console.error(error);
                                isPostedSuccessfully = false;
                                MessageToast.show("Error in posting UD.. Check log.");
                            });
                        debugger;
                        if (isPostedSuccessfully) {
                            MessageToast.show("UD Posted.");
                            await this.UpdateRecordResultHeaderStatusAfterUD(viewModel.getProperty("/ID"), "UD-Posted");
                        }
                        else {
                            MessageToast.show("Error posting stock transfer. Check SAP logs");
                        }
                    } catch (error) {
                        console.log(error);
                        MessageToast.show(error);
                    }
                    viewModel.refresh(true);

                }
                catch (error) {
                    console.log(error);
                }
            },
            UpdateRecordResultHeaderStatusAfterUD: async function (value) {
                try {
                    const dataJson = {
                        Status: "UD-Posted"
                    };
                    await this.createNewModelUsingAPI(
                        'PATCH',
                        `odata/v4/record-result-sap/RecordResultSAPHead(ID=${value})`,
                        dataJson,
                        'UpdatedRecordResultStatus'
                    );
                }
                catch (error) {
                    console.log(error);
                }
            },
            FetchInspectionLotChanngeTime: async function (value) {
                var myHeaders = new Headers();
                myHeaders.append("x-csrf-token", "fetch");
                await this.createNewModelUsingAPIFetchMethod(
                    'GET',
                    `/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspectionLot('${value}')?$format=json`,
                    myHeaders,
                    '',
                    'InspectionData',
                    'json'
                );
                let changeDateTime = "";
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const responseData = this.getView().getModel('InspectionData').getData();
                if (responseData && responseData != "undefined") {
                    const inspectionData = responseData.d;
                    const tokenCSRF = responseData.Token;
                    if (inspectionData && inspectionData != "undefined") {
                        changeDateTime = inspectionData.ChangedDateTime;
                    }
                    else {
                        MessageToast.show("Error fetching inspection data.");
                    }
                }
                else {
                    MessageToast.show("Error fetching inspection data.");
                }
                return changeDateTime;
            },
            convertDotNetDate: function (dotNetDateString) {
                // Match the milliseconds part using regex
                const match = /\/Date\((\d+)([+-]\d+)?\)\//.exec(dotNetDateString);
                if (!match) {
                    throw new Error("Invalid date format");
                }

                const milliseconds = parseInt(match[1], 10);
                const date = new Date(milliseconds);

                return date.toISOString(); // Outputs in ISO 8601 format
            },
            EnableDisableUDPostingButton: function () {
                try {
                    const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const quantity = viewModel.getProperty("/Quantity");
                    const transferedTuantity = viewModel.getProperty("/TransferedQuantity");
                    const status = viewModel.getProperty("/Status");
                    let isEnabled = false;
                    if (quantity == transferedTuantity) {
                        isEnabled = true;
                    }
                    if (status == "UD-Posted") {
                        isEnabled = false;
                        viewModel.setProperty("/AddNewTransferEnable", false);
                    }
                    viewModel.setProperty("/PostUD", isEnabled);
                    viewModel.refresh(true);
                }
                catch (error) {
                    console.log(error);
                    MessageToast.show(error);
                }
            },
            UpdateRecordResultHeaderStatus: async function (inspectionLotId, status) {
                try {
                    const dataJson = {
                        Status: status
                    };
                    await this.createNewModelUsingAPI(
                        'PATCH',
                        `odata/v4/record-result-sap/RecordResultSAPHead(ID=${inspectionLotId})`,
                        dataJson,
                        'UpdatedRecordResultStatus'
                    );
                }
                catch (error) {
                    console.log(error);
                }
            },
            onCancel: function () {
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting View.....")
                router.navTo("RouterNameStockTransferSAPViewForm");
            }
        });
    });