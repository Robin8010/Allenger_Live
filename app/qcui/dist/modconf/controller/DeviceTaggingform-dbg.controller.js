sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],

    function (genericentryform, MessageToast, MessageBox, FormMode) {
        "use strict";
        var _RoleInfo = null, _LoginInfo;

        return genericentryform.extend("modconfcontroller.DeviceTaggingform", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
               
               // var EnableModel = { Enable: ""};
               // let oModel = new sap.ui.model.json.JSONModel(EnableModel)
               // this.getView().setModel(oModel, "SetEnable");
            },
            onBeforeShow: async function (oEvent) {
                this.isValidUser();
                this.identifyFormMode(oEvent);
                this.initialize();
                this.setEntryFormDataSourceURLForEditMode("/odata/v4/record-result-sap/RecordResultSerialBatchDetail(ID="  + this.getListViewEditPropertyValue() +  ")?$expand=RecordResultDeviceTagging($orderby=DeviceID asc;$top=2000)");
                this.hanldePreviousData();
                await this.showEntryForm();
                this.handleUIOperation();
                await this.LoadDevicesDataFromCloud();
            },
            initialize: async function () {
                this.setPageId("deviceTaggingsf");
                this.setFormTitle("Device Tagging");
                this.setBackwardRoute("RouterNameRecordResultSAPViewForm");

                this.setEntryFormDataSourceURLForNewMode("");

                this.setEntryFormDataSourceURLToAddData("/odata/v4/record-result-sap/RecordResultSerialBatchDetail");
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/record-result-sap/RecordResultSerialBatchDetail(ID='" + this.getListViewEditPropertyValue() + "')");
                this.setListViewFilterColumn();
                let oPath = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/deviceTaggingEntryForm.json", // Edit Response Model
                );

                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());

                let oPathSaveReq = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/deviceTaggingSaveRequest.json", //Save Request Model
                );

                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "RecordResultDeviceSaveRequest");
            },
            handleUIOperation: async function () {
                const formMode = this.getFormMode();
                if (formMode === "2") {
                    this.handleFormInEditMode();
                }
            },
            hanldePreviousData: function () {
                let oModel = this.getView().getModel('sysModel');
                //alert(JSON.stringify(oModel));
                const customerMasterID = oModel.getProperty('/route/routeData/lastUniqueId');
                this.setCustomerMasterIDProperty(customerMasterID);
            },
            handleFormInEditMode: function () {
                debugger;
                const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const { RecordResultDeviceTagging = [] } = viewModel.getData();
                RecordResultDeviceTagging.forEach((element, index) => {
                    element.RowNumber = index + 1;
                });
                viewModel.setProperty(`/RecordResultDeviceTagging`, RecordResultDeviceTagging);
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
            onCancel: function () {
                this.setRouteData("2", this.getCustomerMasterIDProperty());
                this.setListViewEditPropertyValue(this.getCustomerMasterIDProperty())
                this.router.navTo("RouterNameRecordResultSAPEntryForm");
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
            LoadDevicesDataFromCloud: async function () {
                try {
                    debugger;
                    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const { RecordResultDeviceTagging = [] } = viewModel.getData();
                    if (!RecordResultDeviceTagging || RecordResultDeviceTagging == "undefined" || RecordResultDeviceTagging.length <= 0) {
                       debugger;
                        const id = viewModel.getProperty("/ID");
                        await this.createNewModelUsingAPI(
                            'GET',
                            `/odata/v4/device-group-list/DeviceGroupList?$filter=ID eq '${id}' AND DeviceGroupID ne null&$top=2000`,
                            '',
                            'DeviceGroupList'
                        );
                        let checkDataExists = false;
                        const responseData = this.getView().getModel('DeviceGroupList').getData();
                        if (responseData && responseData != "undefined") {
                            const deviceGroupData = responseData.value;
                            if (deviceGroupData && deviceGroupData != "undefined" && deviceGroupData.length > 0) {
                                for (let i = deviceGroupData.length - 1; i >= 0; i--) {
                                    const deviceGroupId = deviceGroupData[i].DeviceGroupID;
                                      const deviceGroupDsc = deviceGroupData[i].DeviceGroup;
                                       const SerialBatchNumber = deviceGroupData[i].SerialBatchNumber;
                                    if (deviceGroupId && deviceGroupId != "undefined" && deviceGroupId != "") {
                                        await this.LoadDeviceData(deviceGroupId,deviceGroupDsc,SerialBatchNumber);
                                    }
                                }
                            }
                            else {
                                MessageToast.show("No device group found.");
                            }
                        }
                        else {
                            MessageToast.show("No device group found.");
                        }

                        //Enable false after save
                       var EnableModel = { Enable: false }; // better initialize as boolean
                        let oModel = new sap.ui.model.json.JSONModel(EnableModel);
                        this.getView().setModel(oModel, "SetEnable");

                        // Update value
                        let viewModel1 = this.getView().getModel("SetEnable");
                        viewModel1.setProperty("/Enable", true);  
                    }
                    else
                    {
                        //Enable false after save
                       var EnableModel = { Enable: false }; // better initialize as boolean
                        let oModel = new sap.ui.model.json.JSONModel(EnableModel);
                        this.getView().setModel(oModel, "SetEnable");

                        // Update value
                        let viewModel1 = this.getView().getModel("SetEnable");
                        viewModel1.setProperty("/Enable", false);  
                    }
                }
                catch (error) {
                    MessageToast.show(error);
                }
            },
            LoadDeviceData: async function (deviceGroupId,deviceGroupDsc,SerialBatchNumber) {
                try {
                    debugger;
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/sap/opu/odata4/sap/zune_sb_devicemaster_api/srvd_a2x/sap/zune_sd_devicemaster_api/0001/ZUNE_CDS_DEVICEMASTER_API(devicegroupid='${deviceGroupId}')/Set?$top=1000`,
                        '',
                        'DevicesData'
                    );
                    let checkDataExists = false;
                    const responseData = this.getView().getModel('DevicesData').getData();
                    if (responseData && responseData != "undefined") {
                        const devicesData = responseData.value;
                        if (devicesData && devicesData != "undefined") {
                            let rowCount = 1;
                            for (let i = 0; i < devicesData.length; i++) {
                                var obj = devicesData[i];
                                let derviceId = "";
                                let deviceName = "";
                                derviceId = obj.amslid;
                                deviceName = obj.Devdesc;
                                var newRow = {
                                    "RowNumber": rowCount,
                                    "DeviceSelect": false,
                                    "DeviceID": derviceId,
                                    "DSerial": devicesData[i].device_serialno,
                                    "DeviceDescription": deviceName,
                                     "DeviceGroup": deviceGroupDsc,
                                     "Serial": SerialBatchNumber,
                                };
                                rowCount++;
                                this.addRowInObj('RecordResultDeviceTagging', newRow, 'RowNumber');
                            }
                        }
                        else {
                            MessageToast.show("No device details found.");
                        }
                    }
                    else {
                        MessageToast.show("Error in fetching parameter details. check log.");
                    }
                }
                catch (error) {
                    MessageToast.show(error);
                }
            },
            onSave: async function () {
                if (!this.DataValidationsForSave()) {
                    return;
                }
debugger
                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                let oData = oModel.getData();

                console.log('oData    ', JSON.stringify(oData));

                const modelData = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                let trgObject = this.getView().getModel("RecordResultDeviceSaveRequest").getData();
                console.log("Target Object:", trgObject);

                this.transferObjectValues(modelData, trgObject);
                await this.onPressOfEntryFormSaveButton(trgObject);

                let response = this.getApiResponseObject();;
                if (response.success) {
                    console.log("No duplicate found. Proceeding with save..okok.");
                    const formMode = this.getFormMode();
                    this.setRouteData("2", this.getCustomerMasterIDProperty());
                    this.setListViewEditPropertyValue(this.getCustomerMasterIDProperty())
                    this.router.navTo("RouterNameRecordResultSAPEntryForm");
                    //this.router.navTo(this.getBackwardRoute());
                }
            },
            DataValidationsForSave: function () {
                const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const { RecordResultDeviceTagging = [] } = viewModel.getData();
                let isDataValid = true;
                if (!RecordResultDeviceTagging || RecordResultDeviceTagging.length <= 0) {
                    MessageToast.show("No Devices details found.");
                    return false;
                }
                return true;
            },
             onSearch: function (oEvent) {
                var sQuery = oEvent.getParameter("newValue"); // Get search input
                var filters = [];
                var filter1 = new sap.ui.model.Filter({ path: "DeviceID", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                var filter2 = new sap.ui.model.Filter({ path: "DeviceDescription", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                filters = [filter1, filter2];
                var finalFilter = new sap.ui.model.Filter({ filters: filters, and: false });
                var otable = this.byId("smDevices1");
                otable.getBinding("items").filter(finalFilter);
            }
        });
    });