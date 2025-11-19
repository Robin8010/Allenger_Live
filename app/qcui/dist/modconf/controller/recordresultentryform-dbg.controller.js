sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],

    function (genericentryform, MessageToast, MessageBox, FormMode) {
        "use strict";
        var _RoleInfo = null, _LoginInfo;

        return genericentryform.extend("modconfcontroller.recordresultentryform", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
                //this.initialize();
            },
            onBeforeShow: async function (oEvent) {
                this.identifyFormMode(oEvent);
                this.initialize();
                this.setEntryFormDataSourceURLForEditMode("/odata/v4/record-result/RecordResultHead(ID = " + this.getListViewEditPropertyValue() + ")?$expand=ParameterDetails");
                await this.showEntryForm();
                this.handleUIOperation();
            },
            initialize: async function () {
                this.setPageId("recordresultf");
                this.setFormTitle("Record Result Form");
                this.setBackwardRoute("RouterNameRecordResultViewForm");

                this.setEntryFormDataSourceURLForNewMode("");

                this.setEntryFormDataSourceURLToAddData("/odata/v4/record-result/RecordResultHead");
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/record-result/RecordResultHead('" + this.getListViewEditPropertyValue() + "')");
                this.setListViewFilterColumn();
                let oPath = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/inspectionLotEntryForm.json", // Edit Response Model
                );
                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());

                let oPathSaveReq = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/inspectionLotSaveRequest.json", //Save Request Model
                );

                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "inspectionLotSaveRequest");
            },
            handleUIOperation: function () {
                const formMode = this.getFormMode();
                if (formMode === "2") {
                    this.handleFormInEditMode();
                    this.SetEnableDisableProperty(false);
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
                const { ParameterDetails = [] } = viewModel.getData();
                ParameterDetails.forEach((element, index) => {
                    element.RowNumber = index + 1
                });
                viewModel.setProperty(`/ParameterDetails`, ParameterDetails);
                this.SetConstantValuesInEditMode();
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
                const  ParameterStatusList = [
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
                    }
                  ]
                  viewModel.setProperty("/ParameterStatusList", StatusList);
            },
            ChangeInspectionLot: function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                let InspectionLot = viewModel.getProperty(`/InspectionLot`);
                viewModel.setProperty(`/SerialNumber`, "");
                viewModel.setProperty(`/Quantity`, "0.00");
                viewModel.setProperty(`/AcceptedQuantity`, "0.00");
                viewModel.setProperty(`/RejectedQuantity`, "0.00");
                this.fetchInspectionData(InspectionLot);
            },
            cflForInspectionLot: async function () {
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
            onConfirmInspectionLot: function () {
                let x = this.getCflObject();
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                viewModel.setProperty(`/InspectionLot`, x.InspectionLot);
                viewModel.setProperty(`/SerialNumber`, "");
                viewModel.setProperty(`/Quantity`, "0.00");
                viewModel.setProperty(`/AcceptedQuantity`, "0.00");
                viewModel.setProperty(`/RejectedQuantity`, "0.00");
                this.fetchInspectionData(x.InspectionLot);
                this.ShowDefaultValues();
            },
            cflForInspectionSerial: async function () {
                try {
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const inspectionLotNumber = viewModel.getProperty(`/InspectionLot`);
                    if (inspectionLotNumber && inspectionLotNumber != 'undefined') {
                        await this.createNewModelUsingAPI(
                            'GET',
                            `/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspLotSerialNumber?$filter=InspectionLot eq '${inspectionLotNumber}'`,
                            '',
                            this.getCflListViewDataSourceModelName()
                        );
                        this.setCflDisplayColumns(['Inspection Lot', 'Serial No']);
                        this.setCflDataColumns(['InspectionLot', 'SerialNumber']);
                        this.setCflValueAndDisplay('Inspection Lot', 'InspectionLot', 'Serial No', 'SerialNumber');

                        this.showCfl(
                            'Serial No',
                            this.getCflListViewDataSourceModelName(),
                            'd/results',
                            this.onConfirmSerialNo.bind(this)
                        );
                    }
                    else {
                        MessageToast.show("Select inspection lot.");
                    }
                }
                catch (error) {
                    MessageBox.show("cflForSerialNo -: " + error.message);
                }
            },
            onConfirmSerialNo: function () {
                let x = this.getCflObject();
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                viewModel.setProperty(`/SerialNumber`, x.SerialNumber);
                viewModel.setProperty(`/Quantity`, "1");
            },
            ChangeSerialNumber: async function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                let inspectionLot = viewModel.getProperty(`/InspectionLot`);
                let serialNumber = viewModel.getProperty(`/SerialNumber`);
                await this.createNewModelUsingAPI(
                    'GET',
                    `/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspLotSerialNumber(InspectionLot='${inspectionLot}',SerialNumber='${serialNumber}')`,
                    '',
                    'SerialNumberData'
                );
                let checkDataExists = false;
                const responseData = this.getView().getModel('SerialNumberData').getData();
                if (responseData && responseData != "undefined") {
                    const inspectionData = responseData.d;
                    if (inspectionData && inspectionData != "undefined") {
                        const inspectionLotNumber = inspectionData.InspectionLot;
                        if (inspectionLotNumber && inspectionLotNumber != "undefined" && inspectionLotNumber != "") {
                            checkDataExists = true;
                        }
                    }
                }
                if (!checkDataExists) {
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    viewModel.setProperty(`/SerialNumber`, "");
                    MessageToast.show("Invalid Serial Number..");
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
                            viewModel.setProperty(`/SerialNumber`, "");
                            await this.CheckMaterialManageBy(inspectionData.Material);
                            const manageBy = viewModel.getProperty(`/ManagedBy`);
                            if (manageBy == "None") {
                                viewModel.setProperty(`/Quantity`, inspectionData.InspectionLotQuantity);
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
                const inputQuantity = acceptedQuantity + rejectedQuantity;
                if (acceptedQuantity > quantity) {
                    MessageToast.show("Accepted quantity and rejected quantity should be equal to quantity.");
                    viewModel.setProperty(`/AcceptedQuantity`, quantity);
                    viewModel.setProperty(`/RejectedQuantity`, 0.00);
                    viewModel.refresh(true);
                }
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
                                `/odata/v4/record-result/RecordResultHead?$filter=(InspectionLot eq '${inspectionLot}' AND SerialNumber eq '${serialNumber}')`,
                                '',
                                'InspectionLotData'
                            );
                            const inspectionLotData = this.getView().getModel('InspectionLotData').getData();
                            if (inspectionLotData && inspectionLotData.value && inspectionLotData.value.length > 0) {
                                MessageToast.show("Record already added for this inspection lot and serial number.");
                                isRecordAdded = true;
                            }
                        }
                        if (!isRecordAdded) {
                            let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                            oModel.setProperty("/Status", "Draft");
                            let oData = oModel.getData();

                            const modelData = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                            let trgObject = this.getView().getModel("inspectionLotSaveRequest").getData();
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
                debugger;
                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                var inspectionLot = oModel.getProperty("/InspectionLot");
                if (!inspectionLot || inspectionLot == "undefined" || inspectionLot == "") {
                    MessageToast.show("Select inspection lot");
                    return false;
                }
                var serialNumber = oModel.getProperty("/SerialNumber");
                if (!serialNumber || serialNumber == "undefined" || serialNumber == "") {
                    MessageToast.show("Select serial number");
                    return false;
                }
                return true;
            },
            onCancel: function () {
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to Record Result.....")
                router.navTo("RouterNameRecordResultViewForm");
            }
        });
    });