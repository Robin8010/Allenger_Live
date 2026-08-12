//const { elements } = require("@sap/cds/lib/ql/cds.ql-infer");

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
              await  this.initialize();
              debugger
               // this.setEntryFormDataSourceURLForEditMode("/odata/v4/record-result-sap/RecordResultSerialBatchDetail(ID=" + this.getListViewEditPropertyValue() + ")?$expand=ParametersDetails,ParametersDetails($orderby=ParentParameterCode asc, ParameterCode asc)");//ParentParameter
                this.setEntryFormDataSourceURLForEditMode("/odata/v4/record-result-sap/RecordResultSerialBatchDetail(ID=" + this.getListViewEditPropertyValue() + ")?$expand=ParametersDetails,ParametersDetails($orderby=lineid asc)");
                  const formMode = this.getFormMode();
                if(formMode=="2")
                                { 
                                    let abc=this.getListViewEditPropertyValue();
                                    if(this.getListViewEditPropertyValue()=="")
                                    {

                                        var router = sap.ui.core.UIComponent.getRouterFor(this);
                                        MessageToast.show("Data could nor loaded due to connectivity.....")
                                        this.router.navTo("RouterNameRecordResultSAPEntryForm");
                                            
                                    }
                                    else
                                    {
                                        
                                    }
                                }
               await this.hanldePreviousData();
                debugger;
                  await this.getView().loaded();  // ensures UI fully ready
                await this.showEntryForm();
               // await new Promise(resolve => setTimeout(resolve, 200));
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
                    "qcui",
                    "/modconf/model/recordResultParametersEntryForm.json", // Edit Response Model
                );

                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                

                let oPathSaveReq = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/RecordResultParametersSaveRequest.json", //Save Request Model
                );

                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "RecordResultParameterSaveRequest");
            },
            handleUIOperation: async function () {
                const formMode = this.getFormMode();
                //  MessageToast.show("handleUIOperation -"+formMode);
               
                if (formMode === "2") {
                    debugger;
                    this.handleFormInEditMode();
                    debugger;
                    const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                       const { ParametersDetails = [] } = viewModel.getData();
                       // MessageToast.show(ParametersDetails);
                    const inspectionPlanStatus = viewModel.getProperty("/InspectionPlanStatus");
                    if (inspectionPlanStatus != "2") {
                        await this.RemovesDetailsRows();
                        await this.LoadInspectionPlanData();
                    }
                }
            },
            hanldePreviousData: function () {
                debugger;
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
                 debugger
                const material = oModel.getProperty('/route/routeData/material');
                const inspectionDate = oModel.getProperty('/route/routeData/inspectionDate');
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                //`/sap/opu/odata4/sap/zune_sb_inspplnrpt_api/srvd_a2x/sap/zune_sd_inspplnrpt_api/0001/ZUNE_CDS_InspPlnRpt(p_fromdate=${inspectionDate},p_material='${material}',p_plant='${plant}')/Set?$orderby=ParentParameter,ChildParameter`,
                await this.createNewModelUsingAPI(
                    'GET',
                    //`/sap/opu/odata4/sap/zune_sb_inspplnrpt_api/srvd_a2x/sap/zune_sd_inspplnrpt_api/0001/ZUNE_CDS_InspPlnRpt(p_fromdate=${inspectionDate},p_material='${material}',p_plant='${plant}')/Set?$orderby=ParentParameter,ChildParameter&$top=1000`,
                     `/sap/opu/odata4/sap/zune_sb_inspplnrpt_api/srvd_a2x/sap/zune_sd_inspplnrpt_api/0001/ZUNE_CDS_InspPlnRpt(p_fromdate=${inspectionDate},p_material='${material}',p_plant='${plant}')/Set?$orderby=lineid&$top=2000`,
                    '',
                    'InspectionPlanData'
                );
                debugger;
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
                                //"InstrumentDesc": obj.DeviceDesc,
                                //"InstrumentId": obj.DeviceId.replace(/\s+/g, ''),
                                "DeviceGroupID": obj.DeviceGroupId.replace(/\s+/g, ''),
                                "DeviceGroup": obj.DeviceGroupDesc.replace(/\s+/g, ''),
                                "Observation": "",
                                 "Uppervalue": obj.UpperValue,
                                  "UOM": obj.UOM,
                                  "lineid":obj.lineid,
                                "Lowervalue": obj.Lowervalue,
                                "ParameterCode": obj.ChildParameter.replace(/\s+/g, ''),
                                "ParameterName": obj.ChilPrDesc,
                                "ParentParameterCode": obj.ParentParameter.replace(/\s+/g, ''),
                                "ParentParameterName": obj.ParentPrDesc,
                                "InspectionAgency": obj.InspectionAgency,
                                "InspectionAgencyMukundpur": obj.InspectionAgencyMukundpur,
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
            HandleLiveChanges: function (oEvent) {
                var oButton = oEvent.getSource();
              
               // var oContext = oTextArea.getBindingContext(this.getEntryFormDataSourceModelName());
                var oBindingContext = oButton.getBindingContext(this.getEntryFormDataSourceModelName());
                console.log("Binding Context:", oBindingContext);
                  var oModel = oBindingContext.getModel();
                let oRowObject = oBindingContext.getProperty("Attribute");
                if (oRowObject == "Range") {
                    var _oInput = oEvent.getSource();
                   // var val = _oInput.getValue();
                  //  val = val.replace(/[^\d]/g, '');
                   // _oInput.setValue(val);
debugger;
                     var oTextArea = oEvent.getSource();
                   // var oContext = oTextArea.getBindingContext("EntryFormDataSourceModel");
                        var fromRange = parseFloat(oBindingContext.getProperty("Lowervalue"));
                        var toRange = parseFloat(oBindingContext.getProperty("Uppervalue"));
                    var observation = parseFloat(oTextArea.getValue());
                    if(observation!="")
                    {
                    if (observation < fromRange || observation > toRange) 
                        {
                            var sStatusPath = oBindingContext.getPath() + "/Status";
                            oModel.setProperty(sStatusPath, "Rejected");
                            this.onComboSelection();
                        }
                        else if (observation => fromRange || observation <= toRange) 
                        {
                            var sStatusPath = oBindingContext.getPath() + "/Status";
                            oModel.setProperty(sStatusPath, "Accepted");
                        }
                        else
                        {
                            var sStatusPath = oBindingContext.getPath() + "/Status";
                            oModel.setProperty(sStatusPath, "Pending");
                        }
                }
            }
                //MessageToast.show(oRowObject);
            },
           handleFormInEditMode: function () {
    debugger;

    const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

    let _Status = viewModel.getProperty("/Status");

    const { ParametersDetails = [] } = viewModel.getData();

    ParametersDetails.forEach((element, index) => {

        if (_Status == "Ready To Post") {

            element.Remarks1Enable = false;
            element.Remarks2Enable = true;

        } else if (_Status == "Posted") {

            element.Remarks1Enable = false;
            element.Remarks2Enable = false;

        } else {

            element.Remarks1Enable = true;
            element.Remarks2Enable = true;
        }

        element.RowNumber = index + 1;
        element.OldStatus = element.Status;

        if (_Status != "Draft") {
            element.StatusEnableDisable = false;
        } else {
            element.StatusEnableDisable = true;
        }

    });

    viewModel.setProperty("/ParametersDetails", ParametersDetails);

    this.SetConstantValuesInEditMode();
},

             cflForInspectionLot: async function () {
                try {
                    debugger;
                    let model=this.getView().getModel(this.getEntryFormDataSourceModelName());

                     let oModel = this.getView().getModel('sysModel');
                const inspectionLot = oModel.getProperty('/route/routeData/inspectionLot');
                    let Serial=model.getProperty("/SerialBatchNumber");
                    await this.createNewModelUsingAPI(
                        'GET',
                        `sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspLotSerialNumber?$filter=SerialNumber eq '${Serial}' and InspectionLot ne '${inspectionLot}'&$format=json`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );
                    this.setCflDisplayColumns(['Inspection Lot']);
                    this.setCflDataColumns(['InspectionLot']);
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
              
                //this.RemovesDetailsRows();
               // this.fetchInspectionData(x.InspectionLot);
               
               // this.ShowDefaultValues();
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
                    "Uppervalue": null,
                    "Lowervalue": null,
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
             ValidateRangeQuantity: function (oEvent) {
                debugger;
             
    var oTextArea = oEvent.getSource();


   var oContext = oTextArea.getBindingContext("EntryFormDataSourceModel");


    var fromRange = parseFloat(oContext.getProperty("Lowervalue"));
    var toRange = parseFloat(oContext.getProperty("Uppervalue"));
   var observation = parseFloat(oTextArea.getValue());

    // Validation
                if (observation < fromRange || observation > toRange) {
                    MessageToast.show("Observation Quantity should be between define range.");
                    
                }

            },

            onSave: async function () {
                  let Currentmodify=await this.getModifyTime();
                    const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        var _modify = oModelData.getProperty("/modifiedAt");
                        if(Currentmodify==_modify)
                        {
                            if (!this.DataValidationsForSave()) {
                                return;
                            }
                            debugger;
                    const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                            const { ParametersDetails = [] } = viewModel.getData();
                            let isDataValid = true;
                            debugger
                        if(ParametersDetails.length>1)
                        {
                            ParametersDetails.forEach((element, index) => {
                                const observationValue = element.Observation;
                            // if ((element.Status != "Pending") && (!observationValue || observationValue == "undefined" || observationValue == "")) {
                                // debugger;
                                    if(element.Status == "Pending")
                                    {
                                        isDataValid = false;
                                    }
                                    
                            // }
                            });
                            debugger;
                            if(isDataValid)
                            {
                                await this.CheckParametersStatus();
                            }
                            let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                            //  oModel.setProperty("/Status", "Draft");
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
                        }
                        else
                        {
                            MessageToast.show("Kindly add perameter first...");
                        }
                        }
                        else
                        {
                           MessageBox.show("Another user working on same screen kindly wait and reopen...");  
                        }

            },
            DataValidationsForSave: function () {
              //  debugger;
               let Row="";
                const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const { ParametersDetails = [] } = viewModel.getData();
                let isDataValid = true;
                if (!ParametersDetails || ParametersDetails.length <= 0) {
                    MessageToast.show("No parameters details found.");
                    return false;
                }
                ParametersDetails.forEach((element, index) => {
                    const observationValue = element.Observation;
                   
                   // if ((element.Status != "Pending") && (!observationValue || observationValue == "undefined" || observationValue == "")) {
                       // debugger;
                       // Get the table by ID
                            var oTable = this.getView().byId("smParameterTable1");

                            // Get all items (rows)
                            var aItems = oTable.getItems();
                        if((element.Status == "Accepted"||element.Status == "Rejected") && (!observationValue || observationValue == "undefined" || observationValue == ""))
                        {
                            isDataValid = false;
                           Row=index+1;
                            
                         // aItems[index].addStyleClass("rowError"); // Options: Error, Warning, Success, Information
                         // aItems[index].addStyleClass("rowError");
                           // aItems[index].setHighlight("Error");
                        }
                        else
                        {
                           // aItems[index].removeStyleClass("rowError");
                        }
                        
                   // }
                });
                if (!isDataValid) {
                    MessageToast.show(`Enter observation for parameters to change status from pending Line no.- ${Row}`);
                    return false;
                }
                return true;
            },
            /*
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
            }, */

             CheckParametersStatus: async function () {

    let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
let _Status=viewModel.getProperty("/Status");
if(_Status!="Ready To Post")
{
    const action = await new Promise(function (resolve) {
        sap.m.MessageBox.confirm(
            "Do you want to set status to Ready To Post?",
            {
                actions: [
                    sap.m.MessageBox.Action.YES,
                    sap.m.MessageBox.Action.NO
                ],
                onClose: function (oAction) {
                    resolve(oAction);
                }
            }
        );
    });
debugger;
    if (action === sap.m.MessageBox.Action.YES) {
        viewModel.setProperty("/Status", "Ready To Post");
    } else {
        viewModel.setProperty("/Status", "Draft");
    }

    viewModel.refresh(true);
}
}
,
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
                var filter8 = new sap.ui.model.Filter({ path: "InspectionAgency", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery });
                filters = [filter1, filter2, filter3, filter4, filter5, filter6, filter7,filter8];
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
            
            onComboSelection:function(oEvent)
            {
                debugger;
                const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                 var oCombo = oEvent.getSource();
                var oBindingContext = oCombo.getBindingContext(this.getEntryFormDataSourceModelName());
                let _Status = oBindingContext.getProperty("Status");
                let OldStatus = oBindingContext.getProperty("OldStatus");

                var sPath = oBindingContext.getPath();  
                // Example: "/Items/3"

                var aParts = sPath.split("/");
                var _iIndex = aParts[aParts.length - 1];

                if(_Status=="Rejected")
                {
                oBindingContext.setProperty("OldStatus", _Status);
                    const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        const { ParametersDetails = [] } = viewModel.getData();
                        ParametersDetails.forEach((element, index) => {
                            if(_iIndex<index)
                            {
                                if(element.Status=="Pending")
                                {
                                    element.RowNumber = index + 1;
                                    element.Status = "NA";
                                }
                                
                            }
                        });
                        viewModel.setProperty(`/ParametersDetails`, ParametersDetails);
                }
                else if(OldStatus=="Rejected")
                {
                    const viewmodel=this.getView().getModel(this.getEntryFormDataSourceModelName());
                    const {ParametersDetails=[]}=viewmodel.getData();
                    ParametersDetails.forEach((element,index)=>
                    {
                         if(_iIndex<index)
                            {
                                if(element.Status=="Pending")
                                {
                                    element.RowNumber = index + 1;
                                    element.Status = "Pending";
                                }
                            }
                    })
                   oBindingContext.setProperty("OldStatus", _Status);
                }
            },
          onPressCopyPerameter: async function () {
    try {

        let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
        let Lot = viewModel.getProperty("/InspectionLot");
        let Serial = viewModel.getProperty("/SerialBatchNumber");

        await this.createNewModelUsingAPI(
            'GET',
            `/odata/v4/record-result-sap/RecordResultSAPHead?$filter=InspectionLot eq '${Lot}'&$expand=SerialBatchDetails($filter=SerialBatchNumber eq '${Serial}';$expand=ParametersDetails)`,
            '',
            "PerameterData"
        );

        // 🔥 IMPORTANT FIX STARTS HERE

        const parameterModelData = this.getView().getModel('PerameterData').getData();

        // Step 1: Go inside value[0]
        const headData = parameterModelData.value && parameterModelData.value.length > 0
            ? parameterModelData.value[0]
            : null;

        if (!headData) return;

        // Step 2: Get SerialBatchDetails correctly
        const serialBatchDetails = headData.SerialBatchDetails || [];

        // Step 3: Get ParametersDetails from FIRST item (index 0, not 1)
        const existParametersDetails = serialBatchDetails.length > 0
            ? serialBatchDetails[0].ParametersDetails || []
            : [];

        // Get current form parameters
        const ParameterModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
        const ParametersDetails = ParameterModel.getData().ParametersDetails || [];

        // Step 4: Copy values
        ParametersDetails.forEach((element) => {

            let match = existParametersDetails.find(item =>
                item.ParameterCode === element.ParameterCode &&
                item.ParentParameterCode === element.ParentParameterCode
            );

            if (match) {
                element.Observation = match.Observation || "";
                element.Remarks1 = match.Remarks1 || "";
                element.Remarks2 = match.Remarks2 || "";
                element.Status = match.Status || "";
            }
        });

        // Step 5: Update model
        ParameterModel.setProperty("/ParametersDetails", ParametersDetails);

    } catch (error) {
        console.error(error);
    }
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
            }
        });
    });