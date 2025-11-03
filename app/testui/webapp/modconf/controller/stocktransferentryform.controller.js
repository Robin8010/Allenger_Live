const { stat } = require("@sap/cds/lib/utils/cds-utils");

sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    function (genericentryform, MessageToast, MessageBox) {
        "use strict";
        var _RoleInfo = null, _LoginInfo;

        return genericentryform.extend("modconfcontroller.stocktransferentryform", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
                //this.initialize();
            },
            onBeforeShow: async function (oEvent) {
                debugger;
                await this.isValidUser();
                this.identifyFormMode(oEvent);
                this.initialize();
                this.setEntryFormDataSourceURLForEditMode("/odata/v4/inventory-transfer-sap/InventoryTransferSAPHead(ID = " + this.getListViewEditPropertyValue() + ")?$expand=SerialBatchDetails($orderby=SerialBatchNumber)");
                await this.showEntryForm();
                this.handleUIOperation();
            },
            initialize: async function () {
                this.setPageId("stocktransferf");
                this.setFormTitle("Stock Transfer Form");
                this.setBackwardRoute("RouterNameStockTransferViewForm");
                this.setForwardRoute("RouterNameStockTransferParametersEntryForm");
                this.setEntryFormDataSourceURLForNewMode("");

                this.setEntryFormDataSourceURLToAddData("/odata/v4/inventory-transfer-sap/InventoryTransferSAPHead");
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/inventory-transfer-sap/InventoryTransferSAPHead('" + this.getListViewEditPropertyValue() + "')");
                this.setListViewFilterColumn();
                let oPath = jQuery.sap.getModulePath(
                    "testui",
                    "/modconf/model/stockTransferEntryForm.json", // Edit Response Model
                );
                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());

                let oPathSaveReq = jQuery.sap.getModulePath(
                    "testui",
                    "/modconf/model/stockTransferSaveRequest.json", //Save Request Model
                );

                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "stockTransferSaveRequest");
            },
            handleUIOperation: function () {
                const formMode = this.getFormMode();
                if (formMode === "2") {
                    this.handleFormInEditMode();
                    this.SetEnableDisableProperty(false);
                    this.SetConstantValuesInEditMode();
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
                const { SerialBatchDetails = [] } = viewModel.getData();
                await SerialBatchDetails.forEach((element, index) => {
                    element.RowNumber = index + 1;
                    element.AddParameters = true;
                    if (element.Status != "Draft") {
                        element.CopyParameters = true;
                    }
                    else {
                        element.CopyParameters = false;
                    }
                    if (element.Status != "Posted") {
                        element.StockTypeEditable = true;
                        element.SorageLocationEditable = true;
                    }
                    else {
                        element.StockTypeEditable = false;
                        element.SorageLocationEditable = false;
                    }
                });
                viewModel.setProperty(`/SerialBatchDetails`, SerialBatchDetails);
                this.SetConstantValuesInEditMode();
                this.CheckDocumentSummary();
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
                this.getStorageLocation();
                // const StorageLocationList = [
                //     {
                //         "StorageLocationId": "9022",
                //         "StorageLocationDesc": "9022"
                //     }
                // ];
                // viewModel.setProperty("/StorageLocationList", StorageLocationList);
            },
            getStorageLocation: async function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                this.RemovesStorageLocation();
                const plantCode = viewModel.getProperty("/Plant");
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
            ChangeInspectionLot: function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                let InspectionLot = viewModel.getProperty(`/InspectionLot`);
                viewModel.setProperty(`/SerialNumber`, "");
                viewModel.setProperty(`/Quantity`, "0.00");
                viewModel.setProperty(`/AcceptedQuantity`, "0.00");
                viewModel.setProperty(`/RejectedQuantity`, "0.00");
                this.RemovesDetailsRows();
                this.fetchInspectionData(InspectionLot);
            },
            cflForInspectionLot: async function () {
                try {
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/odata/v4/record-result-sap/RecordResultSAPHead?$filter=Status in ('Draft','Completed')&$select=InspectionLot,Material`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );
                    this.setCflDisplayColumns(['Inspection Lot', 'Material Code']);
                    this.setCflDataColumns(['InspectionLot', 'Material']);
                    this.setCflValueAndDisplay('Inspection Lot', 'InspectionLot', '', '');

                    this.showCfl(
                        'InspectionLot',
                        this.getCflListViewDataSourceModelName(),
                        'value',
                        this.onConfirmInspectionLot.bind(this)
                    );
                }
                catch (error) {
                    MessageBox.show("cflForInspectionLot -: " + error.message);
                }
            },
            onConfirmInspectionLot: function () {
                let x = this.getCflObject();
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                viewModel.setProperty(`/InspectionLot`, x.InspectionLot);
                viewModel.setProperty(`/SerialNumber`, "");
                viewModel.setProperty(`/Quantity`, "0.00");
                viewModel.setProperty(`/AcceptedQuantity`, "0.00");
                viewModel.setProperty(`/RejectedQuantity`, "0.00");
                this.RemovesDetailsRows();
                this.fetchInspectionData(x.InspectionLot);
                //this.getStorageLocation();
                this.ShowDefaultValues();
            },
            RemovesDetailsRows: function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const modelName = this.getEntryFormDataSourceModelName();
                const { SerialBatchDetails = [] } = viewModel.getData();
                for (let i = SerialBatchDetails.length - 1; i >= 0; i--) {
                    this.deleteRowWithoutConfirmation(modelName, 'SerialBatchDetails', i);
                }
            },
            fetchInspectionData: async function (value) {
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead?$filter=InspectionLot eq '${value}'&$expand=SerialBatchDetails($filter=Status eq 'Ready To Post')`,
                    '',
                    'InspectionData'
                );
                let checkDataExists = false;
                const responseData = this.getView().getModel('InspectionData').getData();
                if (responseData && responseData != "undefined" && responseData.value.length > 0) {
                    const inspectionData = responseData.value[0];
                    if (inspectionData && inspectionData != "undefined") {
                        const inspectionLotNumber = inspectionData.InspectionLot;
                        if (inspectionLotNumber && inspectionLotNumber != "undefined" && inspectionLotNumber != "") {
                            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                            viewModel.setProperty(`/RecordResultID`, inspectionData.ID);
                            viewModel.setProperty(`/Material`, inspectionData.Material);
                            viewModel.setProperty(`/Plant`, inspectionData.Plant);
                            viewModel.setProperty(`/ManagedBy`, inspectionData.ManagedBy);
                            viewModel.setProperty(`/Quantity`, inspectionData.Quantity);
                            //npm install node-fetch xml2js
                            let serialData = inspectionData.SerialBatchDetails;
                            if (serialData && serialData != "undefined" && serialData.length > 0) {
                                for (let i = 0; i < serialData.length; i++) {
                                    var obj = serialData[i];
                                    const srialNumber = obj.SerialBatchNumber;
                                    let isSerialAdded = await this.ValidateSerialAlreadyAdded(srialNumber);
                                    debugger;
                                    if (!isSerialAdded) {
                                        var newRow = {
                                            "RowNumber": i + 1,
                                            "SerialBatchNumberID": obj.ID,
                                            "SerialBatchNumber": obj.SerialBatchNumber,
                                            "Quantity": obj.Quantity,
                                            "Status": obj.Status
                                        };
                                        this.addRowInObj('SerialBatchDetails', newRow, 'RowNumber');
                                    }
                                }
                                this.getStorageLocation();
                                this.CheckDocumentSummary();
                            }
                            else {
                                MessageToast.show("No serial for posting.");
                            }
                            // if (manageBy == "None") {
                            //     var newRow = {
                            //         "RowNumber": 1,
                            //         "SerialBatchNumber": "None",
                            //         "Quantity": inspectionData.InspectionLotQuantity,
                            //         "Status": "Draft",
                            //         "AddParameters": false,
                            //     };
                            //     this.addRowInObj('SerialBatchDetails', newRow, 'RowNumber');
                            // }
                            // else if (manageBy == "Batch") {
                            //     this.FetchBatchData(value);
                            // }
                            // else if (manageBy == "Serial") {
                            //     this.FetchSerialData(value);
                            // }
                            checkDataExists = true;
                        }
                    }
                }
                if (!checkDataExists) {
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    viewModel.setProperty(`/InspectionLot`, "");
                    viewModel.setProperty(`/Material`, "");
                    viewModel.setProperty(`/Plant`, "");
                    viewModel.setProperty(`/SerialNumber`, "");
                    viewModel.setProperty(`/ManagedBy`, "");
                    MessageToast.show("Invalid Lot No..");
                }
            },
            ValidateSerialAlreadyAdded: async function (value) {
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/inventory-transfer-sap/InventoryTransferSerialBatchDetail?$filter=SerialBatchNumber eq '${value}'`,
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
            CheckQualityScrore: function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const quantity = viewModel.getProperty(`/Quantity`);
                const acceptedQuantity = viewModel.getProperty(`/AcceptedQuantity`);
                const qualityScore = (acceptedQuantity / quantity) * 100;
                viewModel.setProperty(`/QuantityScore`, Math.round(qualityScore));
                viewModel.refresh(true);
            },
            onSave: async function () {
                try {
                    if (this.DataValidationsForSave()) {
                        let isRecordAdded = false;
                        const formMode = this.getFormMode();
                        // if (formMode === "3") {
                        //     const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        //     var inspectionLot = oModelData.getProperty("/InspectionLot");
                        //     var serialNumber = oModelData.getProperty("/SerialNumber");
                        //     await this.createNewModelUsingAPI(
                        //         'GET',
                        //         `/odata/v4/inventory-transfer-sap/InventoryTransferSAPHead?$filter=(InspectionLot eq '${inspectionLot}')`,
                        //         '',
                        //         'InspectionLotData'
                        //     );
                        //     const inspectionLotData = this.getView().getModel('InspectionLotData').getData();
                        //     if (inspectionLotData && inspectionLotData.value && inspectionLotData.value.length > 0) {
                        //         MessageToast.show("Record already added for this inspection lot.");
                        //         isRecordAdded = true;
                        //     }
                        // }
                        //if (!isRecordAdded) {
                        let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        oModel.setProperty("/Status", "Draft");
                        let oData = oModel.getData();

                        const modelData = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                        let trgObject = this.getView().getModel("stockTransferSaveRequest").getData();
                        console.log("Target Object:", trgObject);

                        this.transferObjectValues(modelData, trgObject);
                        await this.onPressOfEntryFormSaveButton(trgObject);
                        let response = this.getApiResponseObject();;
                        if (response.success) {
                            console.log("No duplicate found. Proceeding with save..okok.");
                            this.router.navTo(this.getBackwardRoute());
                            MessageToast.show("Record added successfully");
                        }
                        //}
                    }
                    else {

                    }
                }
                catch (error) {
                    MessageBox.show(error.message);
                }
            },
            DataValidationsForSave: async function () {
                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                var inspectionLot = oModel.getProperty("/InspectionLot");
                if (!inspectionLot || inspectionLot == "undefined" || inspectionLot == "") {
                    MessageToast.show("Select inspection lot");
                    return false;
                }
                var postDate = oModel.getProperty("/PostDate");
                if (!postDate || postDate == "undefined" || postDate == "") {
                    MessageToast.show("Select Post date");
                    return false;
                }
                var isRowValidated = true;
                const { SerialBatchDetails = [] } = oModel.getData();
                await SerialBatchDetails.forEach((element, index) => {
                    const userDecisionStockType = element.UsageDecisionStockType;
                    const StorageLocation = element.StorageLocation;
                    if (!userDecisionStockType || userDecisionStockType == "undefined" | userDecisionStockType == "") {
                        MessageToast.show("Select user decision stock type.");
                        isRowValidated = false;
                    }
                    if (!StorageLocation || StorageLocation == "undefined" | StorageLocation == "") {
                        MessageToast.show("Select user storage location.");
                        isRowValidated = false;
                    }
                });
                if (!isRowValidated) {
                    return false;
                }
                // const quantity = oModel.getProperty(`/Quantity`);
                // const acceptedQuantity = oModel.getProperty(`/AcceptedQuantity`);
                // const rejectedQuantity = oModel.getProperty(`/RejectedQuantity`);
                // const inputQuantity = this.ToDecimal(acceptedQuantity) + this.ToDecimal(rejectedQuantity);
                // if (this.ToDecimal(inputQuantity) != this.ToDecimal(quantity)) {
                //     MessageToast.show("Accepted quantity and rejected quantity should be equal to quantity.");
                //     return false;
                // }
                return true;
            },
            onCancel: function () {
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to SAP Stock Transfer View.....")
                router.navTo("RouterNameStockTransferViewForm");
            },
            onPressParameters: function (oEvent) {
                var oButton = oEvent.getSource();

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
                const materialCocde = viewModel.getProperty("/Material");
                const inspectionDate = viewModel.getProperty("/PostDate");
                let oModel = this.getView().getModel('sysModel');
                //alert(JSON.stringify(oModel));
                oModel.setProperty('/route/routeData/lastUniqueId', this.getListViewEditPropertyValue());
                oModel.setProperty('/route/routeData/plant', plant);
                oModel.setProperty('/route/routeData/material', materialCocde);
                oModel.setProperty('/route/routeData/inspectionDate', inspectionDate);
                this.getView().setModel(oModel, 'sysModel');

                var sPath = oBindingContext.getPath(); // e.g., "/Role/1"
                console.log("Binding Path:", sPath);
                this.setRouteData("2", oRowObject);
                this.setListViewEditPropertyValue(oRowObject);

                this.router.navTo(this.getForwardRoute());
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
            onStockTransfer1: async function () {
                try {
                    debugger;
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const inspectionChangeDateTime1 = await this.FetchInspectionLotChanngeTime(viewModel.getProperty("/InspectionLot"));
                    const inspectionChangeDateTime = this.convertDotNetDate(inspectionChangeDateTime1);

                    debugger;
                    let csrfTokenValue = "";
                    this.getResponseHeaderDataList().forEach(oHeaderDataObj => {
                        const headerDataKey = oHeaderDataObj.pHeaderKey;
                        const headerDataValue = oHeaderDataObj.pHeaderValue;
                        if (headerDataKey == "x-csrf-token") {
                            csrfTokenValue = headerDataValue;
                        }
                    });
                    await this.StockTransferPostingMethod(csrfTokenValue,)
                }
                catch (error) {
                    console.log(error);
                }
            },
            StockTransferPostingMethod: async function (csrfTokenValue, jsonBody) {
                try {
                    const myHeaders = new Headers();
                    myHeaders.append("x-csrf-token", csrfTokenValue);
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Cookie", "sap-XSRF_PTF_100=M0AHePSW9me4qTryjDfByg%3d%3d20250811153524Uu0peuZQZpNz9Lg8z-vNR05X0Rp0LOnVBw8s9Vjdie8%3d; sap-usercontext=sap-client=100");

                    const raw = JSON.stringify(jsonBody);
                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow"
                    };
                    fetch(`/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspLotMatlDocItem`, requestOptions)
                        .then((response) => response.text())
                        .then((result) => console.log(result))
                        .catch((error) => console.error(error));
                }
                catch (error) {
                    console.log(error);
                }
            },
            onStockTransfer: async function () {
                try {
                    const formMode = this.getFormMode();
                    if (formMode == "2") {
                        debugger;
                        let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        let isSerialAvailableForPosting = await this.CheckAllSerialForPendingPosting();
                        if (isSerialAvailableForPosting) {

                            const inspectionChangeDateTime1 = await this.FetchInspectionLotChanngeTime(viewModel.getProperty("/InspectionLot"));
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
                                const { SerialBatchDetails = [] } = viewModel.getData();
                                await SerialBatchDetails.forEach(async (element, index) => {
                                    if (element.Status == "Ready To Post") {
                                        //if (element.Status == element.Status) {
                                        const usageDecisionStockType = element.UsageDecisionStockType;
                                        const storageLocation = element.StorageLocation;
                                        await this.PostStockTransfer(usageDecisionStockType, storageLocation, inspectionChangeDateTime, csrfTokenValue);
                                    }
                                });
                            }
                            else {
                                MessageToast.show("Error in fetching CSRF token.");
                            }
                        }
                        else {
                            MessageToast.show("Stock already transfered...");
                        }
                        await this.CheckAllRecordResultSerialPosted();
                        await this.CheckAllRecordResultSerialPostedForUDFposting();
                    }
                }
                catch (error) {
                    console.log(error);
                }
            },
            PostStockTransfer: async function (value1, value2, inspectionChangeDateTime, csrfTokenValue) {
                debugger;
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const { SerialBatchDetails = [] } = viewModel.getData();
                let serialData = [];
                let count = 0;
                await SerialBatchDetails.forEach((element, index) => {
                    if (element.Status == "Ready To Post") {
                        const usageDecisionStockType = element.UsageDecisionStockType;
                        const storageLocation = element.StorageLocation;
                        if (value1 == usageDecisionStockType && value2 == storageLocation) {
                            if (count > 0) {
                                serialData = serialData + ",";
                            }
                            const serialDt = {
                                SerialNumber: element.SerialBatchNumber
                            }
                            serialData.push(serialDt);
                            count = count + 1;
                        }
                    }
                });

                const serialsData = JSON.stringify(serialData);
                var stockTransferRequestData = {
                    "d": {
                        "InspectionLot": viewModel.getProperty("/InspectionLot"),
                        "InspLotQtyPosted": `${count}`,
                        "UsageDecisionStockType": value1,
                        "StorageLocation": value2,
                        "ChangedDateTime": inspectionChangeDateTime,
                        "to_InspLotMatlDocItmSrlNmbr": serialData
                    }
                }
                console.log(stockTransferRequestData);
                const requestData = JSON.stringify(stockTransferRequestData);
                console.log(requestData);
                debugger;
                try {
                    const CSRFToken = viewModel.getProperty("/CSRFToken");
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
                    await fetch(`/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspLotMatlDocItem`, requestOptions)
                        .then(async (response) => {
                            debugger;
                            const textData = await response.text()
                            console.log("textData -" + textData);
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
                        await SerialBatchDetails.forEach(async (element, index) => {
                            const usageDecisionStockType = element.UsageDecisionStockType;
                            const storageLocation = element.StorageLocation;
                            if (value1 == usageDecisionStockType && value2 == storageLocation) {
                                element.Status = "Posted"
                                await this.UpdateStockTransferRowLevelPostingStatus(element.ID, "Posted", index);
                                await this.UpdateRecordResultRowLevelPostingStatus(element.SerialBatchNumberID, "Posted", index);
                            }
                        });
                    }
                    else {
                        MessageToast.show("Error posting stock transfer. Check SAP logs");
                    }
                } catch (error) {
                    MessageToast.show(error);
                }
                viewModel.refresh(true);
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
                // const headerResponse1 = this.getView().getModel('x-csrf-token').getData();
                // const headerResponse = viewModel.getProperty("/CSRFToken");                
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
            CheckAllSerialForPendingPosting: async function () {
                let isSerialAvailableForPosting = false;
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const { SerialBatchDetails = [] } = viewModel.getData();
                await SerialBatchDetails.forEach(async (element, index) => {
                    if (element.Status == "Ready To Post") {
                        isSerialAvailableForPosting = true;
                        //if (element.Status == element.Status) {
                        // const usageDecisionStockType = element.UsageDecisionStockType;
                        // const storageLocation = element.StorageLocation;
                        // await this.PostStockTransfer(usageDecisionStockType, storageLocation, inspectionChangeDateTime, csrfTokenValue);
                    }
                    else {
                        await this.UpdateRecordResultRowLevelPostingStatus(element.SerialBatchNumberID, "Posted", index);
                    }
                });
                if (!isSerialAvailableForPosting) {
                    const id = viewModel.getProperty("/ID");
                    await this.UpdateStockTransferHeaderPostingStatus(id);
                }
                return isSerialAvailableForPosting;
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
            CheckAllRecordResultSerialPosted: async function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const inspectionLot = viewModel.getProperty("/InspectionLot");
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                await this.createNewModelUsingAPIFetchMethod(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead?$expand=SerialBatchDetails&$filter=InspectionLot eq ${inspectionLot}`,
                    myHeaders,
                    '',
                    'RecordResultData',
                    'json'
                );
                const responseData = this.getView().getModel('RecordResultData').getData();
                if (responseData && responseData != "undefined" && responseData != "") {
                    let isDataExistsForPosting = false;
                    const { SerialBatchDetails = [] } = responseData.value[0];
                    await SerialBatchDetails.forEach((element, index) => {
                        if (element.Status != "Posted") {
                            isDataExistsForPosting = true;
                        }
                    });
                    if (!isDataExistsForPosting) {
                        const dataJson = {
                            Status: "Completed"
                        };
                        debugger;
                        const id = responseData.value[0].ID;
                        const DocStatus = responseData.value[0].Status;
                        if (DocStatus == "Draft") {
                            await this.createNewModelUsingAPI(
                                'PATCH',
                                `odata/v4/record-result-sap/RecordResultSAPHead(ID=${id})`,
                                dataJson,
                                'UpdatedRecordResultStatus'
                            );
                        }
                    }
                }
            },
            CheckAllRecordResultSerialPostedForUDFposting: async function () {
                debugger;
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const inspectionLot = viewModel.getProperty("/InspectionLot");
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                await this.createNewModelUsingAPIFetchMethod(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead?$expand=SerialBatchDetails&$filter=InspectionLot eq ${inspectionLot}`,
                    myHeaders,
                    '',
                    'RecordResultData',
                    'json'
                );
                debugger;
                const responseData = this.getView().getModel('RecordResultData').getData();
                if (responseData && responseData != "undefined" && responseData != "") {
                    let isPendingForPostingUD = false;
                    const status = responseData.value[0].Status;
                    const id = responseData.value[0].ID;
                    if (status == "Completed") {
                        isPendingForPostingUD = true;
                    }
                    if (isPendingForPostingUD) {
                        debugger;
                        await this.PostingUserDecisionToSAPSystem(responseData);
                    }
                }
            },
            PostingUserDecisionToSAPSystem: async function (responseData) {
                try {
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const inspectionChangeDateTime1 = await this.FetchInspectionLotChanngeTime(viewModel.getProperty("/InspectionLot"));
                    const inspectionChangeDateTime = this.convertDotNetDate(inspectionChangeDateTime1);

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
                        const CSRFToken = viewModel.getProperty("/CSRFToken");
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
                            await this.UpdateRecordResultHeaderStatusAfterUD(responseData.value[0].ID);
                        }
                        else {
                            MessageToast.show("Error posting stock transfer. Check SAP logs");
                        }
                    } catch (error) {
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
            UpdateStockTransferRowLevelPostingStatus: async function (id) {
                const dataJson = {
                    Status: "Posted"
                };
                await this.createNewModelUsingAPI(
                    'PATCH',
                    `odata/v4/inventory-transfer-sap/InventoryTransferSerialBatchDetail(ID=${id})`,
                    dataJson,
                    'UpdatedSerialStatus'
                );
            },
            UpdateStockTransferHeaderPostingStatus: async function (id, status, rowIndex) {
                const dataJson = {
                    Status: "Completed"
                };
                await this.createNewModelUsingAPI(
                    'PATCH',
                    `odata/v4/inventory-transfer-sap/InventoryTransferSAPHead(ID=${id})`,
                    dataJson,
                    'UpdatedSerialStatus'
                );
            },
            UpdateStatusPosted: async function () {
                try {
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const { SerialBatchDetails = [] } = viewModel.getData();
                    await SerialBatchDetails.forEach(async (element, index) => {
                        debugger;
                        element.Status = "Posted"
                        await this.UpdateStockTransferRowLevelPostingStatus(element.ID, "Posted", index);
                        await this.UpdateRecordResultRowLevelPostingStatus(element.SerialBatchNumberID, "Posted", index);
                    });
                    viewModel.setProperty("/Status", "Completed");
                    await this.CheckAllSerialForPendingPosting();
                    await this.CheckAllRecordResultSerialPosted();
                    debugger;
                    await this.CheckAllRecordResultSerialPostedForUDFposting();
                    MessageToast.show("All status updated.");
                    viewModel.refresh(true);
                }
                catch (error) {
                    console.log(error);
                }
            },

            isValidUser: function () {
                // let loginInfo=this.getLoginInfo();
                // let userid = loginInfo.UserID;

                const loginModel = this.getOwnerComponent().getModel('UserModel');
                if (!loginModel || loginModel === 'undefined') {
                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                    router.navTo("RouteIndexPage");
                    MessageToast.show("Not a valid user.");
                }
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