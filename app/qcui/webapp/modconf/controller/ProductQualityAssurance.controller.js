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
            this.isValidUser();
            this.identifyFormMode(oEvent);
            debugger;
            this.initialize();
            // this.setEntryFormDataSourceURLForEditMode("/odata/v4/product-quality-clearance/ProductQualityClearance(ID = " + ID + ")?$expand=LineItem");
            await this.showEntryForm();
            await this._loadFragment("Fragment1", "fragment1Container");
            await this._loadFragment("Fragment2", "fragment2Container");
            await this._loadFragment("Fragment3", "fragment3Container");
            await this._loadFragment("Fragment4", "fragment4Container");
               await this.SetConstantValuesInEditMode();
            
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

                const loginModel = this.getOwnerComponent().getModel('UserModel');
                if (!loginModel || loginModel === 'undefined') {
                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                    router.navTo("RouteLogin");
                    MessageToast.show("Not a valid user.");
                }
                 else
                {
                   // userID = loginModel.value[0].UserName;
                }
            },
        cflForInspectionLot: async function () {
            try {
                debugger
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
            viewModel.setProperty(`/Inspection`, x.InspectionLot);
            // viewModel.setProperty(`/SerialNumber`, "");

        },

      cflForProduction: async function () {
    try {
        debugger;

        let viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
        let Inspection = viewModel.getProperty("/Inspection");

        let sUrl = "/odata/v4/record-result-sap/RecordResultSAPHead?$format=json";

        if (Inspection != null && Inspection !== "") {
            sUrl += `&$filter=InspectionLot eq '${Inspection}'`;
        }

        await this.createNewModelUsingAPI(
            "GET",
            sUrl,
            "",
            this.getCflListViewDataSourceModelName()
        );

        this.setCflDisplayColumns(["ManufacturingOrder"]);
        this.setCflDataColumns(["ManufacturingOrder"]);
        this.setCflValueAndDisplay(
            "ManufacturingOrder",
            "ManufacturingOrder",
            "",
            ""
        );

        this.showCfl(
            "ManufacturingOrder",
            this.getCflListViewDataSourceModelName(),
            "value",
            this.onConfirmProduction.bind(this)
        );

    } catch (error) {
        MessageBox.show("cflForProduction -: " + error.message);
    }
},
       onCheckBoxSelect: function (oEvent) {
    const oContext = oEvent.getSource().getBindingContext("EntryFormDataSourceModel");
    const oModel = oContext.getModel();
    const sPath = oContext.getPath();

    const bDocChecked = oModel.getProperty(sPath + "/IsDocumentAtteched");
    const bApplicableChecked = oModel.getProperty(sPath + "/IsApplicable");

    // If Document is checked, uncheck Applicable
    if (oEvent.getSource().getBinding("selected").getPath() === "IsDocumentAtteched") {
        if (oEvent.getParameter("selected")) {
            oModel.setProperty(sPath + "/IsApplicable", false);
        }
    }

    // If Applicable is checked, uncheck Document
    if (oEvent.getSource().getBinding("selected").getPath() === "IsApplicable") {
        if (oEvent.getParameter("selected")) {
            oModel.setProperty(sPath + "/IsDocumentAtteched", false);
        }
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

                let Inspection = viewModel.getProperty("/Inspection");
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
                    "DocumentNum": "AERB Report ",
                    "IsDocumentAtteched": false
                  
                },
                 {
                    "DocumentNum": " BIS Report",
                    "IsDocumentAtteched": false
                   
                }
                ,
                 {
                    "DocumentNum": " Scan Copy of Serial Number",
                    "IsDocumentAtteched": false
                    
                }
                ,
                 {
                    "DocumentNum": "Line Resolution",
                    "IsDocumentAtteched": false
                  
                }
                ,
                 {
                    "DocumentNum": "Wave Forms",
                    "IsDocumentAtteched": false
                }
                ,
                 {
                    "DocumentNum": "I.I. Test Report",
                    "IsDocumentAtteched": false
                }
                ,
                 {
                    "DocumentNum": "Burn in report",
                    "IsDocumentAtteched": false
                }
                ,
                 {
                    "DocumentNum": "Any Other Reports",
                    "IsDocumentAtteched": false
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

        
           //Get Electrial User
 await this.createNewModelUsingAPI(
                'GET',
                 `/odata/v4/get-electrial-user-services/GetElectrialUser?$filter=SerialBatchNumber eq '${Serial}'`,
                '',
                'Serialdata'
            );
            debugger
  const Serialdata=this.getView().getModel('Serialdata').getData();
           const ElectrialUserName = Serialdata.value[0].ElectrialUserName;
              const MechnicalUserName = Serialdata.value[0].MechnicalUserName;
              //  const ISO ="abc";// Serialdata.value[0].ISO;


         await this.createNewModelUsingAPI(
                    'GET',
                    `/sap/opu/odata4/sap/zune_sb_so_inspection/srvd_a2x/sap/zune_sb_so_inspection/0001/ZUNE_CDS_SO_INSPECTION?$filter=SerialNumber eq '${Serial}'&$format=json`,
                    '',
                    'data'
                );
                debugger;
                const data = this.getView().getModel('data').getData();
                if(data.value.length > 0 )
                {
debugger;
               const orderType = data.value[0].OrderType;

            viewModel.setProperty("/OrderType", orderType);
                }
        
                

        
        

    

        await this.createNewModelUsingAPI(
            'GET',
            `/odata/v4/inspection-qcreport/InspectionQcReport?$filter=SerialBatchNumber eq '${Serial}'`,
            '',
            'reportdata'
        );

        const reportData = this.getView().getModel('reportdata').getData();

        const { value = [] } = reportData || {};

        if (value.length === 0) {
            MessageBox.show("Serial num not defined...");
            return;
        }

        let material = value[0].Material;

        await this.createNewModelUsingAPI(
            'GET',
            `/sap/opu/odata/sap/ZUNE_SB_P_C_V3/ZUNE_C_PRODUCT_FINAL?$filter=PartCode eq '${material}'`,
            '',
            'PartData'
        );

        const partModel = this.getView().getModel('PartData');
        const PartData = partModel.getProperty("/d/results");

        // ===============================
        // 3. SET MODEL DATA
        // ===============================

        viewModel.setProperty(`/Inspection`, value[0].InspectionLot);
        viewModel.setProperty(`/MachinePartCode`, PartData[0].PartCode);
        viewModel.setProperty(`/DetailDescription`, PartData[0].YY1_ProductDetailDescr_PRD);
        viewModel.setProperty(`/Serial`, value[0].SerialBatchNumber);
        viewModel.setProperty(`/CertificationType`, PartData[0].CertificationType);
        viewModel.setProperty(`/MachineType`, PartData[0].MachineType);
        viewModel.setProperty(`/ProductionOrder`, value[0].ManufacturingOrder);
        viewModel.setProperty(`/MachineModel`, PartData[0].MachineModel);
        viewModel.setProperty(`/ManufacturingCode`, PartData[0].ManufacturingCode);
        viewModel.setProperty(`/MachineSeries`, PartData[0].MachineSeries);
        viewModel.setProperty(`/ManufacturingCodeRevision`, PartData[0].ManufacturingCodeRevision);
          viewModel.setProperty(`/ElectricalQA`, value[0].ElectrialUserName);
            viewModel.setProperty(`/MechanicalQA`, value[0].MechnicalUserName);
             viewModel.setProperty(`/ElectricalDate`, value[0].ElectrialDate);
            viewModel.setProperty(`/MechanicalDate`, value[0].MechnicalDate);
           // viewModel.setProperty(`/ControledNo`, ISO);

            viewModel.setProperty(`/CertificateType`, PartData[0].MachineCertificateDesc);

      

    }
    catch (error) {
        MessageBox.show(error.message);
    }
},
     onOrderTypeSelect: function (oEvent) {

                const iIndex = oEvent.getParameter("selectedIndex");

                const sOrderType = iIndex === 0 ? "YBM1" : "YBM4";

                const oModel = this.getView().getModel("EntryFormDataSourceModel");

                oModel.setProperty("/OrderTypeIndex", iIndex);
                oModel.setProperty("/OrderType", sOrderType);
                
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

             DataValidationsForSave: async function () {
                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                var Deviation = oModel.getProperty("/deviation");
                var remarks = oModel.getProperty("/deviationNo");
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
                const formMode = this.getFormMode();
                  const isDataValidated = await this.DataValidationsForSave();
            if (isDataValidated) 
                {
                    if (formMode === "3") {
                        const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        var serialNumber = oModelData.getProperty("/Serial");
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
                        let PADate=    oModel.getProperty("/PADate");
                        let PSDate= oModel.getProperty("/PSDate");
                      
                        if(PADate=="" || PADate==undefined)
                        {
                            oModel.setProperty("/PADate", null);
                        }
                         if(PSDate=="" || PSDate==undefined)
                        {
                            oModel.setProperty("/PSDate", null);
                        }

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
            }
            catch (error) {
                MessageBox.show(error.message);
            }
        },

          async OnPrint(oEvent)
        {
             debugger;
          
         let _model=  this.getView().getModel(this.getEntryFormDataSourceModelName())  ;
            let Serial=_model.getProperty("/Serial");

             await this.createNewModelUsingAPI(
                'GET',
                 `/odata/v4/get-electrial-user-services/GetElectrialUser?$filter=SerialBatchNumber eq '${Serial}'`,
                '',
                'Serialdata'
            );
  const Serialdata=this.getView().getModel('Serialdata').getData();
           const ElectrialUserName = Serialdata.value[0].ElectrialUserName;
           
            await this.createNewModelUsingAPI(
                'GET',
                 `/odata/v4/product-quality-clearance/ProductQualityClearance?$filter=Serial eq '${Serial}'&$expand=LineItem`,
                '',
                'reportdata'
            );
           debugger;  
          const reportData=this.getView().getModel('reportdata').getData();
           const dispatchData1 = reportData.value?.[0] || {};
           if(reportData.value.length>0    )
           {
          const { LineItem = [] } = dispatchData1|| {};
          //const{LineItem=[]}=value[0]||{};
            
                        debugger;
                        //GetPartNo Info
                        debugger;
                            // Use jsPDF
                                const { jsPDF } = window.jspdf;
                            const doc = new jsPDF({
                            orientation: "portrait", // 👈 change from portrait
                            unit: "mm",
                            format: "a4"
                            });
                    
                        doc.setFontSize(7); // reset your default size after font change

                          ///  const oModel = this.getView().getModel('reportdata'); // original model
               // const data = oModel.getProperty("/value");

             


                debugger;
                 


                           const reportHeaderY = this.ReportHeader(doc, dispatchData1);
                          const LineHeaderY = this.LineHeader(doc,dispatchData1,reportHeaderY);
                          const LineSction= this.LineSection (doc, LineItem, LineHeaderY,dispatchData1,ElectrialUserName) ;
                       //  const EndDispatchhe=    this.DispatchQualityHeader(doc,reportData,LineSction)
                       //  const EndHeaderDisp=        this.LineHeaderForDispatch(doc,reportData,EndDispatchhe);
                                  //      this.LineSectionForDispatch(doc,LineItem,EndHeaderDisp)
                        
                        debugger
                       
                        const pageCount = doc.getNumberOfPages();
                        doc.setFontSize(8);
                        for (let i = 1; i <= pageCount; i++) {
                            doc.setPage(i);
                            
                            doc.text(
                                `Page ${i} of ${pageCount}`,
                                180,              // X position (center-ish)
                                doc.internal.pageSize.height - 5 // bottom of page
                            );
                        }

                           
                
                    doc.setFontSize(10);
                 
                    doc.save("SimpleReport.pdf");
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
    doc.line(150, y, 150, y + 15);
    doc.setFontSize(9);
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
    doc.text(`${dispatchData1.PackingEnsuredBy || ""}`, 70, LineY + 28);
    doc.text("Signature", 102, LineY + 28);
    doc.text("Date:", 122, LineY + 28);
    doc.text(`${dispatchData1.PEByDate || ""}`, 135, LineY + 28);

    doc.line(doc.internal.pageSize.getWidth() - 5, LineY, doc.internal.pageSize.getWidth() - 5, LineY + 30);

   
      doc.text("This Document is electronically authenticated and no signature is required", 80, LineY + 34);
       doc.setFontSize(12);
    doc.setFont("Arial", "bold");
      doc.text("CONTROLLED COPY", 95, LineY + 40);
    return LineY + 30;
},

    });
});