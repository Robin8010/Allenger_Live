sap.ui.define([
    "core/generic/genericentryform",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/base/Log",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    (genericentryform, Controller, MessageToast, MessageBox, Log, Device, JSONModel, Fragment) => {
        "use strict";

        return genericentryform.extend("qcui.controller.Landing", {
            onInit: function () {
                this.isValidUser();
                this.CheckTilesAccess();

                Log.info(this.getView().getControllerName(), "onInit");
                this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
                this.getOwnerComponent().getRouter().attachBypassed(this._onBypassed, this);

                var oTitlesModel = new JSONModel();
                this.getView().setModel(oTitlesModel, "titleModel");
                this.getOwnerComponent().getRouter().attachTitleChanged(function (oEvent) {
                    oTitlesModel.setData(oEvent.getParameters());
                });
            },


            CheckTilesAccess: function () {
                let loginInfo = this.getLoginInfo();
                const loginModel = this.getOwnerComponent().getModel("UserModel");
                let isAdmin = false;
                let manageRecordResult = false;
                let manageUserDecision = false;
                if (loginModel && loginModel != 'undefined' && loginModel.value.length > 0) {
                    isAdmin = loginModel.value[0].IsAdmin;
                    manageRecordResult = loginModel.value[0].ManageRecordResult;
                    manageUserDecision = loginModel.value[0].ManageUserDecision;
                }
                if (isAdmin) {
                    this.getView().byId("gt1").setVisible(true);
                }
                else {
                    this.getView().byId("gt1").setVisible(false);
                }
                this.getView().byId("gt3").setVisible(manageRecordResult);
                this.getView().byId("gt5").setVisible(manageUserDecision);
            },
            ClickMe: function () {
                console.log("Clicked");
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to User Master.....")
                router.navTo("RouteNameUserMasterConfiguration");
            },
            ShowRecordResult: function () {
                console.log("Clicked");
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to Record Result.....")
                router.navTo("RouterNameRecordResultViewForm");
            },
            ShowRecordResultSAP: function () {
                console.log("Clicked");
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to Record Result.....")
                router.navTo("RouterNameRecordResultSAPViewForm");
            },
            ShowStockTransfer: function () {
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to Stock Transfer.....")
                router.navTo("RouterNameStockTransferViewForm");
            },
            ShowDecisionAndTransfer: function () {
                console.log("Clicked");
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to Decision & Transfer.....")
                router.navTo("RouterNameStockTransferSAPViewForm");
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
            },

            // handleLinkPress: function () {
            //  MessageBox.confirm("Your session will be logout.", {
            //     title: "Confirm",
            //   actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            //   onClose: function (oAction) {
            //       if (oAction === MessageBox.Action.OK) {
            //          this.deleteLoginInfo();
            //       var router = sap.ui.core.UIComponent.getRouterFor(this);
            //     router.navTo("RouteIndexPage");
            //  }
            //}.bind(this)
            // });
            // }
        });
    });