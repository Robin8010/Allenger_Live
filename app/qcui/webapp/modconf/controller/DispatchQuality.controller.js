

sap.ui.define([
	  "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], 
 function (genericentryform, MessageToast, MessageBox, Controller) {
	"use strict";
let ReportHeader_Y;
let PageHeader_Y;
let Line_Y;
let Footer_Y;
let Total=0;
let Quantity=0;
let Sgst=0;
let cgst=0;
let Igst=0;
let _LineTotal=0;
        return genericentryform.extend("modconfcontroller.DispatchQuality", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
                debugger;
            },
            onBeforeShow: async function (oEvent) {
                 this.isValidUser(); 
              this.identifyFormMode(oEvent);
                debugger;
                this.initialize();
                   await this.showEntryForm();
                this.handleUIOperation();

                    const formMode = this.getFormMode();
             debugger;
            if(formMode ==2)
                {
                                    
                }
                if(formMode ==3)
                {
                     this.fillUserDecesionList();
                }

            },

             handleUIOperation: async function () {
                debugger;
                const formMode = this.getFormMode();
          
             await this.fillComboFinalList();
             debugger
             await this.SetConstantValuesInEditMode();
                await   this.fillCombo();
            
                
            },
           initialize: async function () {
            debugger;
            const formMode = this.getFormMode();
            const _RoutData = this.getRouteData();
            var abc = _RoutData.uniqueId
            if (formMode != undefined) {

                debugger;
                let ID = _RoutData.uniqueId
                
                this.setEntryFormDataSourceURLForEditMode("/odata/v4/dispatch/DispatchQuality(ID = " + ID + ")?$expand=FactSheet");
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/dispatch/DispatchQuality('" + ID + "')");
                this.setEntryFormDataSourceURLToAddData("/odata/v4/dispatch/DispatchQuality");
                this.setEntryFormDataSourceURLForNewMode("");

                

               
debugger

                let oPath = jQuery.sap.getModulePath(
                "qcui",
                "/modconf/model/DispatchQuality.json", // Edit Response Model
                 );
                let _oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(_oModel, this.getEntryFormDataSourceModelName());

                let oPathSaveReq = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/DispatchQualitySaveRequest.json", //Save Request Model
                );
debugger
                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "SaveRequest");

            }
        },

         SetConstantValuesInEditMode: function () {
                const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                const List = [
                    {
                        "ID": "0",
                        "Code": "Yes"
                    },
                    {
                        "ID": "1",
                        "Code": "No"
                    }
                    
                ]
                viewModel.setProperty("/List", List);
            },
         fillComboFinalList: async function () {
            debugger
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/user-master/userMaster?$filter=IsMechnical eq true or IsElectrial eq true&$format=json`,
                    '',
                    'Users'
                );
                const _data = this.getView().getModel("Users").getData();
                const { value = [] } = _data || {};
                viewModel.setProperty("/FinalList", []); // clear array
                viewModel.setProperty("/FinalList", value);
            },

              fillCombo: async function () {
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
           // viewModel.attachRequestCompleted(() => {
                     const EmpList = [
                {
                    "UserName": "AL-00441",
                    "NameDsc": "Gyanendra singh(AL-00441)"
                  
                },
                 {
                      "UserName": "AL-02627",
                    "NameDsc": "Rajender sharma(AL-02627)"
                   
                }
                ,
                 {
                      "UserName": "AL-04531",
                    "NameDsc": "Sandeep Singh(AL-04531)"
                    
                }
                ,
                 {
                     "UserName": "AL-04346",
                    "NameDsc": "Karanveer singh(AL-04346)"
                  
                }
               
            ]
            viewModel.setProperty("/EmpList", EmpList);
             //   });
           
        },
        onComboSelectionForMachineDispatchedBy: function (oEvent) {  
            debugger;
                const selected = oEvent.getSource().getSelectedItem();
                const key = selected.getKey();     // BusinessPartner
                const text = selected.getText();

                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                oModel.setProperty("/MachineDispatchedByName", text);
                oModel.refresh();
        },
          onComboSelectionForMachineReceivedBy: function (oEvent) {  
            debugger;
                const selected = oEvent.getSource().getSelectedItem();
                const key = selected.getKey();     // BusinessPartner
                const text = selected.getText();

                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                oModel.setProperty("/MachineReceivedByName", text);
                oModel.refresh();
        },
         onComboSelectionForFinalClearedBy: function (oEvent) {  
            debugger;
                const selected = oEvent.getSource().getSelectedItem();
                const key = selected.getKey();     // BusinessPartner
                const text = selected.getText();

                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                oModel.setProperty("/FinalClearedByName", text);
                oModel.refresh();
        },
         onComboSelectionForFinalApprovedBy: function (oEvent) {  
            debugger;
                const selected = oEvent.getSource().getSelectedItem();
                const key = selected.getKey();     // BusinessPartner
                const text = selected.getText();

                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                oModel.setProperty("/FinalApprovedByName", text);
                oModel.refresh();
        },

         navBack:function()
        {
             var router = sap.ui.core.UIComponent.getRouterFor(this);
                //MessageToast.show("Redirecting to SAP Record Result.....")
                router.navTo("DispatchQualityList");
        },
         onCancel: function () {
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                //MessageToast.show("Redirecting to SAP Record Result.....")
                router.navTo("DispatchQualityList");
            },
           fillUserDecesionList: async function () {
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            viewModel.attachRequestCompleted(() => {
                     const FactSheet = [
                {
                    "DocumentName": "Specification Sheet (For Govt. Orders)",
                    "CheckBox": false
                   
                },
                {
                      "DocumentName": "Deviation Form",
                    "CheckBox": false
                },
                 {
                    "DocumentName": " Priority List",
                    "CheckBox": false
                    
                },
                {
                    "DocumentName": "Short Shipment Form",
                    "CheckBox": false
                }
                ,
                 {
                     "DocumentName": "Order Processing Sheet",
                    "CheckBox": false
                   
                },
                {
                  "DocumentName": "Any Other Reports",
                    "CheckBox": false
                }
               
            ]
            viewModel.setProperty("/FactSheet", FactSheet);
                });
           
        },
             cflForInspectionLot: async function () {
            try {
                debugger
                let material = this.getView().getModel(this.getEntryFormDataSourceModelName()).getProperty("/Material");
                let salesOrder = this.getView().getModel(this.getEntryFormDataSourceModelName()).getProperty("/SalesOrder");
                if(material!=""  && material!=undefined && salesOrder!="" && salesOrder!=undefined){
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json&$filter=Material eq '${material}' and SalesOrder eq '${salesOrder}'`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );
                }
                else if(material!="" && material!=undefined && salesOrder=="" && salesOrder==undefined){
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json&$filter=Material eq '${material}'`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );
                }
                else if(material=="" && salesOrder!="" && salesOrder!=undefined){
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json&$filter=SalesOrder eq '${salesOrder}'`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );
                }
                else
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json`,
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
        cflForSalesOrder: async function () {
            try {
                debugger
                
                   await this.createNewModelUsingAPI(
                        'GET',
                        `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json&$filter=SalesOrder ne ''`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );
                
               
                this.setCflDisplayColumns(['SalesOrder']);
                this.setCflDataColumns(['SalesOrder']);
                this.setCflValueAndDisplay('SalesOrder', 'SalesOrder', '', '');

                this.showCfl(
                    'SalesOrder',
                    this.getCflListViewDataSourceModelName(),
                    'values',
                    this.onConfirmSalesOrder.bind(this)
                );
              
            }
            catch (error) {
                MessageBox.show("SalesOrder -: " + error.message);
            }
        },
         onConfirmSalesOrder: function () {
            debugger
            let x = this.getCflObject();
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            viewModel.setProperty(`/SalesOrder`, x.SalesOrder);
            // viewModel.setProperty(`/SerialNumber`, "");

        },
         cflForMaterial: async function () {
            try {
                debugger
                  let salesOrder = this.getView().getModel(this.getEntryFormDataSourceModelName()).getProperty("/SalesOrder");
                  if(salesOrder!="" && salesOrder!=undefined){
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json?$format=json&$filter=SalesOrder eq '${salesOrder}'$apply=groupby((Material))`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );
                  }
                  else  
                  {
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/odata/v4/record-result-sap/RecordResultSAPHead?$apply=groupby((Material))&$filter=Material ne ''`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );
                }
               
                this.setCflDisplayColumns(['Material']);
                this.setCflDataColumns(['Material']);
                this.setCflValueAndDisplay('Material', 'Material', '', '');

                this.showCfl(
                    'Material',
                    this.getCflListViewDataSourceModelName(),
                    'value',
                    this.onConfirmMaterial.bind(this)
                );
            }
            catch (error) {
                MessageBox.show("Material -: " + error.message);
            }
        },
         onConfirmMaterial: function () {
            let x = this.getCflObject();
            let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            viewModel.setProperty(`/Material`, x.Material);
            // viewModel.setProperty(`/SerialNumber`, "");

        },
      

        cflForProduction: async function () {
            try {
                debugger
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                let Inspection = viewModel.getProperty(`/InspectionLot`);
                let salesOrder = viewModel.getProperty(`/SalesOrder`);
                let material = viewModel.getProperty(`/Material`);

              if(Inspection!="" && Inspection!=undefined && salesOrder!="" && salesOrder!=undefined && material!="" && material!=undefined  ){
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json&$filter=InspectionLot eq '${Inspection}' and SalesOrder eq '${salesOrder}' and Material eq '${material}'`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
              }
              else if(Inspection!="" && Inspection!=undefined && salesOrder=="" && salesOrder==undefined && material!="" && material!=undefined){
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json&$filter=InspectionLot eq '${Inspection}' and Material eq '${material}'`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
              }
              else if(Inspection!="" && Inspection!=undefined && salesOrder!="" && salesOrder!=undefined && material==""){
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json&$filter=InspectionLot eq '${Inspection}' and SalesOrder eq '${salesOrder}'`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
              }
              else if(Inspection=="" && salesOrder!="" && salesOrder!=undefined && material!="" && material!=undefined  ){
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json&$filter=SalesOrder eq '${salesOrder}' and Material eq '${material}'`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
              }
              else if(Inspection!="" && Inspection!=undefined && salesOrder==""  && material==""){
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json&$filter=InspectionLot eq '${Inspection}'`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
              }
              else if(Inspection=="" && salesOrder!="" && material==""){
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json&$filter=SalesOrder eq '${salesOrder}'`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
              }
              else if(Inspection=="" && salesOrder=="" && material!="" && material!=undefined){
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json&$filter=Material eq '${material}'`,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
              }
              else
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/record-result-sap/RecordResultSAPHead?$format=json `,
                    '',
                    this.getCflListViewDataSourceModelName()
                );
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
              if(Inspection!="" && Inspection!=undefined)
                {
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspLotSerialNumber?$format=json&$filter=InspectionLot eq '${Inspection}'`,
                        
                        '',
                        this.getCflListViewDataSourceModelName()
                    )
                }
            else
            {
                    await this.createNewModelUsingAPI(
                        'GET',
                        `/sap/opu/odata/sap/API_INSPECTIONLOT_SRV/A_InspLotSerialNumber?$format=json`,
                        '',
                        this.getCflListViewDataSourceModelName()
                    );  
            }

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

          Go: async function () {
            try {
                let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

              //  let Inspection = viewModel.getProperty("/InspectionLot");
                //let Production = viewModel.getProperty("/Production");
                let Serial = viewModel.getProperty("/SerialNum");

                await this.createNewModelUsingAPI(
                    'GET',
                    `/sap/opu/odata4/sap/zune_sb_so_inspection/srvd_a2x/sap/zune_sb_so_inspection/0001/ZUNE_CDS_SO_INSPECTION?$filter=SerialNumber eq '${Serial}'&$format=json`,
                    '',
                    'reportdata'
                );
                debugger;
                const reportData = this.getView().getModel('reportdata').getData();

                const { value = [] } = reportData || {};
                if(value.length>0)
                {
              
                viewModel.setProperty(`/InspectionLot`, value[0].InspectionLot);
                  viewModel.setProperty(`/Material`, value[0].Material);
                    viewModel.setProperty(`/SalesOrder`, value[0].SalesOrder);
                       viewModel.setProperty(`/_SalesOrder`, value[0].SalesOrder);
                      viewModel.setProperty(`/DistributionChannel`, value[0].DistributionChannel);
                viewModel.setProperty(`/DocumentNo`, value[0].DocumentNo);
                // viewModel.setProperty(`/ProductionOrder`, value[0].ManufacturingOrder);
                viewModel.setProperty(`/ExpiryDate`, value[0].ExpiryDate);
                viewModel.setProperty(`/IssueDate`, value[0].IssueDate);
                viewModel.setProperty(`/ShippingPoint`, value[0].ShippingPoint);
                viewModel.setProperty(`/SpecialConfiguration`, value[0].SpecialConfiguration);
                viewModel.setProperty(`/CustomerCode`, value[0].CustomerCode);
                viewModel.setProperty(`/CustomerName`, value[0].CustomerName);
                viewModel.setProperty(`/CityName`, value[0].CityName);
                viewModel.setProperty(`/Region`, value[0].Region);
                

                   
              
            }
            else
            {
                 MessageBox.show("Serial num not define..."); 
            }

            }
            catch (error) {
                MessageBox.show(error.message);
            }
        },



         
            DataValidationsForSave: async function () {
                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                var Deviation = oModel.getProperty("/thereanydeviation");
                var remarks = oModel.getProperty("/IfYesmentiondeviation");
                if(Deviation === "0")
                {
                    if(!remarks || remarks == "undefined" || remarks == "")
                    {
                        MessageToast.show("please Enter  deviation No.");
                        return false;
                    }
                     else
                        {
                            return true;
                        }
                }
                else
                {
                    return true;
                }
                
            },
        onSave: async function () {
            try {
                debugger;
                let isRecordAdded = false;
            const isDataValidated = await this.DataValidationsForSave();
            if (isDataValidated) 
                {
                    
                            const formMode = this.getFormMode();
                            if (formMode === "3") {
                                const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                                var serialNumber = oModelData.getProperty("/SerialNum");
                                await this.createNewModelUsingAPI(
                                    'GET',
                                    `/odata/v4/dispatch/DispatchQuality?$filter=(SerialNum eq '${serialNumber}')`,
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
                                   // this.router.navTo(this.getBackwardRoute());
                                    MessageToast.show("Data added successfully");

                                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                                    //MessageToast.show("Redirecting to SAP Record Result.....")
                                    router.navTo("DispatchQualityList");
                                }
                            }
                            else {

                            }
                 }
            }
            catch (error) {
                MessageBox.show(error.message);
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
                 else
                {
                    //userID = loginModel.value[0].UserName;
                }
            },
           
  OnPrint: async function (oEvent) {
    debugger;

    let _model = this.getView().getModel(this.getEntryFormDataSourceModelName());
    let Serial = _model.getProperty("/SerialNum");

    // Get Electrical User
    await this.createNewModelUsingAPI(
        'GET',
        `/odata/v4/get-electrial-user-services/GetElectrialUser?$filter=SerialBatchNumber eq '${Serial}'`,
        '',
        'Serialdata'
    );
    const Serialdata = this.getView().getModel('Serialdata').getData();
    const ElectrialUserName = Serialdata.value[0].ElectrialUserName;

    await this.createNewModelUsingAPI(
        'GET',
        `/odata/v4/product-quality-clearance/ProductQualityClearance?$filter=Serial eq '${Serial}'&$expand=LineItem`,
        '',
        'reportdata'
    );
    const reportData = this.getView().getModel('reportdata').getData();
    const dispatchData1 = reportData.value?.[0] || {};

    if (reportData.value.length > 0) {
        const { LineItem = [] } = dispatchData1 || {};

        await this.createNewModelUsingAPI(
            'GET',
            `/odata/v4/dispatch/DispatchQuality?$filter=SerialNum eq '${Serial}'&$expand=FactSheet`,
            '',
            'reportdata2'
        );
        const reportData2 = this.getView().getModel('reportdata2').getData();
        const dispatchData = reportData2.value?.[0] || {};
        const { FactSheet = [] } = dispatchData || {};

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });
        doc.setFontSize(7);

        const reportHeaderY = this.ReportHeader(doc, dispatchData1);
        const LineHeaderY = this.LineHeader(doc, dispatchData1, reportHeaderY);
        const LineSctionY = this.LineSection(doc, LineItem, LineHeaderY, dispatchData1, ElectrialUserName);

        const EndDispatchhe = this.DispatchQualityHeader(doc, dispatchData, LineSctionY);
        const EndHeaderDisp = this.LineHeaderForDispatch(doc, dispatchData, EndDispatchhe);
        this.LineSectionForDispatch(doc, FactSheet, EndHeaderDisp, dispatchData);

        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(8);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                `Page ${i} of ${pageCount}`,
                180,
                doc.internal.pageSize.height - 5
            );
        }

        doc.setFontSize(10);
        doc.save("SimpleReport.pdf");
    } else {
        MessageBox.show("No data available for the selected serial number for Product Quality Clearance.");
    }
},

