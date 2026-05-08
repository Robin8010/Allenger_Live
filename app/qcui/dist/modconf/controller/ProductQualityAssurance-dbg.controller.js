sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/Fragment"
], function (
    genericentryform,
    MessageToast,
    MessageBox,
    Controller,
    JSONModel,        // ✅ ADD THIS
    BusyIndicator,
    Fragment          // ✅ NOW THIS IS CORRECT
) {
    "use strict";
    var _RoleInfo = null, _LoginInfo;

    return genericentryform.extend("modconfcontroller.ProductQualityAssurance", {
        onInit: function () {
            genericentryform.prototype.onInit.apply(this, arguments);
        },
        onBeforeShow: async function (oEvent) {
            debugger;
          //  this.isValidUser();
            this.identifyFormMode(oEvent);
            debugger;
            this.initialize();
            // this.setEntryFormDataSourceURLForEditMode("/odata/v4/product-quality-clearance/ProductQualityClearance(ID = " + ID + ")?$expand=LineItem");
            await this.showEntryForm();
            await this._loadFragment("Fragment1", "fragment1Container");
            await this._loadFragment("Fragment2", "fragment2Container");
            await this._loadFragment("Fragment3", "fragment3Container");
            await this._loadFragment("Fragment4", "fragment4Container");
            
             const formMode = this.getFormMode();
             debugger;
            if(formMode ==2)
                {
                            debugger;
                           // this.handleUIOperation();
                          //   this.fillInspectionType();
                           // this.fieldEnalbe()             
                }
                if(formMode ==3)
                {
                  //  await this.getmaxKey();
                     this.fillUserDecesionList();
                }
        },
        initialize: async function () {
            const formMode = this.getFormMode();
            const _RoutData = this.getRouteData();
            var abc = _RoutData.uniqueId
            if (formMode != undefined) {

                debugger;
                let ID = _RoutData.uniqueId
                
                this.setEntryFormDataSourceURLForEditMode("/odata/v4/product-quality-clearance/ProductQualityClearance(ID = " + ID + ")?$expand=LineItem");
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/product-quality-clearance/ProductQualityClearance('" + ID + "')");
                this.setEntryFormDataSourceURLToAddData("/odata/v4/product-quality-clearance/ProductQualityClearance");
                this.setEntryFormDataSourceURLForNewMode("");

                

               
debugger

                let oPath = jQuery.sap.getModulePath(
                "qcui",
                "/modconf/model/ProductQualityClearnce.json", // Edit Response Model
                 );
                let _oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(_oModel, this.getEntryFormDataSourceModelName());

                let oPathSaveReq = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/ProductQualityClearnceSaveRequest.json", //Save Request Model
                );

                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "SaveRequest");

            }
        },
        isValidUser: function () {
            // let loginInfo=this.getLoginInfo();
            // let userid = loginInfo.UserID;
            debugger;
            const loginModel = this.getOwnerComponent().getModel('UserModel');
            if (!loginModel || loginModel === 'undefined') {
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                router.navTo("RouteIndex");
                MessageToast.show("Not a valid user.");
            }
            else {
                globalVarForUserId = loginModel.value[0].username;
                globalVarForUserName = loginModel.value[0].username;
            }
        },
        cflForInspectionLot: async function () {
            try {
                debugger
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
            // viewModel.setProperty(`/SerialNumber`, "");

        },

        cflForProduction: async function () {
            try {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                let Inspection = viewModel.getProperty(`/InspectionLot`);
                if (Inspection = "") {
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspectionLot?$format=json`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );
                }
                else {
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/sap/opu/odata4/sap/zune_sb_insplotrelstatus_api/srvd_a2x/sap/zune_sd_insplotrelstatus_api/0001/ZUNE_CDS_INSPLOTRELSTATUS?$ filter =Inspection eq '${Inspection}' $format=json`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );
                }
                this.setCflDisplayColumns(['ManufacturingOrder']);
                this.setCflDataColumns(['ManufacturingOrder']);
                this.setCflValueAndDisplay('ManufacturingOrder', 'ManufacturingOrder', '', '');

                this.showCfl(
                    'ManufacturingOrder',
                    this.getCflListViewDataSourceModelName(),
                    'value',
                    this.onConfirmProduction.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("cflForInspectionLot -: " + error.message);
            }
        },
        onConfirmProduction: function () {
            let x = this.getCflObject();
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            viewModel.setProperty(`/Production`, x.ManufacturingOrder);


        },

        cflForSerial: async function () {
            try {
                debugger;
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

                let Inspection = viewModel.getProperty("/InspectionLot");
                let Production = viewModel.getProperty("/Production");

                let sUrl = "/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspLotSerialNumber";

                if (Inspection) {
                    sUrl += `?$filter=InspectionLot eq '${Inspection}'`;
                }
                else if (Production) {
                    sUrl += `?$filter=Production eq '${Production}'`;
                }

                await this.createNewModelUsingAPI(
                    "GET",
                    sUrl,
                    "",
                    this.getCflListViewDataSourceModelName()
                );

                this.setCflDisplayColumns(["SerialNumber"]);
                this.setCflDataColumns(["SerialNumber"]);
                this.setCflValueAndDisplay("SerialNumber", "SerialNumber", "", "");

                this.showCfl(
                    "SerialNumber",
                    this.getCflListViewDataSourceModelName(),
                    "d/results",
                    this.onConfirmSerial.bind(this)
                );

            } catch (error) {
                MessageBox.show("cflForSerial -: " + error.message);
            }
        },
        onConfirmSerial: function () {
            debugger;
            let x = this.getCflObject();
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

            viewModel.setProperty(`/SerialNum`, x.SerialNumber);
            //this.fillUserDecesionList();


        },

        _loadFragment :  function (fragmentName, containerId) {
            var oView = this.getView();
            Fragment.load({
                name: "modconfigfragment." + fragmentName,
                controller: this
            }).then(function (oFragment) {
                oView.byId(containerId).addItem(oFragment);
            });
        },

        // Accordion behavior: collapse other panels when one expands
        onPanelExpand: function (oEvent) {
            var oExpandedPanel = oEvent.getSource();
            if (oExpandedPanel.getExpanded()) {
                var aContainers = ["fragment1Container", "fragment2Container", "fragment3Container"];
                var oView = this.getView();

                aContainers.forEach(function (sContainerId) {
                    var oContainer = oView.byId(sContainerId);
                    oContainer.getItems().forEach(function (oPanel) {
                        if (oPanel !== oExpandedPanel) {
                            oPanel.setExpanded(false);
                        }
                    });
                });
            }
        },

        fillUserDecesionList: async function () {
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            viewModel.attachRequestCompleted(() => {
                     const LineItem = [
                {
                    "DocumentNum": " Specification Sheet (For Govt. Orders)",
                    "IsDocumentAtteched": false,
                    "IsApplicable": false
                },
                 {
                    "DocumentNum": " Priority List",
                    "IsDocumentAtteched": false,
                    "IsApplicable": false
                }
                ,
                 {
                    "DocumentNum": " Order Processing Sheet",
                    "IsDocumentAtteched": false,
                    "IsApplicable": false
                }
                ,
                 {
                    "DocumentNum": "Deviation Form",
                    "IsDocumentAtteched": false,
                    "IsApplicable": false
                }
                ,
                 {
                    "DocumentNum": "Short Shipment Form",
                    "IsDocumentAtteched": false,
                    "IsApplicable": false
                }
                ,
                 {
                    "DocumentNum": "I.I. Test Report",
                    "IsDocumentAtteched": false,
                    "IsApplicable": false
                }
            ]
            viewModel.setProperty("/LineItem", LineItem);
                });
           
        },
        fillComboElectrial: async function () {
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            await this.createNewModelUsingAPI(
                'GET',
                `/odata/v4/user-master/userMaster?$filter=IsElectrial eq true`,
                '',
                'Users'
            );
            const _data = this.getView().getModel("Users").getData();
            const { value = [] } = _data || {};
            viewModel.setProperty("/ElectrialcalUserList", []); // clear array
            viewModel.setProperty("/ElectrialcalUserList", value);
        },

        Go: async function () {
            try {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

                let Inspection = viewModel.getProperty("/InspectionLot");
                let Production = viewModel.getProperty("/Production");
                let Serial = viewModel.getProperty("/SerialNum");

                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/inspection-qcreport/InspectionQcReport?$filter=SerialBatchNumber eq '${Serial}'`,
                    '',
                    'reportdata'
                );
                debugger;
                const reportData = this.getView().getModel('reportdata').getData();

                const { value = [] } = reportData || {};
                let material = value[0].Material;
                //GetPartNo Info
                await this.createNewModelUsingAPI(
                    'GET',
                    `/sap/opu/odata/sap/ZUNE_SB_P_C_V3/ZUNE_C_PRODUCT_FINAL?$filter=PartCode eq '${material}'`,
                    '',
                    'PartData'
                );
                debugger;

                const partModel = this.getView().getModel('PartData')
                const PartData = partModel.getProperty("/d/results");

                viewModel.setProperty(`/Inspection`, value[0].InspectionLot);
                viewModel.setProperty(`/MachinePartCode`, PartData[0].PartCode);
                viewModel.setProperty(`/DetailDescription`, PartData[0].PartCodeDescription);
                viewModel.setProperty(`/Serial`, value[0].SerialBatchNumber);
                // viewModel.setProperty(`/CertificateType`, x.);
                //  viewModel.setProperty(`/CertificateNo`, PartData.SerialNumber);
                viewModel.setProperty(`/CertificationType`, PartData[0].CertificationType);
                viewModel.setProperty(`/MachineType`, PartData[0].MachineType);
                 viewModel.setProperty(`/ProductionOrder`, value[0].ManufacturingOrder);
                viewModel.setProperty(`/MachineModel`, PartData[0].MachineModel);
                viewModel.setProperty(`/ManufacturingCode`, PartData[0].ManufacturingCode);
                viewModel.setProperty(`/MachineSeries`, PartData[0].MachineSeries);
                viewModel.setProperty(`/ManufacturingCodeRevision`, PartData[0].ManufacturingCodeRevision);
                viewModel.setProperty(`/ElectricalQA`, value[0].ElectrialUserName);
                viewModel.setProperty(`/MechanicalQA`, value[0].MechnicalUserName);
                viewModel.setProperty(`/FinalClearBy`, value[0].ElectrialUserName);
                viewModel.setProperty(`/FinalApprovalBy`, value[0].UDUser);


            }
            catch (error) {
                MessageBox.show(error.message);
            }
        },
        navBack:function()
        {
             var router = sap.ui.core.UIComponent.getRouterFor(this);
                //MessageToast.show("Redirecting to SAP Record Result.....")
                router.navTo("ProductQualityAssuranceList");
        },
          onCancel: function () {
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                //MessageToast.show("Redirecting to SAP Record Result.....")
                router.navTo("ProductQualityAssuranceList");
            },
        onSave: async function () {
            try {
                debugger;
                let isRecordAdded = false;
                const formMode = this.getFormMode();
                if (formMode === "3") {
                    const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    var serialNumber = oModelData.getProperty("/SerialNumber");
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/odata/v4/product-quality-clearance/ProductQualityClearance?$filter=(Serial eq '${serialNumber}')`,
                        '',
                        'Serial'
                    );
                    const inspectionLotData = this.getView().getModel('Serial').getData();
                    if (inspectionLotData && inspectionLotData.value && inspectionLotData.value.length > 0) {
                        MessageToast.show("Record already added for this Serial.");
                        isRecordAdded = true;
                    }
                }
                if (!isRecordAdded) {
                    let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());


                    const modelData = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                    let trgObject = this.getView().getModel("SaveRequest").getData();
                    console.log("Target Object:", trgObject);

                    this.transferObjectValues(modelData, trgObject);
                    await this.onPressOfEntryFormSaveButton(trgObject);
                    let response = this.getApiResponseObject();;
                    if (response.success) {
                        console.log("No duplicate found. Proceeding with save..okok.");
                        this.router.navTo(this.getBackwardRoute());
                        MessageToast.show("Data added successfully");
                    }
                }

                else {

                }
            }
            catch (error) {
                MessageBox.show(error.message);
            }
        },

    });
});