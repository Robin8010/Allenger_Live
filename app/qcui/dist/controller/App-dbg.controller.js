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
    onListItemPress: function () {
      MessageBox.confirm("Your session will be logout.", {
        title: "Confirm",
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        onClose: function (oAction) {
          if (oAction === MessageBox.Action.OK) {
            this.deleteLoginInfo();
            sessionStorage.clear();
            localStorage.clear();
            var router = sap.ui.core.UIComponent.getRouterFor(this);
            window.history.pushState(null, null, window.location.href);
            window.onpopstate = function () {
              window.history.go(1);
            };
            router.navTo("RouteLogin");

            this._VisibleFalseHeader();
          }
        }.bind(this)
      });
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