// ---------------------------------------------------------------------------------
// Shared layout constants / helpers
// ---------------------------------------------------------------------------------
_PDF_TOP_MARGIN: 5,
_PDF_BOTTOM_MARGIN: 15,

/**
 * Ensures `neededHeight` (mm) fits below `y` on the current page.
 * If it doesn't, starts a new page and (optionally) redraws a table header
 * via `redrawHeader(doc)`, which must return the Y to continue at.
 * Returns the Y coordinate to draw at (unchanged, or reset after a page break).
 */
_ensureSpace: function (doc, y, neededHeight, redrawHeader) {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + neededHeight > pageHeight - this._PDF_BOTTOM_MARGIN) {
        doc.addPage();
        let newY = this._PDF_TOP_MARGIN;
        if (typeof redrawHeader === "function") {
            newY = redrawHeader(doc) || newY;
        }
        return newY;
    }
    return y;
},

/**
 * Wraps `text` to `maxWidth`, draws it starting at (x, y) with `lineHeight`
 * spacing, and returns the total height (mm) it occupied so callers can
 * shift subsequent content down dynamically instead of overlapping it.
 */
_drawWrapped: function (doc, text, x, y, maxWidth, lineHeight) {
    const lines = doc.splitTextToSize(text || "", maxWidth);
    lines.forEach((line, idx) => doc.text(line, x, y + idx * lineHeight));
    return Math.max(lineHeight, lines.length * lineHeight);
},

