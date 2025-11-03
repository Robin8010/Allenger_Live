sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],

    function (genericentryform, MessageToast, MessageBox, FormMode) {
        "use strict";
        var _RoleInfo = null, _LoginInfo;

        return genericentryform.extend("modconfcontroller.rrparametersentryform", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
                //this.initialize();
            },
            onBeforeShow: async function (oEvent) {
                this.isValidUser();
                this.identifyFormMode(oEvent);
                this.initialize();
                this.setEntryFormDataSourceURLForEditMode("/odata/v4/record-result-sap/RecordResultSerialBatchDetail(ID=" + this.getListViewEditPropertyValue() + ")?$expand=ParametersDetails,ParametersDetails($orderby=ParameterCode)");
                this.hanldePreviousData();
                await this.showEntryForm();
                this.handleUIOperation();

            },
            initialize: async function () {
                this.setPageId("rrparametersf");
                this.setFormTitle("Record Result Parameters");
                this.setBackwardRoute("RouterNameRecordResultSAPViewForm");

                this.setEntryFormDataSourceURLForNewMode("");

                this.setEntryFormDataSourceURLToAddData("/odata/v4/record-result-sap/RecordResultSerialBatchDetail");
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/record-result-sap/RecordResultSerialBatchDetail(ID='" + this.getListViewEditPropertyValue() + "')");
                this.setListViewFilterColumn();
                let oPath = jQuery.sap.getModulePath(
                    "testui",
                    "/modconf/model/recordResultParametersEntryForm.json", // Edit Response Model
                );

                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());

                let oPathSaveReq = jQuery.sap.getModulePath(
                    "testui",
                    "/modconf/model/RecordResultParametersSaveRequest.json", //Save Request Model
                );

                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "RecordResultParameterSaveRequest");
            },
            handleUIOperation: async function () {
                const formMode = this.getFormMode();
                if (formMode === "2") {
                    this.handleFormInEditMode();
                    const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const inspectionPlanStatus = viewModel.getProperty("/InspectionPlanStatus");
                    if (inspectionPlanStatus != "2") {
                        await this.RemovesDetailsRows();
                        await this.LoadInspectionPlanData();
                    }
                }
            },
            hanldePreviousData: function () {
                let oModel = this.getView().getModel('sysModel');
                //alert(JSON.stringify(oModel));
                const customerMasterID = oModel.getProperty('/route/routeData/lastUniqueId');
                this.setCustomerMasterIDProperty(customerMasterID);
            },
            RemovesDetailsRows: async function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const modelName = this.getEntryFormDataSourceModelName();
                const { ParametersDetails = [] } = viewModel.getData();
                for (let i = ParametersDetails.length - 1; i >= 0; i--) {
                    this.deleteRowWithoutConfirmation(modelName, 'ParametersDetails', i);
                }
            },
            LoadInspectionPlanData: async function () {
                debugger;
                let oModel = this.getView().getModel('sysModel');
                //alert(JSON.stringify(oModel));
                const plant = oModel.getProperty('/route/routeData/plant');
                const material = oModel.getProperty('/route/routeData/material');
                const inspectionDate = oModel.getProperty('/route/routeData/inspectionDate');
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                await this.createNewModelUsingAPI(
                    'GET',
                    `/sap/opu/odata4/sap/zune_sb_inspplnrpt_api/srvd_a2x/sap/zune_sd_inspplnrpt_api/0001/ZUNE_CDS_InspPlnRpt(p_fromdate=${inspectionDate},p_material='${material}',p_plant='${plant}')/Set?$orderby=ChildParameter`,
                    '',
                    'InspectionPlanData'
                );
                let checkDataExists = false;
                const responseData = this.getView().getModel('InspectionPlanData').getData();
                if (responseData && responseData != "undefined") {
                    const inspectionPlanData = responseData.value;
                    if (inspectionPlanData && inspectionPlanData != "undefined") {
                        for (let i = 0; i < inspectionPlanData.length; i++) {
                            var obj = inspectionPlanData[i];
                            let parameterCode = "";
                            let parameterName = "";
                            if (!obj.ChildParameter && obj.ChildParameter != "undefined" && obj.ChildParameter != "") {
                                parameterCode = obj.ChildParameter;
                                parameterName = obj.ChilPrDesc;
                            }
                            else {
                                parameterCode = obj.ParentParameter;
                                parameterName = obj.ParentPrDesc;
                            }
                            var newRow = {
                                "RowNumber": i + 1,
                                "Attribute": obj.AttributeDesc,
                                "AttributeID": obj.AttributeID.replace(/\s+/g, ''),
                                "InstrumentDesc": obj.DeviceDesc,
                                "InstrumentId": obj.DeviceId.replace(/\s+/g, ''),
                                "Observation": "",
                                "ParameterCode": obj.ChildParameter.replace(/\s+/g, ''),
                                "ParameterName": obj.ChilPrDesc,
                                "ParentParameterCode": obj.ParentParameter.replace(/\s+/g, ''),
                                "ParentParameterName": obj.ParentPrDesc,
                                "RecordResultSerialBatchDetail_ID": "",
                                "Remarks1": "",
                                "Remarks2": "",
                                "Status": "Pending"
                            };
                            this.addRowInObj('ParametersDetails', newRow, 'RowNumber');
                        }
                    }
                    else {
                        MessageToast.show("No parameter details found.");
                    }
                }
                else {
                    MessageToast.show("Error in fetching parameter details. check log.");
                }
            },
            handleFormInEditMode: function () {
                debugger;
                const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const { ParametersDetails = [] } = viewModel.getData();
                ParametersDetails.forEach((element, index) => {
                    element.RowNumber = index + 1;
                    if (viewModel.getProperty("/Status") != "Draft") {
                        element.StatusEnableDisable = false;
                    }
                    else {
                        element.StatusEnableDisable = true;
                    }
                });
                viewModel.setProperty(`/ParametersDetails`, ParametersDetails);
                this.SetConstantValuesInEditMode();
            },
            SetConstantValuesInEditMode: function () {
                const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const StatusList = [
                    {
                        "StatusId": "Draft",
                        "StatusDesc": "Draft"
                    },
                    {
                        "StatusId": "Ready To Post",
                        "StatusDesc": "Ready To Post"
                    },
                    {
                        "StatusId": "Posted",
                        "StatusDesc": "Posted"
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
                viewModel.setProperty("/ParameterStatusList", ParameterStatusList);
            },
            addRow: function () {
                var newRow = {
                    "ParameterCode": null,
                    "ParameterName": null,
                    "Attribute": null,
                    "InstrumentId": null,
                    "InstrumentDesc": null,
                    "Observation": null,
                    "Remarks1": null,
                    "Remarks2": null,
                    "Status": "Pending"
                };
                this.addRowInObj('ParametersDetails', newRow, 'RowNumber');
            },
            onSave: async function () {
                if (!this.DataValidationsForSave()) {
                    return;
                }
                await this.CheckParametersStatus();
                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                oModel.setProperty("/InspectionPlanStatus", "2");
                oModel.refresh();
                let oData = oModel.getData();
                //let oModel2 = this.getView().getModel("StageMasterSaveRequest");
                //let oData2 = oModel2.getData();
                console.log('oData    ', JSON.stringify(oData));
                //console.log('oData2    ', JSON.stringify(oData2));

                const modelData = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                let trgObject = this.getView().getModel("RecordResultParameterSaveRequest").getData();
                console.log("Target Object:", trgObject);

                this.transferObjectValues(modelData, trgObject);
                await this.onPressOfEntryFormSaveButton(trgObject);

                let response = this.getApiResponseObject();;
                if (response.success) {
                    console.log("No duplicate found. Proceeding with save..okok.");
                    const formMode = this.getFormMode();
                    // if (formMode === "2") {
                    //     MessageToast.show("Record updated successfully.");
                    //     //this.handleUIOperation();
                    // }
                    // else {
                    //     this.setRouteData("2", this.getCustomerMasterIDProperty());
                    //     this.setListViewEditPropertyValue(this.getCustomerMasterIDProperty())
                    //     this.router.navTo("RouterNameRecordResultSAPEntryForm");
                    //     //this.router.navTo(this.getBackwardRoute());
                    // }
                    this.setRouteData("2", this.getCustomerMasterIDProperty());
                    this.setListViewEditPropertyValue(this.getCustomerMasterIDProperty())
                    this.router.navTo("RouterNameRecordResultSAPEntryForm");
                    //this.router.navTo(this.getBackwardRoute());
                }

            },
            DataValidationsForSave: function () {
                const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const { ParametersDetails = [] } = viewModel.getData();
                let isDataValid = true;
                if (!ParametersDetails || ParametersDetails.length <= 0) {
                    MessageToast.show("No parameters details found.");
                    return false;
                }
                ParametersDetails.forEach((element, index) => {
                    const observationValue = element.Observation;
                    if (element.Status != "Pending" && (!observationValue || observationValue == "undefined" || observationValue == "")) {
                        isDataValid = false;
                    }
                });
                if (!isDataValid) {
                    MessageToast.show("Enter observation for parameters to change status from pending.");
                    return false;
                }
                return true;
            },
            CheckParametersStatus: function () {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const { ParametersDetails = [] } = viewModel.getData();
                let isDraftExists = false;
                ParametersDetails.forEach((element, index) => {
                    if (element.Status == "Pending") {
                        isDraftExists = true;
                    }
                });
                if (!isDraftExists) {
                    if (viewModel.getProperty("/Status") != "Posted") {
                        viewModel.setProperty("/Status", "Ready To Post");
                        viewModel.refresh(true);
                    }
                    else {
                        viewModel.setProperty("/Status", "Draft");
                        viewModel.refresh(true);
                    }
                }
            },
            onCancel: function () {
                this.setRouteData("2", this.getCustomerMasterIDProperty());
                this.setListViewEditPropertyValue(this.getCustomerMasterIDProperty())
                this.router.navTo("RouterNameRecordResultSAPEntryForm");
            },
            onSearch: function (oEvent) {
                var sQuery = oEvent.getParameter("newValue"); // Get search input
                var filters = [];
                var filter1 = new sap.ui.model.Filter({ path: "ParameterCode", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter2 = new sap.ui.model.Filter({ path: "ParameterName", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter3 = new sap.ui.model.Filter({ path: "Attribute", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter4 = new sap.ui.model.Filter({ path: "Status", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter5 = new sap.ui.model.Filter({ path: "ParentParameterName", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter6 = new sap.ui.model.Filter({ path: "Remarks1", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter7 = new sap.ui.model.Filter({ path: "Remarks2", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                filters = [filter1, filter2, filter3, filter4,filter5,filter6,filter7];
                var finalFilter = new sap.ui.model.Filter({ filters: filters, and: false });
                var otable = this.byId("smParameterTable1");
                otable.getBinding("items").filter(finalFilter);
            },
            onShowRemarks1FullText: function (oEvent) {
                var field = oEvent.getSource();
                var oBindingContext = field.getBindingContext(this.getEntryFormDataSourceModelName());
                let textData = oBindingContext.getProperty("Remarks1");
                this.onShowFullText(textData);
            },
            onShowFullText: function (textValue) {
                var oDialog = new sap.m.Dialog({
                    title: "Full Text",
                    content: [
                        new sap.m.TextArea({
                            value: textValue,
                            width: "100%",
                            rows: 10,
                            editable: false
                        })
                    ],
                    beginButton: new sap.m.Button({
                        text: "Close",
                        press: function () {
                            oDialog.close();
                        }
                    })
                });
                this.getView().addDependent(oDialog);
                oDialog.open();
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