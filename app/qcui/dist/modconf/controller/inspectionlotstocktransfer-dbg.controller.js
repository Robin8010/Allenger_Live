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
        return genericentryform.extend("modconfcontroller.inspectionlotstocktransfer", {

            onInit: function () {

                genericentryform.prototype.onInit.apply(this, arguments);
                //this.initialize();
                oBusyIndicator = BusyIndicator;
            },
            onBeforeShow: async function (oEvent) {
                this.identifyFormMode(oEvent);
                await this.initialize();
                await this.setEntryFormDataSourceURLForEditMode("/odata/v4/record-result-sap/RecordResultDecisionHead(ID = " + this.getListViewEditPropertyValue() + ")?$expand=RecordResultDecisionDetail($orderby=SerialBatchNumber)");
                await this.showEntryForm();
                this.handleUIOperation();
            },
            initialize: async function () {
                this.setPageId("stocktransferf");
                this.setFormTitle("Stock Transfer Form");
                this.setBackwardRoute("RouterNameStockTransferSAPViewForm");
                this.setForwardRoute("RouterNameStockTransferParametersEntryForm");

                this.setEntryFormDataSourceURLToAddData("/odata/v4/record-result-sap/RecordResultDecisionHead");
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/record-result-sap/RecordResultDecisionHead/" + this.getListViewEditPropertyValue() + "");
                this.setListViewFilterColumn();
                let oPath = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/inspectionlotstocktransfer.json", // Edit Response Model
                );
                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());

                let oPathSaveReq = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/inspectionlotstocktransferSaveRequest.json", //Save Request Model
                );

                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "stockTransferSaveRequest");
            },
            getInspectionLotUniqueId: function () {
                try {
                    let sysModel = this.getView().getModel('sysModel');
                    //alert(JSON.stringify(oModel));
                    const inspectionLotUniqueId = sysModel.getProperty('/route/routeData/lastUniqueId');
                    return inspectionLotUniqueId;
                }
                catch (error) {
                    console.log(error);
                    MessageToast.show(error);
                }
            },
            getInspectionLotPlantCode: function () {
                try {
                    let sysModel = this.getView().getModel('sysModel');
                    //alert(JSON.stringify(oModel));
                    const plantCode = sysModel.getProperty('/route/routeData/plant');
                    return plantCode;
                }
                catch (error) {
                    console.log(error);
                    MessageToast.show(error);
                }
            },
            getInspectionLotNumber: function () {
                try {
                    let sysModel = this.getView().getModel('sysModel');
                    //alert(JSON.stringify(oModel));
                    const inspectionLot = sysModel.getProperty('/route/routeData/inspectionLot');
                    return inspectionLot;
                }
                catch (error) {
                    console.log(error);
                    MessageToast.show(error);
                }
            },
            handleUIOperation: async function () {
                const formMode = this.getFormMode();
                if (formMode === "2") {
                    this.handleFormInEditMode();
                    this.ChangeStatusResultrecordPosted();
                    //this.SetEnableDisableProperty(false);
                    this.SetConstantValuesInEditMode();
                    this.EnableDisablePostButton(true);

                }
                else {
                    debugger;
                    await this.fetchInspectionData(this.getInspectionLotUniqueId());
                    await this.ShowDefaultValues();
                    await this.RemovesSerialNumbers();
                    this.EnableDisablePostButton(false);
                }
            },
            EnableDisablePostButton: function (value) {
                try {
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    if (value) {
                        const staus = viewModel.getProperty("/Status");
                        if (staus == "Posted") {
                            value = false;
                            viewModel.setProperty("/SaveButton", false);
                            viewModel.setProperty("/StockTypeEditable", false);
                            viewModel.setProperty("/SorageLocationEditable", false);
                            viewModel.setProperty("/PostDateEnabled", false);
                        }
                    }
                    viewModel.setProperty("/PostButton", value);
                    viewModel.refresh(true);
                }
                catch (error) {
                    console.log(error);
                    MessageToast.show(error);
                }
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
                const { RecordResultDecisionDetail = [] } = viewModel.getData();
                await RecordResultDecisionDetail.forEach((element, index) => {
                    element.RowNumber = index + 1;
                    element.PostDataEnable = false;
                });
                viewModel.setProperty(`/RecordResultDecisionDetail`, RecordResultDecisionDetail);
                this.SetConstantValuesInEditMode();
                //this.CheckDocumentSummary();
            },
            SetConstantValuesInEditMode: async function () {
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
                const plantCode = await this.getInspectionLotPlantCode();
                this.getStorageLocation(plantCode);
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
            RemovesSerialNumbers: async function () {
                debugger;
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const modelName = this.getEntryFormDataSourceModelName();
                const { RecordResultDecisionDetail = [] } = viewModel.getData();
                for (let i = RecordResultDecisionDetail.length - 1; i >= 0; i--) {
                    const serialData = RecordResultDecisionDetail[i];
                    const id = serialData.SerialBatchNumberID;
                    if (!id || id == "undefined" || id == "") {
                        await this.deleteRowWithoutConfirmation(modelName, 'RecordResultDecisionDetail', i);
                    }
                }
            },
            fetchInspectionData: async function (value) {
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead(ID=${value})?$expand=SerialBatchDetails($filter=Status eq 'Ready To Post')`,
                    '',
                    'InspectionData'
                );
                const responseData = this.getView().getModel('InspectionData').getData();
                if (responseData && responseData != "undefined" && responseData != "") {
                    const inspectionData = responseData;
                    const inspectionLotNumber = inspectionData.InspectionLot;
                    const plantCode = inspectionData.Plant;
                    if (inspectionLotNumber && inspectionLotNumber != "undefined" && inspectionLotNumber != "") {
                        let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

                        let serialData = inspectionData.SerialBatchDetails;
                        if (serialData && serialData != "undefined" && serialData.length > 0) {
                            for (let i = 0; i < serialData.length; i++) {
                                var obj = serialData[i];
                                const srialNumber = obj.SerialBatchNumber;
                                let isSerialAdded = await this.ValidateSerialAlreadyAdded(srialNumber, value);
                                debugger;
                                if (!isSerialAdded) {
                                    var newRow = {
                                        "RowNumber": i + 1,
                                        "SerialBatchNumberID": obj.ID,
                                        "SerialBatchNumber": obj.SerialBatchNumber,
                                        "Quantity": obj.Quantity,
                                        "Status": obj.Status
                                    };
                                    this.addRowInObj('RecordResultDecisionDetail', newRow, 'RowNumber');
                                }
                            }
                            this.getStorageLocation(plantCode);
                            //this.CheckDocumentSummary();
                        }
                        else {
                            MessageToast.show("No serial for posting.");
                        }
                    }
                    else {
                        MessageToast.show("Inspection lot number not defined.");
                    }
                }
                else {
                    MessageToast.show("Failed to fetch inspection data.");
                }
            },
            ValidateSerialAlreadyAdded: async function (value, inspectionLotId) {
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultDecisionDetail?$filter=SerialBatchNumber eq '${value}' and RecordResultDecisionHead_ID eq '${inspectionLotId}'`,
                    '',
                    'SerialAddedData'
                );
                debugger;
                const responseData = this.getView().getModel('SerialAddedData').getData();
                if (responseData && responseData != "undefined" && responseData.value.length > 0) {
                    return true;
                }
                return false;
            },
            RemovesUncheckedSerialNumbers: async function () {
                try {
                    debugger;
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const modelName = this.getEntryFormDataSourceModelName();
                    const { RecordResultDecisionDetail = [] } = viewModel.getData();
                    for (let i = RecordResultDecisionDetail.length - 1; i >= 0; i--) {
                        const serialData = RecordResultDecisionDetail[i];
                        const selected = serialData.PostData;
                        if (!selected) {
                            await this.deleteRowWithoutConfirmation(modelName, 'RecordResultDecisionDetail', i);
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                    MessageToast.show(error);
                }
            },
            onSave: async function () {
                try {
                    oBusyIndicator.show(0);
                    debugger;
                    const isDataValidated = await this.DataValidationsForSave();
                    if (isDataValidated) {
                        await this.RemovesUncheckedSerialNumbers();
                        let trgObject = await this.PrepareObjectForSaveTransfer();
                        console.log("Target Object:", trgObject);
                        const formMode = this.getFormMode();
                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        let requestOptions = "";
                        let url = "";
                        if (formMode == 2) {
                            requestOptions = {
                                method: "PATCH",
                                headers: myHeaders,
                                body: trgObject,
                                redirect: "follow"
                            };
                            url = this.getEntryFormDataSourceURLToUpdateData();
                        }
                        else {

                            requestOptions = {
                                method: "POST",
                                headers: myHeaders,
                                body: trgObject,
                                redirect: "follow"
                            };
                            url = this.getEntryFormDataSourceURLToAddData();
                        }

                        debugger;
                        let isPostedSuccessfully = false;
                        await fetch(url, requestOptions)
                            .then(async (response) => {
                                debugger;
                                const textData = await response.json()
                                console.log("Data -" + textData);
                                if (response.ok) {
                                    isPostedSuccessfully = true;
                                    MessageToast.show("Draft saved.");
                                } else {
                                    MessageToast.show("Error in saving draft.. Check log.");
                                    isPostedSuccessfully = false;
                                }
                            })
                            .then((result) => console.log(result))
                            .catch((error) => {
                                console.error(error);
                                isPostedSuccessfully = false;
                                MessageToast.show("Error in saving draft.. Check log.");
                            });
                        debugger;
                        if (isPostedSuccessfully) {
                            this.onCancel();
                        }
                    }
                    oBusyIndicator.hide();
                } catch (error) {
                    console.log(error);
                    MessageToast.show(error);
                    oBusyIndicator.hide();
                }
            },
            DataValidationsForSave: async function () {
                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                var usageDecisionStockType = oModel.getProperty("/UsageDecisionStockType");
                if (!usageDecisionStockType || usageDecisionStockType == "undefined" || usageDecisionStockType == "") {
                    MessageToast.show("Select Stock Type");
                    return false;
                }
                var storageLocation = oModel.getProperty("/StorageLocation");
                if (!storageLocation || storageLocation == "undefined" || storageLocation == "") {
                    MessageToast.show("Select Storage Location");
                    return false;
                }
                var postDate = oModel.getProperty("/PostDate");
                if (!postDate || postDate == "undefined" || postDate == "") {
                    MessageToast.show("Select Post date");
                    return false;
                }
                var isRowValidated = false;
                const { RecordResultDecisionDetail = [] } = oModel.getData();
                await RecordResultDecisionDetail.forEach((element, index) => {
                    const PostTransfer = element.PostData;
                    if (PostTransfer) {
                        isRowValidated = true;
                    }
                });
                if (!isRowValidated) {
                    MessageToast.show("Select Serial for transfer");
                    return false;
                }
                return true;
            },
            PrepareObjectForSaveTransfer: async function () {
                try {
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const { RecordResultDecisionDetail = [] } = viewModel.getData();
                    let serialData = [];
                    let count = 0;
                    await RecordResultDecisionDetail.forEach((element, index) => {
                        const serialDt = {
                            ID: element.ID,
                            PostData: true,
                            SerialBatchNumberID: element.SerialBatchNumberID,
                            SerialBatchNumber: element.SerialBatchNumber,
                            Quantity: element.Quantity,
                            Status: element.Status
                        }
                        serialData.push(serialDt);
                        count = count + 1;
                    });

                    const serialsData = JSON.stringify(serialData);
                    const formMode = this.getFormMode();
                    var transferID = "";
                    if (formMode == 2) {
                        transferID = this.getListViewEditPropertyValue();
                    }
                    var stockTransferRequestData = {
                        "ID": transferID,
                        "RecordResultSAPHead_ID": this.getInspectionLotUniqueId(),
                        "PostDate": viewModel.getProperty("/PostDate"),
                        "Quantity": RecordResultDecisionDetail.length,
                        "Status": viewModel.getProperty("/Status"),
                        "UsageDecisionStockType": viewModel.getProperty("/UsageDecisionStockType"),
                        "StorageLocation": viewModel.getProperty("/StorageLocation"),
                        "RecordResultDecisionDetail": serialData
                    }
                    console.log(stockTransferRequestData);
                    const requestData = JSON.stringify(stockTransferRequestData);
                    console.log(requestData);
                    return requestData;
                }
                catch (error) {
                    throw error;
                }
            },
            onPostStockTransfer: async function () {
                try {
                    debugger;
                    var _textData = "";
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const inspectionLot = await this.getInspectionLotNumber();
                    const inspectionChangeDateTime1 = await this.FetchInspectionLotChanngeTime(inspectionLot);
                    const inspectionChangeDateTime = await this.convertDotNetDate(inspectionChangeDateTime1);
                    debugger;
                    let csrfTokenValue = "";
                    await this.getResponseHeaderDataList().forEach(oHeaderDataObj => {
                        const headerDataKey = oHeaderDataObj.pHeaderKey;
                        const headerDataValue = oHeaderDataObj.pHeaderValue;
                        if (headerDataKey == "x-csrf-token") {
                            csrfTokenValue = headerDataValue;
                        }
                    });
                    if (csrfTokenValue && csrfTokenValue != "undefined" && csrfTokenValue != "") {
                        const { RecordResultDecisionDetail = [] } = viewModel.getData();
                        let serialData = [];
                        let count = 0;
                        await RecordResultDecisionDetail.forEach((element, index) => {
                            const serialDt = {
                                SerialNumber: element.SerialBatchNumber
                            }
                            serialData.push(serialDt);
                            count = count + 1;
                        });
                        const serialsData = JSON.stringify(serialData);
                        var stockTransferRequestData = {
                            "d": {
                                "InspectionLot": inspectionLot,
                                "InspLotQtyPosted": `${count}`,
                                "UsageDecisionStockType": viewModel.getProperty("/UsageDecisionStockType"),
                                "StorageLocation": viewModel.getProperty("/StorageLocation"),
                                "ChangedDateTime": inspectionChangeDateTime,
                                "to_InspLotMatlDocItmSrlNmbr": serialData
                            }
                        }
                        console.log(stockTransferRequestData);
                        const requestData = JSON.stringify(stockTransferRequestData);
                        console.log(requestData);
                        var myHeaders = new Headers();
                        myHeaders.append("x-csrf-token", csrfTokenValue);
                        myHeaders.append("Content-Type", "application/json");
                        myHeaders.append("Accept", "application/json");
                        myHeaders.append("Cookie", "sap-XSRF_PTF_100=M0AHePSW9me4qTryjDfByg%3d%3d20250811153524Uu0peuZQZpNz9Lg8z-vNR05X0Rp0LOnVBw8s9Vjdie8%3d; sap-usercontext=sap-client=100");
                        const requestOptions = {
                            method: "POST",
                            headers: myHeaders,
                            body: requestData,
                            redirect: "follow"
                        };
                        debugger;
                        let isPostedSuccessfully = false;
                        await fetch(`/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspLotMatlDocItem`, requestOptions)
                            .then(async (response) => {
                                debugger;
                                _textData = await response.json()
                                console.log("textData -" + _textData);
                                if (response.ok) {
                                    isPostedSuccessfully = true;
                                    MessageToast.show("Transfer Posted.");
                                } else {
                                    MessageToast.show("Error in posting transfer.. Check log.");
                                    isPostedSuccessfully = false;
                                }
                            })
                            .then((result) => console.log(result))
                            .catch((error) => {
                                console.error(error);
                                isPostedSuccessfully = false;
                                MessageToast.show("Error in posting transfer.. Check log.");
                            });
                        debugger;
                        if (isPostedSuccessfully) {
                            await RecordResultDecisionDetail.forEach(async (element, index) => {
                                element.Status = "Posted"
                                await this.UpdateRecordResultRowLevelPostingStatus(element.SerialBatchNumberID, "Posted", index);
                            });
                            viewModel.setProperty("/Status", "Posted");
                            viewModel.refresh(true);
                            this.onSave();
                        }
                        else {

                            debugger;
                            //const data = JSON.stringify(_textData);
                            //const data= await response.json();

                            let oModel = new sap.ui.model.json.JSONModel(_textData);
                            this.getView().setModel(oModel, "ErrorJson");

                            let ErrorModel = this.getView().getModel('ErrorJson');
                            const FinalError = ErrorModel.getProperty('/error/message/value');
                            const errorCode = ErrorModel.getProperty('/error/code');

                            //console.log("response data -", data);
                            // MessageToast.show("Error posting stock transfer. Check SAP logs");
                            MessageToast.show(FinalError);
                            if (String(errorCode).includes("185")) {
                                await MessageBox.show('Already posted. Updatye Status?', {
                                    title: 'Confirm',
                                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                                    onClose: async function (oAction) {
                                        if (oAction == 'YES') {
                                            debugger;
                                            MessageToast.show("Updating Status.");
                                            await RecordResultDecisionDetail.forEach(async (element, index) => {
                                                element.Status = "Posted"
                                                await this.UpdateRecordResultRowLevelPostingStatus(element.SerialBatchNumberID, "Posted", index);
                                            });
                                            viewModel.setProperty("/Status", "Posted");
                                            viewModel.refresh(true);
                                            this.onSave();
                                        }
                                    }.bind(this)
                                });
                            }
                        }
                    }
                    else {
                        throw new error("CSRF token invalid.");
                    }
                }
                catch (error) {
                    console.log(error);
                    MessageToast.show(error);
                }
            },
            UpdateRecordResultRowLevelPostingStatus: async function (id, status, rowIndex) {
                const dataJson = {
                    Status: "Posted"
                };
                await this.createNewModelUsingAPI(
                    'PATCH',
                    `odata/v4/record-result-sap/RecordResultSerialBatchDetail(ID=${id})`,
                    dataJson,
                    'UpdatedSerialStatus'
                );
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
            onCancel: function () {
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                var oRowObject = this.getInspectionLotUniqueId();
                this.setRouteData("2", oRowObject);
                this.setListViewEditPropertyValue(oRowObject);
                MessageToast.show("Redirecting to SAP Stock Transfer View.....")
                router.navTo("RouterNameInspectionLotDecisionForm");
            },
            ChangeStatusResultrecordPosted: function () {
                debugger;
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const { RecordResultDecisionDetail = [] } = viewModel.getData();
                RecordResultDecisionDetail.forEach(async (element, index) => {
                    if (element.Status == "Posted") {
                        await this.UpdateRecordResultRowLevelPostingStatus(element.SerialBatchNumberID, "Posted", index);
                    }
                });
            },
            onSearch: function (oEvent) {
                var sQuery = oEvent.getParameter("newValue"); // Get search input
                var filters = [];
                var filter1 = new sap.ui.model.Filter({ path: "SerialBatchNumber", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter2 = new sap.ui.model.Filter({ path: "Status", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                filters = [filter1, filter2];
                var finalFilter = new sap.ui.model.Filter({ filters: filters, and: false });
                var otable = this.byId("smSerialBatchDetails");
                otable.getBinding("items").filter(finalFilter);
            }
        });
    });