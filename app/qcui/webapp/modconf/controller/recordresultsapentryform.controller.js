sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],

    function (genericentryform, MessageToast, MessageBox, FormMode) {
        "use strict";
        var _RoleInfo = null, _LoginInfo;

        return genericentryform.extend("modconfcontroller.recordresultsapentryform", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
                //this.initialize();
            },
            onBeforeShow: async function (oEvent) {
                this.isValidUser();
                this.identifyFormMode(oEvent);
                this.initialize();
                this.setEntryFormDataSourceURLForEditMode("/odata/v4/record-result-sap/RecordResultSAPHead(ID = " + this.getListViewEditPropertyValue() + ")?$expand=SerialBatchDetails($orderby=SerialBatchNumber)");
                await this.showEntryForm();
                this.handleUIOperation();
            },
            initialize: async function () {
                this.setPageId("recordresultsapf");
                this.setFormTitle("SAP Record Result Form");
                this.setBackwardRoute("RouterNameRecordResultSAPViewForm");
                this.setForwardRoute("RouterNameRecordResultParametersEntryForm");
                this.setEntryFormDataSourceURLForNewMode("");

                this.setEntryFormDataSourceURLToAddData("/odata/v4/record-result-sap/RecordResultSAPHead");
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/record-result-sap/RecordResultSAPHead('" + this.getListViewEditPropertyValue() + "')");
                this.setListViewFilterColumn();
                let oPath = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/resultRecordSAPEntryForm.json", // Edit Response Model
                );
                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());

                let oPathSaveReq = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/resultRecordSAPSaveRequest.json", //Save Request Model
                );

                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "recordResultSaveRequest");
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
            handleFormInEditMode: function () {
                const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const { SerialBatchDetails = [] } = viewModel.getData();
                SerialBatchDetails.forEach((element, index) => {
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
                //this.getStorageLocation();
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
            cflForInspectionLot_old: async function () {
                try {
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspectionLot?$format=json`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );
                    this.setCflDisplayColumns(['Inspection Lot', 'Material Code']);
                    this.setCflDataColumns(['InspectionLot', 'Material']);
                    this.setCflValueAndDisplay('Inspection Lot', 'InspectionLot', '', '');

                    this.showCfl(
                        'InspectionLot',
                        this.getCflListViewDataSourceModelName(),
                        'd/results',
                        this.onConfirmInspectionLot.bind(this)
                    );
                }
                catch (error) {
                    MessageBox.show("cflForInspectionLot -: " + error.message);
                }
            },
            cflForInspectionLot: async function () {
                try {
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/sap/opu/odata4/sap/zune_sb_insplotrelstatus_api/srvd_a2x/sap/zune_sd_insplotrelstatus_api/0001/ZUNE_CDS_INSPLOTRELSTATUS?$format=json`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );
                    this.setCflDisplayColumns(['Inspection Lot']);
                    this.setCflDataColumns(['InspectionLot']);
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
                    `/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspectionLot('${value}')`,
                    '',
                    'InspectionData'
                );
                let checkDataExists = false;
                const responseData = this.getView().getModel('InspectionData').getData();
                if (responseData && responseData != "undefined") {
                    const inspectionData = responseData.d;
                    if (inspectionData && inspectionData != "undefined") {
                        const inspectionLotNumber = inspectionData.InspectionLot;
                        if (inspectionLotNumber && inspectionLotNumber != "undefined" && inspectionLotNumber != "") {
                            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                            viewModel.setProperty(`/Material`, inspectionData.Material);
                            viewModel.setProperty(`/Plant`, inspectionData.Plant);
                            viewModel.setProperty(`/ManufacturingOrder`, inspectionData.ManufacturingOrder);
                            viewModel.setProperty(`/SerialNumber`, "");
                            await this.CheckMaterialManageBy(inspectionData.Material);
                            viewModel.setProperty(`/Quantity`, inspectionData.InspectionLotQuantity);
                            const manageBy = viewModel.getProperty(`/ManagedBy`);
                            if (manageBy == "None") {
                                var newRow = {
                                    "RowNumber": 1,
                                    "SerialBatchNumber": "None",
                                    "Quantity": inspectionData.InspectionLotQuantity,
                                    "Status": "Draft",
                                    "AddParameters": false,
                                };
                                this.addRowInObj('SerialBatchDetails', newRow, 'RowNumber');
                            }
                            else if (manageBy == "Batch") {
                                this.FetchBatchData(value);
                            }
                            else if (manageBy == "Serial") {
                                this.FetchSerialData(value);
                            }
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
            FetchSerialData: async function (value) {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                await this.createNewModelUsingAPI(
                    'GET',
                    `/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspLotSerialNumber?$filter=InspectionLot eq '${value}'`,
                    '',
                    'SerialNumberData'
                );
                let checkDataExists = false;
                const responseData = this.getView().getModel('SerialNumberData').getData();
                if (responseData && responseData != "undefined") {
                    const serialData = responseData.d.results;
                    if (serialData && serialData != "undefined") {
                        for (let i = 0; i < serialData.length; i++) {
                            var obj = serialData[i];
                            var newRow = {
                                "RowNumber": i + 1,
                                "SerialBatchNumber": obj.SerialNumber,
                                "Quantity": 1,
                                "Status": "Draft",
                                "AddParameters": false,
                                "CopyParameters": false
                            };
                            this.addRowInObj('SerialBatchDetails', newRow, 'RowNumber');
                        }
                    }
                }
            },
            FetchBatchData: async function (value) {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                await this.createNewModelUsingAPI(
                    'GET',
                    `/sap/opu/odata/sap/YY1_INSPECTIONBATCH_CDS/YY1_InspectionBatch(InspectionLot='${value}')`,
                    '',
                    'BatchNumberData'
                );
                let checkDataExists = false;
                const responseData = this.getView().getModel('BatchNumberData').getData();
                if (responseData && responseData != "undefined") {
                    let serialData = responseData.d.results;
                    if (serialData && serialData != "undefined") {
                        for (let i = 0; i < serialData.length; i++) {
                            var obj = serialData[i];
                            var newRow = {
                                "RowNumber": i + 1,
                                "SerialBatchNumber": obj.Batch,
                                "Quantity": viewModel.getProperty(`/Quantity`),
                                "Status": "Draft",
                                "AddParameters": false,
                                "CopyParameters": false
                            };
                            this.addRowInObj('SerialBatchDetails', newRow, 'RowNumber');
                        }
                    }
                    else {
                        serialData = responseData.d;
                        if (serialData && serialData != "undefined") {
                            var newRow = {
                                "RowNumber": 1,
                                "SerialBatchNumber": serialData.Batch,
                                "Quantity": viewModel.getProperty(`/Quantity`),
                                "Status": "Draft",
                                "AddParameters": false,
                                "CopyParameters": false
                            };
                            this.addRowInObj('SerialBatchDetails', newRow, 'RowNumber');
                        }
                    }
                }
            },
            CheckMaterialManageBy: async function (value) {
                await this.createNewModelUsingAPI(
                    'GET',
                    `/sap/opu/odata/sap/API_PRODUCT_SRV/A_Product('${value}')/to_Plant`,
                    '',
                    'MaterialData'
                );
                let checkDataExists = false;
                const responseData = this.getView().getModel('MaterialData').getData();
                if (responseData && responseData != "undefined") {
                    const materialData = responseData.d.results;
                    if (materialData && materialData != "undefined" && materialData.length > 0) {
                        const isBatchManagementRequired = materialData[0].IsBatchManagementRequired;
                        const serialNumberProfile = materialData[0].SerialNumberProfile;
                        let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        if (isBatchManagementRequired) {
                            viewModel.setProperty(`/ManagedBy`, "Batch");
                            viewModel.setProperty(`/SerialNumberEnabled`, true);
                        }
                        else if (serialNumberProfile && serialNumberProfile != "undefined" && serialNumberProfile != "") {
                            viewModel.setProperty(`/ManagedBy`, "Serial");
                            viewModel.setProperty(`/SerialNumberEnabled`, true);
                        }
                        else {
                            viewModel.setProperty(`/ManagedBy`, "None");
                            viewModel.setProperty(`/SerialNumberEnabled`, false);
                        }
                    }
                }
            },
            ValidateQuantity: function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const quantity = viewModel.getProperty(`/Quantity`);
                const acceptedQuantity = viewModel.getProperty(`/AcceptedQuantity`);
                const rejectedQuantity = viewModel.getProperty(`/RejectedQuantity`);
                const inputQuantity = this.ToDecimal(acceptedQuantity) + this.ToDecimal(rejectedQuantity);
                if (this.ToDecimal(inputQuantity) > this.ToDecimal(quantity)) {
                    MessageToast.show("Accepted quantity and rejected quantity should be equal to quantity.");
                    viewModel.setProperty(`/AcceptedQuantity`, quantity);
                    viewModel.setProperty(`/RejectedQuantity`, 0.00);
                    viewModel.refresh(true);
                }
                this.CheckQualityScrore();
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
                    debugger;
                    if (this.DataValidationsForSave()) {
                        let isRecordAdded = false;
                        const formMode = this.getFormMode();
                        if (formMode === "3") {
                            const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                            var inspectionLot = oModelData.getProperty("/InspectionLot");
                            var serialNumber = oModelData.getProperty("/SerialNumber");
                            await this.createNewModelUsingAPI(
                                'GET',
                                `/odata/v4/record-result-sap/RecordResultSAPHead?$filter=(InspectionLot eq '${inspectionLot}')`,
                                '',
                                'InspectionLotData'
                            );
                            const inspectionLotData = this.getView().getModel('InspectionLotData').getData();
                            if (inspectionLotData && inspectionLotData.value && inspectionLotData.value.length > 0) {
                                MessageToast.show("Record already added for this inspection lot.");
                                isRecordAdded = true;
                            }
                        }
                        if (!isRecordAdded) {
                            let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                            oModel.setProperty("/Status", "Draft");
                            let oData = oModel.getData();

                            const modelData = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                            let trgObject = this.getView().getModel("recordResultSaveRequest").getData();
                            console.log("Target Object:", trgObject);

                            this.transferObjectValues(modelData, trgObject);
                            await this.onPressOfEntryFormSaveButton(trgObject);
                            let response = this.getApiResponseObject();;
                            if (response.success) {
                                console.log("No duplicate found. Proceeding with save..okok.");
                                this.router.navTo(this.getBackwardRoute());
                                MessageToast.show("Record added successfully");
                            }
                        }
                    }
                    else {

                    }
                }
                catch (error) {
                    MessageBox.show(error.message);
                }
            },
            DataValidationsForSave: function () {
                var LineNum=0;
                
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                 const _quantity = viewModel.getProperty(`/Quantity`);
                //const modelName = this.getEntryFormDataSourceModelName();
                const { SerialBatchDetails = [] } = viewModel.getData();
                LineNum=SerialBatchDetails.length;
                if(this.ToDecimal(LineNum)!=this.ToDecimal(_quantity))
                {
                  MessageToast.show("Lot quantity and serial should be equal...");
                    return false;  
                }
                
                
                var inspectionLot = viewModel.getProperty("/InspectionLot");
                if (!inspectionLot || inspectionLot == "undefined" || inspectionLot == "") {
                    MessageToast.show("Select inspection lot");
                    return false;
                }
                var postDate = viewModel.getProperty("/PostDate");
                if (!postDate || postDate == "undefined" || postDate == "") {
                    MessageToast.show("Select Post date");
                    return false;
                }
                const quantity = viewModel.getProperty(`/Quantity`);
                const acceptedQuantity = viewModel.getProperty(`/AcceptedQuantity`);
                const rejectedQuantity = viewModel.getProperty(`/RejectedQuantity`);
                const inputQuantity = this.ToDecimal(acceptedQuantity) + this.ToDecimal(rejectedQuantity);
                // if (this.ToDecimal(inputQuantity) != this.ToDecimal(quantity)) {
                //     MessageToast.show("Accepted quantity and rejected quantity should be equal to quantity.");
                //     return false;
                // }
                return true;
            },
            onCancel: function () {
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to SAP Record Result.....")
                router.navTo("RouterNameRecordResultSAPViewForm");
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
            onPressCopyParameters: function (oEvent) {
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
                let copingData = false;
                this.CopyParametersDetailsToAll(oRowObject);
                // MessageBox.show('Are you sure you want to copy record?', {
                //     title: 'Confirm',
                //     actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                //     onClose: function (oAction) {
                //         if (oAction == 'YES') {
                //             CopyParametersDetailsToAll();
                //             debugger;
                //             copingData = true;
                //         }
                //     }
                // });
                // if (copingData) {
                //     debugger;
                //     this.CopyParametersDetailsToAll();
                // }
            },
            CopyParametersDetailsToAll: async function (value) {
                try {
                    debugger;
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    let savedData = false;
                    const modelName = this.getEntryFormDataSourceModelName();
                    const { SerialBatchDetails = [] } = viewModel.getData();
                    for (let i = 0; i < SerialBatchDetails.length; i++) {
                        const element = SerialBatchDetails[i];
                        const id = element.ID;
                        if (id == value) {
                            await this.createNewModelUsingAPI(
                                'GET',
                                `/odata/v4/record-result-sap/RecordResultSerialBatchDetail(ID=${id})?$expand=ParametersDetails`,
                                '',
                                'SerialMainModel'
                            );
                            const SerialMainModel = this.getView().getModel('SerialMainModel').getData();
                            await MessageBox.show('Are you sure you want to copy record?', {
                                title: 'Confirm',
                                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                                onClose: async function (oAction) {
                                    if (oAction == 'YES') {
                                        debugger;
                                        MessageToast.show("Coping parameters data.");
                                        for (let j = 0; j < SerialBatchDetails.length; j++) {
                                            //for (let j = 0; j < 20; j++) {
                                            let childObject = SerialBatchDetails[j];
                                            const childId = childObject.ID;
                                            const childStatus = childObject.Status;
                                            if (childStatus == "Draft" || childId == "" || childStatus == "undefined") {
                                                MessageToast.show("Coping for " + childObject.SerialBatchNumber + " row number - " + (j + 1));

                                                let parametersNewJson = {
                                                    "Quantity": childObject.Quantity,
                                                    "RecordResultSAPHead_ID": childObject.RecordResultSAPHead_ID,
                                                    "SerialBatchNumber": childObject.SerialBatchNumber,
                                                    "Status": "Ready To Post",
                                                    "InspectionPlanStatus": "2",
                                                    "ParametersDetails": [
                                                        {
                                                            "Attribute": "",
                                                            "ID": "",
                                                            "InstrumentDesc": "",
                                                            "InstrumentId": "",
                                                            "Observation": "",
                                                            "ParameterCode": "",
                                                            "ParameterName": "",
                                                            "RecordResultSerialBatchDetail_ID": "",
                                                            "Remarks1": "",
                                                            "Remarks2": "",
                                                            "Status": "Draft"
                                                        }
                                                    ]
                                                };
                                                let oNewParametersModel = new sap.ui.model.json.JSONModel(parametersNewJson)
                                                let oNewParametersModelData1 = oNewParametersModel.getData();
                                                let childObjectParameters = oNewParametersModelData1.ParametersDetails;
                                                if (childObjectParameters && childObjectParameters != "undefined" && childObjectParameters.length > 0) {
                                                    for (let k = childObjectParameters.length - 1; k >= 0; k--) {
                                                        childObjectParameters.splice(k, 1);
                                                    }
                                                    oNewParametersModel.setData(oNewParametersModelData1);
                                                }

                                                const parentObjectParameters = SerialMainModel.ParametersDetails;
                                                for (let k = 0; k < parentObjectParameters.length; k++) {
                                                    const parentParamObjRow = parentObjectParameters[k];

                                                    var newRow = {
                                                        "ParameterCode": parentParamObjRow.ParameterCode,
                                                        "ParameterName": parentParamObjRow.ParameterName,
                                                        "Attribute": parentParamObjRow.Attribute,
                                                        "Observation": parentParamObjRow.Observation,
                                                        "InstrumentId": parentParamObjRow.InstrumentId,
                                                        "InstrumentDesc": parentParamObjRow.InstrumentDesc,
                                                        "Status": parentParamObjRow.Status,
                                                        "Remarks1": parentParamObjRow.Remarks1,
                                                        "Remarks2": parentParamObjRow.Remarks2
                                                    };
                                                    let oNewParametersModelData = oNewParametersModel.getData();
                                                    oNewParametersModelData["ParametersDetails"].push(newRow);
                                                    oNewParametersModel.setData(oNewParametersModelData);
                                                }
                                                debugger;
                                                try {
                                                    await this.createNewModelUsingAPI(
                                                        'PATCH',
                                                        `/odata/v4/record-result-sap/RecordResultSerialBatchDetail(ID='${childId}')`,
                                                        oNewParametersModel.getData(),
                                                        'oNewParametersModelSaved'
                                                    );
                                                    const SerialMainModel = this.getView().getModel('oNewParametersModelSaved').getData();
                                                    savedData = true;
                                                }
                                                catch (error) {
                                                    console.log(error);
                                                    MessageToast.show("Error while update parameter for  - " + childObject.SerialBatchNumber);
                                                }
                                            }
                                        }
                                        if (savedData) {
                                            var router = sap.ui.core.UIComponent.getRouterFor(this);
                                            MessageToast.show("Redirecting to SAP Record Result.....")
                                            router.navTo("RouterNameRecordResultSAPViewForm");
                                        }
                                    }
                                }.bind(this)
                            });
                            break;
                        }
                        //this.deleteRowWithoutConfirmation(modelName, 'SerialBatchDetails', i);
                    }
                }
                catch (error) {
                    console.log(error);
                    MessageToast.show("Error in coping. Check log and try again");
                }
            },
            CheckAllRecordPosted: async function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const docStatus = viewModel.getProperty('/')
                let isDataExistsForPosting = false;
                const { SerialBatchDetails = [] } = viewModel.getData();
                SerialBatchDetails.forEach((element, index) => {
                    if (element.Status != "Posted") {
                        isDataExistsForPosting = true;
                    }
                });
                if (!isDataExistsForPosting) {
                    const dataJson = {
                        Status: "Completed"
                    };
                    const id = viewModel.getProperty("/ID");
                    const status = viewModel.getProperty("/Status");
                    if (status == "Draft") {
                        viewModel.setProperty("/Status", "Completed");
                        viewModel.refresh(true);
                        await this.createNewModelUsingAPI(
                            'PATCH',
                            `odata/v4/record-result-sap/RecordResultSAPHead(ID=${id})`,
                            dataJson,
                            'UpdatedSerialStatus'
                        );
                    }
                }
            },
            onPostRecordResult: async function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const docStatus = viewModel.getProperty('/')
                let isDataExistsForPosting = false;
                let postingRecordCount = 0;
                const { SerialBatchDetails = [] } = viewModel.getData();
                SerialBatchDetails.forEach((element, index) => {
                    if (element.Status == "Ready To Post") {
                        isDataExistsForPosting = true;
                        postingRecordCount = postingRecordCount + 1;
                    }
                });
                if (isDataExistsForPosting) {
                    MessageToast.show("Posting " + postingRecordCount + " records.");
                    SerialBatchDetails.forEach(async (element, index) => {
                        if (element.Status == "Ready To Post") {
                            try {
                                const StorageLocation = element.StorageLocation;

                                element.Status = "Posted";
                                await this.UpdatePostingStatus(element.ID, "Posted", index);
                            }
                            catch (error) {
                                console.log(error);
                                MessageToast.show("Error updating status." + index);
                            }
                        }
                    });
                }
                else {
                    MessageToast.show("No record for posting.");
                }
                viewModel.setProperty(`/SerialBatchDetails`, SerialBatchDetails);
                viewModel.refresh(true);
                await this.CheckAllRecordPosted();
            },
            UpdatePostingStatus: async function (id, status, rowIndex) {
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
            onSearch: function (oEvent) {
                var sQuery = oEvent.getParameter("newValue"); // Get search input
                var filters = [];
                var filter1 = new sap.ui.model.Filter({ path: "SerialBatchNumber", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter2 = new sap.ui.model.Filter({ path: "Status", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                filters = [filter1, filter2];
                var finalFilter = new sap.ui.model.Filter({ filters: filters, and: false });
                var otable = this.byId("smSerialBatchDetails");
                otable.getBinding("items").filter(finalFilter);
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
            }
        });
    });