// ---------------------------------------------------------------------------------
ReportHeader: function (doc, value) {

    let y = 5;

    doc.setFont("Arial", "bold");
    doc.setFontSize(10);

    doc.line(5, y, doc.internal.pageSize.getWidth() - 5, y);
    doc.line(5, y + 15, doc.internal.pageSize.getWidth() - 5, y + 15);
    doc.line(40, y, 40, y);
    doc.line(60, y, 60, y + 15);
    doc.line(150, y, 150, y + 15);
   doc.setFontSize(22);
     doc.setFont("Arial", "bold");
    doc.text("Allengers", 10, y + 10);
       doc.setFontSize(8);
   // doc.text(`${value.ControledNo || ""}`, 152, y + 10);

     const ControledNo = value.ControledNo || "";
     const _ControledNo = doc.splitTextToSize(ControledNo, 33); // Adjust width as needed

        let _desireY = y + 6;

        _ControledNo.forEach((line) => {
            doc.text(line, 152, _desireY);
            _desireY += 3; 
        });
    
    doc.setFontSize(12);
    doc.text("Product Quality Clearance Certificate ", 60, y + 19);
    doc.line(5, y + 21, doc.internal.pageSize.getWidth() - 5, y + 21);
    doc.setFont("Arial", "normal");
    doc.setFontSize(7);

    doc.setFont("Arial", "normal");
    doc.text("Order Type.", 10, y + 25);
    if (value.OrderType == "YBM1") {
        doc.text("Make to Stock", 60, y + 25);
    } else if (value.OrderType == "YBM4") {
        doc.text("Make to Order", 60, y + 25);
    }

    doc.setFontSize(8);
    doc.setFont("Arial", "bold");
    doc.text("Production Details:-", 10, y + 30);
    doc.setFontSize(7);
    doc.setFont("Arial", "normal");
    doc.text("Machine part code ", 10, y + 35);
    doc.text(`${value.MachinePartCode || ""}`, 60, y + 35);
    doc.text("Serial Number ", 10, y + 40);
    doc.text(`${value.Serial || ""}`, 60, y + 40);
    doc.text("Inspection Lot", 10, y + 45);
    doc.text(`${value.Inspection || ""}`, 60, y + 45);
    doc.text("Machine Type ", 10, y + 50);
    doc.text(`${value.MachineType || ""}`, 60, y + 50);
    doc.text("Production Order", 10, y + 55);
    doc.text(`${value.ProductionOrder || ""}`, 60, y + 55);

    doc.text("Machine Model ", 120, y + 35);
    doc.text(`${value.MachineModel || ""}`, 170, y + 35);
    doc.text("Manufacturing Code(Regular/Desire)", 120, y + 40);
    doc.text(`${value.ManufacturingCode || ""}`, 170, y + 40);
    doc.text("Machine  Series ", 120, y + 45);
    doc.text(`${value.MachineSeries || ""}`, 170, y + 45);
    doc.text("ManufacturingCodeRevision  ", 120, y + 50);
    doc.text(`${value.ManufacturingCodeRevision || ""}`, 170, y + 50);
    doc.text("Part Description", 10, y + 60);

    // DYNAMIC: measure the wrapped description's real height and push every
    // field that follows down by however much it overflows a single line.
    const descHeight = this._drawWrapped(doc, value.DetailDescription, 60, y + 60, 140, 5);
    const descExtra = Math.max(0, descHeight - 5); // 5mm = one normal row

    y = y - 5;

    doc.text("If code is Desire then give Details:-", 10, y + 70 + descExtra);
   // doc.text(`${value.DesirethengiveDetails || ""}`, 60, y + 70 + descExtra);

    const desireDetails = value.DesirethengiveDetails || "";
        const desireLines = doc.splitTextToSize(desireDetails, 120); // Adjust width as needed

        let desireY = y + 70 + descExtra;

        desireLines.forEach((line) => {
            doc.text(line, 60, desireY);
            desireY += 4; // Line spacing
            y=y+4;
        });

    

    doc.text("Certificate Type ", 10, y + 80 + descExtra);
    doc.text(`${value.CertificateType || ""}`, 60, y + 80 + descExtra);
    doc.text("Certificate No.", 10, y + 85 + descExtra);
    doc.text(`${value.CertificateNo || ""}`, 60, y + 85 + descExtra);
    doc.text("Certification Type ", 10, y + 90 + descExtra);
    doc.text(`${value.CertificationType || ""}`, 60, y + 90 + descExtra);

    doc.setFontSize(8);
    doc.setFont("Arial", "bold");
    doc.text("PRODUCT INSPECTION DETAILS:", 10, y + 95 + descExtra);
    doc.setFontSize(7);
    doc.setFont("Arial", "Normal");
    doc.text("Inspected By:", 10, y + 100 + descExtra);
    doc.text("Electrical QA", 10, y + 105 + descExtra);
    doc.text(`${value.ElectricalQA || ""}`, 60, y + 105 + descExtra);
    doc.text("Mechanical QA", 10, y + 110 + descExtra);
    doc.text(`${value.MechanicalQA || ""}`, 60, y + 110 + descExtra);
    doc.text("Person Authorized for inpection  ", 10, y + 115 + descExtra);
    doc.text("of Export Machine.", 10, y + 118 + descExtra);
    doc.text(`${value.PersanAUthorizedforInspection || ""}`, 60, y +115 + descExtra);

    doc.text("Product Specilist Approval (For Machine", 10, y + 123 + descExtra);
    doc.text("under Pre Yello/Yellow Certificate)", 10, y + 126 + descExtra);
     doc.text(`${value.ProductSpecilistApproval || ""}`, 60, y +123 + descExtra);
    doc.text("Is there any deviation required: ", 10, y + 131 + descExtra);
    if (value.deviation == "0") {
        doc.text('Yes', 60, y + 131 + descExtra);
    } else if (value.deviation == "1") {
        doc.text('No', 60, y + 131 + descExtra);
    }
    doc.text("If Yes, mention deviation No.", 10, y + 134 + descExtra);
    doc.text(`${value.deviationNo || ""}`, 60, y + 134 + descExtra);

    doc.text("Signature", 100, y + 105 + descExtra);
    doc.text("Signature", 100, y + 110 + descExtra);
    doc.text("Signature", 100, y + 115 + descExtra);
    doc.text("Signature", 100, y + 120 + descExtra);
debugger
    doc.text("Date", 155, y + 105 + descExtra);
    doc.text(`${value.MechanicalDate || ""}`, 165, y + 105 + descExtra);
    doc.text("Date", 155, y + 110 + descExtra);
    doc.text(`${value.ElectricalDate || ""}`, 165, y + 110 + descExtra);
    doc.text("Date", 155, y + 115 + descExtra);
     doc.text(`${value.PADate || ""}`, 165, y +115 + descExtra);
    doc.text("Date", 155, y + 120 + descExtra);
      doc.text(`${value.PSDate || ""}`, 165, y +120 + descExtra);

    doc.text("Special instruction if any", 10, y + 140 + descExtra);

    // DYNAMIC: Special Instruction cursor, continuing from the tracked `y`.
    let sy = y + 140 + descExtra;
    const specialLines = doc.splitTextToSize(value.SpecialInstruction || "", 135);
    specialLines.forEach(line => {
        doc.text(line, 60, sy);
        sy += 4;
    });

    doc.line(5, 5, 5, sy + 5);
    doc.line(doc.internal.pageSize.getWidth() - 5, 5, doc.internal.pageSize.getWidth() - 5, sy + 5);

     doc.text("CHECKLIST OF DOCUMENTS REQUIRED BEFORE CLEARANCE FOR DISMANTLING:", 10, sy + 3 );
     const pageWidth = doc.internal.pageSize.getWidth();
     doc.line(5, sy, pageWidth - 5, sy);

    return sy+4;
},

