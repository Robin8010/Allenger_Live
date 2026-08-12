sap.ui.define([
  "core/generic/genericentryform",
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/base/Log",
  "sap/ui/Device",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/Fragment"
], (genericentryform,BaseController, MessageToast, MessageBox, Log, Device, JSONModel, Fragment) => {
  "use strict";

  return genericentryform.extend("qcui.controller.App", {
    onInit() {
      this._loadSysModel();
      //App Controll disable
      var App_Model = { enableToolHeader: false };

      //Robin
      let oModel = new sap.ui.model.json.JSONModel(App_Model)
      this.getView().setModel(oModel, 'oAppModel');
      oModel.setProperty("/enableToolHeader", false);
      oModel.refresh(true);




      this.oMyAvatar = this.oView.byId("lnkLogout")

      this._oPopover = Fragment.load({
        id: this.oView.getId(),
        name: "qcui.view.Popover",
        controller: this
      }).then(function (oPopover) {
        this.oView.addDependent(oPopover);
        this._oPopover = oPopover;
      }.bind(this));
    },
     onItemPress: function () {
      var router = sap.ui.core.UIComponent.getRouterFor(this);
      router.navTo("LandingPageIndex");
    },
    handleLinkPress: function (oEvent) {
      var oEventSource = oEvent.getSource(),
        bActive = this.oMyAvatar.getActive();

      this.oMyAvatar.setActive(!bActive);

      if (bActive) {
        this._oPopover.close();
      } else {
        this._oPopover.openBy(oEventSource);
      }
    },
    onLogoPressed:function()
    {
        var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("LandingPageIndex");
    },
    onListItemPress: function () {
      MessageBox.confirm("Your session will be logout.", {
        title: "Confirm",
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        onClose: function (oAction) {
          if (oAction === MessageBox.Action.OK) {
              this.UnlockUserScreen(); 
            this.deleteLoginInfo();
           // Clear sessionStorage
            sessionStorage.clear();

            // Clear localStorage (only keys related to app)
            localStorage.removeItem("sap.ushell.UserTileData");

            // Optional: Clear all localStorage (careful!)
            localStorage.clear();
         
              var router = sap.ui.core.UIComponent.getRouterFor(this);
              router.navTo("RouteLogin");

 //Reload the page to ensure all data is cleared
              sap.ui.getCore().getConfiguration().setLanguage(
                    sap.ui.getCore().getConfiguration().getLanguage()
                );
                window.location.reload(true);
            
          
      
           
           

            this._VisibleFalseHeader();
          }
        }.bind(this)
      });
    },


    
    UnlockUserScreen: async function () {
      debugger
    let formTypeRR   =await this.populateFormStatus("GET","/odata/v4/form-status-services/FormStatus?$filter=FormId eq 'RR'","");
    let formTypeDS   =await this.populateFormStatus("GET","/odata/v4/form-status-services/FormStatus?$filter=FormId eq 'DS'","");
   if(formTypeRR.value.length>0)
        {
          if(formTypeRR.value[0].IsLockedForRR!=undefined)  
          {
                  if(formTypeRR.value[0].IsLockedForRR === true)    
                      {      
                                  let _json= {
                                                "FormId": "RR",
                                                "ID":   formTypeRR.value[0].ID,
                                                "IsLockedForRR": false,
                                                "RRUserName": null
                                            }
                                            
                                    await   this.populateFormStatus("Patch","/odata/v4/form-status-services/FormStatus(" +   formTypeRR.value[0].ID + ")",_json);
                        }
              }
      }
        if(formTypeDS.value.length>0)
        {
                if(formTypeDS.value[0].IsLockedForDS!=undefined)  
                {
                    if(formTypeDS.value[0].IsLockedForDS === true)    
                    {
                                  let _json2={
                                            "FormId": "DS",
                                            "ID": formTypeDS.value[0].ID,
                                            "IsLockedForDS": false,
                                            "DSUserName": null
                                        }
                          await   this.populateFormStatus("Patch","/odata/v4/form-status-services/FormStatus(" +   formTypeDS.value[0].ID + ")",_json2);
                      }
                    }
            }
  },
    _loadSysModel: function () {
      let oModel = new sap.ui.model.json.JSONModel();
      oModel.loadData('model/sysModel.json');
      this.getView().setModel(oModel, 'sysModel');
    },
    _VisibleFalseHeader: function () {
      let oModel = this.getView().getModel('oAppModel')
      //this.getView().setModel(oModel, 'oAppModel');
      oModel.setProperty("/enableToolHeader", false);
      oModel.refresh(true);
    },
    _loadSysModel: function () {
      let oModel = new sap.ui.model.json.JSONModel();
      oModel.loadData('model/sysModel.json');
      this.getView().setModel(oModel, 'sysModel');
    }
  });
});