// ---------------------------------------------------------------------------------
LineHeader: function (doc, reportdata, startY) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // DYNAMIC: if the header row itself doesn't fit, roll to a new page first.
    startY = this._ensureSpace(doc, startY, 12);

    let Py = startY;
    doc.line(5, Py, pageWidth - 5, Py);

    Py += 4;
    doc.text("Document Name", 10, Py);
    doc.text("Document required Yes/No", 132, Py);


    doc.line(pageWidth - 5, Py - 5, pageWidth - 5, Py - 5 + 8);
    doc.line(5, Py - 4, 5, Py - 5 + 8);
    doc.line(130, Py - 4, 130, Py - 5 + 10);
  //  doc.line(170, Py - 4, 170, Py - 5 + 10);

    Py += 5;
    doc.line(5, Py - 2, pageWidth - 5, Py - 2);

    return Py + 3;
},

// ---------------------------------------------------------------------------------
LineSection: function (doc, value, startY, dispatchData1, ElectrialUserName) {
    let LineY = startY;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textLineHeight = 2;
    const minRowHeight = 1;
    const rowHeight = Math.max(textLineHeight, minRowHeight);
    const rowBlock = rowHeight + 6; // total vertical space one row consumes

    for (let i = 0; i < value.length; i++) {

        // DYNAMIC: check remaining space for THIS row; roll page + reprint
        // the column header if it won't fit.
        LineY = this._ensureSpace(
            doc, LineY, rowBlock,
            (newDoc) => this.LineHeader(newDoc, dispatchData1, this._PDF_TOP_MARGIN)
        );

        const rowStartY = LineY;

        doc.text(`${value[i].DocumentNum || ""}`, 10, rowStartY);
        doc.text(value[i].IsDocumentAtteched == true ? "Yes" : "No", 140, rowStartY);


        doc.line(5, rowStartY + rowHeight, pageWidth - 5, rowStartY + rowHeight);
        [5, 130, pageWidth - 5].forEach(x => {
            doc.line(x, rowStartY - 6, x, rowStartY + rowHeight);
        });

        LineY += rowBlock;
    }

    // Fixed-height footer block ("Approval For Product Dismentling") - ~30mm.
    LineY = this._ensureSpace(doc, LineY, 30);

    doc.line(5, LineY, doc.internal.pageSize.getWidth() - 5, LineY);
    doc.text("Approval For Product Dismentling :", 11, LineY + 3);
    doc.line(5, LineY + 5, doc.internal.pageSize.getWidth() - 5, LineY + 5);
    doc.line(5, LineY + 25, doc.internal.pageSize.getWidth() - 5, LineY + 25);
    doc.line(5, LineY + 30, doc.internal.pageSize.getWidth() - 5, LineY + 30);

    doc.line(5, LineY, 5, LineY + 30);
    doc.line(50, LineY + 5, 50, LineY + 30);
    doc.line(100, LineY + 5, 100, LineY + 30);
    doc.line(150, LineY + 5, 150, LineY + 30);

    doc.line(50, LineY + 10, 150, LineY + 10);
    doc.text("Final Clearance By", 60, LineY + 8);
    doc.text("Final Approval By", 110, LineY + 8);

    doc.text("Clearance for dismentling ", 10, LineY + 15);
    doc.text(`${dispatchData1.FinalClearBy || ""}`, 52, LineY + 15);
     doc.text(`${dispatchData1.FinalClearByDate || ""}`, 52, LineY + 18);
    
  //  doc.text("(Name )      (Signature )   (Date )", 52, LineY + 22);

    doc.text(`${dispatchData1.FinalApprovalBy || ""}`, 102, LineY + 15);
     doc.text(`${dispatchData1.FinalApprovalByDate || ""}`, 102, LineY + 18);
  //  doc.text("(Name )      (Signature )   (Date )", 102, LineY + 22);

    doc.text("Packing Ensured By", 10, LineY + 28);
    doc.text("Name", 52, LineY + 28);
    doc.text(`${dispatchData1.PackingEnsuredBy || ""}`, 60, LineY + 28);
    doc.text("Signature", 102, LineY + 28);
    doc.text("Date:", 122, LineY + 28);
    doc.text(`${dispatchData1.PEByDate || ""}`, 135, LineY + 28);

    doc.line(doc.internal.pageSize.getWidth() - 5, LineY, doc.internal.pageSize.getWidth() - 5, LineY + 30);

   
      doc.text("This Document is electronically authenticated and no signature is required", 70, LineY + 34);
       doc.setFontSize(12);
    doc.setFont("Arial", "bold");
    doc.setTextColor(255, 0, 0); // Red
      doc.text("CONTROLLED COPY", 80, LineY + 40);
      doc.setTextColor(0, 0, 0);     // Black
    return LineY + 30;
},

// ---------------------------------------------------------------------------------
DispatchQualityHeader: function (doc, value, Footer_EndY) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // DYNAMIC: the "Pre Dispatch" certificate block needs ~50mm. If that
    // doesn't fit on the current page, only THEN roll to a new page
    // (previously this was an unconditional page break at a fixed offset).
    let y = this._ensureSpace(doc, Footer_EndY, 50);

    doc.setFont("Arial", "bold");
    doc.setFontSize(10);
    doc.text(" Product Quality Clearance Certificate ", 60, y + 5);
    doc.setFont("Arial", "normal");
    doc.setFontSize(7);

    doc.line(5, y + 10, 5, y + 50);
    doc.line(pageWidth - 5, y + 10, pageWidth - 5, y + 50);
    doc.line(5, y + 10, pageWidth - 5, y + 10);
    doc.text("Serial Number ", 8, y + 13);
    doc.text(`${value.SerialNum || ""}`, 70, y + 13);

    doc.line(5, y + 15, pageWidth - 5, y + 15);
    doc.text("SaleOrder No:  ", 8, y + 20);
    doc.text(`${value.SalesOrder || ""}`, 30, y + 20);

    doc.text("CustomerCode:  ", 70, y + 18);
    doc.text(`${value.CustomerCode || ""}`, 120, y + 18);

    doc.text("CityName:  ", 70, y + 22);
    doc.text(`${value.CityName || ""}`, 120, y + 22);

    doc.text("Region:  ", 70, y + 26);
    doc.text(`${value.Region || ""}`, 120, y + 26);

    doc.line(5, y + 30, pageWidth - 5, y + 30);
    doc.text("Any Special Configuration /Specification/", 8, y + 33);
    doc.text("Accessories required by the customer :-  ", 8, y + 36);
    //doc.text(`${value.SpecialConfiguration || ""}`, 90, y + 33);
  doc.line(60, y + 10, 60, y + 30);

   const desireDetails = value.SpecialConfiguration || "";
        const desireLines = doc.splitTextToSize(desireDetails, 120); // Adjust width as needed

        let desireY = y + 33;

        desireLines.forEach((line) => {
            doc.text(line, 60, desireY);
            desireY += 4; // Line spacing
            y=y+4;
        });

    doc.line(5, y + 10, 5, y + 50);
    doc.line(pageWidth - 5, y + 10, pageWidth - 5, y + 50);
    doc.line(5, y + 35, pageWidth - 5, y + 35);
    doc.text("Sales order detail:- (FG Machine code /Details description  (configuration detail) with line item ", 8, y + 38);

    doc.line(5, y + 40, pageWidth - 5, y + 40);
    doc.text("Shipping Point  ", 8, y + 43);
    doc.text(`${value.ShippingPoint || ""}`, 120, y + 43);

    doc.line(5, y + 45, pageWidth - 5, y + 45);
    doc.text("Distribution Channel ", 8, y + 48);
    doc.text(`${value.DistributionChannel || ""}`, 120, y + 48);

    doc.line(5, y + 50, pageWidth - 5, y + 50);
  

    // DYNAMIC: the Short-Shipment / deviation block is its own ~12mm unit -
    // check it fits below what we just drew; roll page only if it doesn't.
    let y2 = this._ensureSpace(doc, y + 50, 12);

    doc.line(5, y2, 5, y2 + 17);
    doc.line(pageWidth - 5, y2, pageWidth - 5, y2 + 17);
    doc.line(5, y2, pageWidth - 5, y2);

    doc.text("In case of EUDAMED is NO the device must not be dispatched in EUROPE.  ", 8, y2 + 3    );
     doc.text("EUDAMED registration is applicable only for CE marked machine ", 8, y2 + 7    );
    if (value.IsDeviceregistered == "0") {
        doc.text('Yes', 100, y2 + 3);
    } else if (value.IsDeviceregistered == "1") {
        doc.text('No', 100, y2 + 3);
    }

    doc.text("Is there any Short Shipment:- ", 120, y2 + 3);
    if (value.Isthereany == "0") {
        doc.text('Yes', 160, y2 + 3);
    } else if (value.Isthereany == "1") {
        doc.text('No', 160, y2 + 3);
    }
    doc.text("If Yes, mention detail (Ref. No.)   :- ", 120, y2 + 7);
    doc.text(`${value.RefNo || ""}`, 160, y2 + 7);

    doc.text("Is there any deviation required:- ", 8, y2 + 11);
   
    if (value.thereanydeviation == "0") {
        doc.text('Yes', 100, y2 + 11);
    } else if (value.thereanydeviation == "1") {
        doc.text('No', 100, y2 + 11);
    }
    doc.text("If Yes, mention deviation No.    :- ", 120, y2 + 11);
    doc.text(`${value.IfYesmentiondeviation || ""}`, 160, y2 + 11);

     doc.line(5, y2+13, pageWidth - 5, y2+13);
     doc.text("CHECKLIST OF DOCUMENTS REQUIRED BEFORE PRODUCT PREDISPATCH CLEARACNE:", 10, y2 + 16 );
     const pageWidth1 = doc.internal.pageSize.getWidth();
     doc.line(5, y2+17, pageWidth1 - 5, y2+17);
    return y2 + 17;
},

// ---------------------------------------------------------------------------------
LineHeaderForDispatch: function (doc, value, EndDisHeader_Y) {
    const pageWidth = doc.internal.pageSize.getWidth();

    let startY = this._ensureSpace(doc, EndDisHeader_Y, 12);

    let Py = startY;
    doc.line(5, Py, pageWidth - 5, Py);

    Py += 4;
    doc.text("Document Name", 10, Py);
    doc.text("Document required Yes/No", 155, Py);
 

    doc.line(pageWidth - 5, Py - 5, pageWidth - 5, Py - 5 + 8);
    doc.line(5, Py - 4, 5, Py - 5 + 8);
 
    doc.line(150, Py - 4, 150, Py - 5 + 10);

    Py += 5;
    doc.line(5, Py - 2, pageWidth - 5, Py - 2);

    

    return Py + 3;
},

// ---------------------------------------------------------------------------------
LineSectionForDispatch: function (doc, value, EndDisLinestartY, value2) {
    const pageWidth = doc.internal.pageSize.getWidth();
    let LineY = EndDisLinestartY;
    const textLineHeight = 2;
    const minRowHeight = 2;
    const rowHeight = Math.max(textLineHeight, minRowHeight);
    const rowBlock = rowHeight + 6;

    for (let i = 0; i < value.length; i++) {
debugger
        // DYNAMIC: page-break check + header redraw per row.
        LineY = this._ensureSpace(
            doc, LineY, rowBlock,
            (newDoc) => this.LineHeaderForDispatch(newDoc, value2, this._PDF_TOP_MARGIN)
        );

        const rowStartY = LineY;

        doc.text(`${value[i].DocumentName || ""}`, 10, rowStartY);
        doc.text(value[i].CheckBox == true ? "Yes" : "No", 155, rowStartY);
      

        doc.line(5, rowStartY + rowHeight, pageWidth - 5, rowStartY + rowHeight);
        [5, 150, pageWidth - 5].forEach(x => {
            doc.line(x, rowStartY - 6, x, rowStartY + rowHeight);
        });

        LineY += rowBlock;
    }

    // "Total packets / Procurement Permission" block - ~40mm fixed.
    LineY = this._ensureSpace(doc, LineY, 40);

    doc.text("Total no. of packet send with product: ", 8, LineY);
    doc.text(`${value2.Totalnoofpackets || ""}`, 60, LineY);
    doc.line(5, LineY + 5, pageWidth - 5, LineY + 5);

    doc.setFont("Arial", "bold");
    doc.setFontSize(8);
    doc.text("Procurement permission (PP) Detail: ", 8, LineY + 8);
    doc.setFont("Arial", "normal");
    doc.setFontSize(7);

    doc.line(5, LineY + 10, pageWidth - 5, LineY + 10);
    doc.text("Document No. : ", 8, LineY + 13);
    doc.text(`${value2.DocumentNo || ""}`, 160, LineY + 13);

    doc.line(5, LineY + 15, pageWidth - 5, LineY + 15);
    doc.text("Issue Date: ", 8, LineY + 18);
    doc.text(`${value2.IssueDate || ""}`, 160, LineY + 18);
    doc.text(" : ", 102, LineY + 18);

    doc.line(5, LineY + 20, pageWidth - 5, LineY + 20);
    doc.text("Expiry Date : ", 8, LineY + 23);
    doc.text(`${value2.ExpiryDate || ""}`, 160, LineY + 23);

    doc.line(5, LineY + 25, pageWidth - 5, LineY + 25);
    doc.text("Note - Machine will not be dispatched without PP. PP is Not Applicable in case of Dummy / Export / Demo (without Exposure) Machines and Assemblies.: ", 8, LineY + 28);

    doc.line(5, LineY + 30, pageWidth - 5, LineY + 30);
   // doc.text("Note: PP is  Not Applicable in case of Dummy / Export / Demo (without Exposure) Machines and Assemblies ", 8, LineY + 33);
    //doc.line(5, LineY + 35, pageWidth - 5, LineY + 35);

    doc.line(5, LineY + 5, 5, LineY + 30);
    doc.line(150, LineY + 10, 150, LineY + 25);
    doc.line(pageWidth - 5, LineY + 5, pageWidth - 5, LineY + 30);

    LineY += 40;

    // "Approvals for Product Dispatch" block - ~30mm fixed.
    LineY = this._ensureSpace(doc, LineY, 30);

    doc.line(5, LineY, pageWidth - 5, LineY);
    doc.setFont("Arial", "bold");
    doc.setFontSize(8);
    doc.text("Approvals for Product Dispatch: ", 8, LineY + 3);
    doc.setFont("Arial", "Normal");
    doc.setFontSize(7);

    doc.line(5, LineY + 5, pageWidth - 5, LineY + 5);
    doc.text("Final  Cleared By : ", 20, LineY + 8);
    doc.text("Final  Approved  By : ", 120, LineY + 8);
    doc.line(5, LineY + 10, pageWidth - 5, LineY + 10);
    doc.text("Name : ", 20, LineY + 13);
    doc.text(`${value2.FinalClearedByName || ""}`, 55, LineY + 13);
    doc.text("Name : ", 120, LineY + 13);
     doc.text(`${value2.FinalApprovedByName || ""}`, 160, LineY + 13);
    doc.line(5, LineY + 15, pageWidth - 5, LineY + 15);
    doc.text("Signature : ", 20, LineY + 18);
    doc.text("Signature : ", 120, LineY + 18);
    doc.line(5, LineY + 20, pageWidth - 5, LineY + 20);
    doc.text("Date : ", 20, LineY + 23);
    doc.text(`${value2.FinalClearedDate || ""}`, 55, LineY + 23);
    doc.text("Date : ", 120, LineY + 23);
    doc.text(`${value2.FinalApprovedDate || ""}`, 160, LineY + 23);
    doc.line(5, LineY + 25, pageWidth - 5, LineY + 25);

    doc.line(5, LineY, 5, LineY + 25);
    doc.line(100, LineY + 5, 100, LineY + 25);
    doc.line(50, LineY + 10, 50, LineY + 25);
    doc.line(150, LineY + 10, 150, LineY + 25);
    doc.line(pageWidth - 5, LineY, pageWidth - 5, LineY + 25);

    LineY += 30;

    // "Dispatch Detail" block - ~20mm fixed.
    LineY = this._ensureSpace(doc, LineY, 20);

    doc.line(5, LineY, 5, LineY + 20);
    doc.line(pageWidth - 5, LineY, pageWidth - 5, LineY + 20);
    doc.line(5, LineY, pageWidth - 5, LineY);
    doc.setFont("Arial", "bold");
    doc.setFontSize(8);
    doc.text("Dispatch Detail: ", 8, LineY + 3);
    doc.setFont("Arial", "Normal");
    doc.setFontSize(7);

    doc.line(5, LineY + 5, pageWidth - 5, LineY + 5);
    doc.text("Machine Received (By Logistics): ", 8, LineY + 8);
    doc.text("Name: ", 50, LineY + 8);
     doc.text(`${value2.MachineReceivedByName || ""}`, 60, LineY + 8);
    doc.text("Signature: ", 100, LineY + 8);
    doc.text("Date: ", 150, LineY + 8);
      doc.text(`${value2.dateofReceived || ""}`, 160, LineY + 8);
    doc.line(5, LineY + 10, pageWidth - 5, LineY + 10);

    doc.line(5, LineY + 15, pageWidth - 5, LineY + 15);
    doc.text("Machine Dispatched by: ", 8, LineY + 18);
    doc.text("Name: ", 50, LineY + 18);
      doc.text(`${value2.MachineDispatchedByName || ""}`, 60, LineY + 18);
    doc.text("Signature: ", 100, LineY + 18);
    doc.text("Date: ", 150, LineY + 18);
      doc.text(`${value2.dateofDispatched || ""}`, 160, LineY + 18);
    doc.line(5, LineY + 20, pageWidth - 5, LineY + 20);

     doc.text("This Document is electronically authenticated and no signature is required", 80, LineY + 34);
       doc.setFontSize(12);
    doc.setFont("Arial", "bold");
     doc.setTextColor(255, 0, 0); // Red
      doc.text("CONTROLLED COPY", 95, LineY + 40);
    doc.setTextColor(0, 0, 0);     // Black
      
    
  

    return LineY + 30;
}

        });
    });
