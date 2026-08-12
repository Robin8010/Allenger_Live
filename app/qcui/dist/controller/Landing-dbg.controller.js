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
                  // Always reset tiles first
                     this.hideAllTiles();
                 const loginModel =
                this.getOwnerComponent()
                .getModel("UserModel");



            if (
                !loginModel ||
                !loginModel.value ||
                loginModel.value.length === 0
            ) {


                MessageToast.show(
                    "User information not found"
                );


                return;

            }



            let user =
                loginModel.value[0];
                sap.m.MessageBox.success("USER MODEL OBJECT:", user);
                console.log("USER MODEL OBJECT:", user);

                let isAdmin = false;
                let manageRecordResult = false;
                let manageUserDecision = false;
                let DebitNote = false;
                let RecordResultreport = false;
                let Dispatch = false;
                let QualityAnalyst = false;
                if (loginModel && loginModel != 'undefined' && loginModel.value.length > 0) {
                    isAdmin = loginModel.value[0].IsAdmin;
                    manageRecordResult = loginModel.value[0].ManageRecordResult;
                    manageUserDecision = loginModel.value[0].ManageUserDecision;
                    RecordResultreport = loginModel.value[0].IsRecordResultreport;
                    DebitNote = loginModel.value[0].IsDebitNote;
                    Dispatch = loginModel.value[0].DispatchQuality;
                    QualityAnalyst = loginModel.value[0].QualityAssurance;

                if (isAdmin==true) {
                    this.getView().byId("gt1").setVisible(true);
                 }
                if (manageRecordResult==true) {
                    this.getView().byId("gt3").setVisible(true);
                }
                  if (manageUserDecision==true) {
                    this.getView().byId("gt5").setVisible(true);
                 }
                  if (RecordResultreport==true) {
                    this.getView().byId("gt6").setVisible(true);
                 }
                if (QualityAnalyst==true) {
                    this.getView().byId("gt7").setVisible(true);
                }
                if (DebitNote==true) {
                    this.getView().byId("gt8").setVisible(true);
                }
                if (Dispatch==true) {
                    this.getView().byId("gt9").setVisible(true);
                }
               
               
                }
                else
                {
                     var router = sap.ui.core.UIComponent.getRouterFor(this);
                    router.navTo("RouteIndexPage");
                }
              
            },

             /*
        ==============================
        HIDE ALL TILES
        ==============================
        */

        hideAllTiles:function(){


            let tiles = [
                "gt1",
                "gt3",
                "gt4",
                "gt5",
                "gt6",
                 "gt7",
                  "gt8",
                   "gt9"
            ];



            tiles.forEach(
                function(id){


                    let tile =
                        this.byId(id);



                    if(tile){

                        tile.setVisible(false);

                    }



                }.bind(this)
            );



        },
            ClickMe: function () {
                console.log("Clicked");
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to User Master.....")
                router.navTo("RouteNameUserMasterConfiguration");
            },
             ShowproductQuality: function () {
                console.log("Clicked");
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to Product Quality Assurance.....")
                router.navTo("ProductQualityAssuranceList");
            },
            Showrecordresult:function(){
                debugger;
                console.log("Clicked");
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to Record Result.....")
                router.navTo("RecordResultListReport");
                
            },
             ShowDebitNote: function () {
                debugger;
                let isAdmin = false;
                 const loginModel = this.getOwnerComponent().getModel("UserModel");
                let GMC_ = false;
                debugger;
                if (loginModel && loginModel != 'undefined' && loginModel.value.length > 0) 
                    {
                   // GMC_ = loginModel.value[0].ManagGMC;
                     //isAdmin = loginModel.value[0].IsAdmin
                     //   if(isAdmin=true)
                      //  {
                            console.log("Clicked");
                            var router = sap.ui.core.UIComponent.getRouterFor(this);
                            MessageToast.show("Redirecting to DebitNote.....")
                            router.navTo("DebitNoteLayout");
                       // }
                       // else
                       // {
                             //  var router = sap.ui.core.UIComponent.getRouterFor(this);
                             //   router.navTo("LoginPage");
                              //  MessageToast.show("Not a valid user.....")
                             //   MessageToast.show("Not a valid user.....")
                             //   MessageToast.show("Not a valid user.....")
                             //   MessageToast.show("Not a valid user.....")
                              //  MessageToast.show("Not a valid user.....")
                            //MessageToast.show("Not Authorise to access GMC.....")
                      //  }
                    }
            },
            ShowRecordResult: function () {
                console.log("Clicked");
              let router=sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to Record Result.....")
                router.navTo("RouterNameRecordResultViewForm");
            },
             ShowReport: function () {
                console.log("Clicked");
              let router=sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to InspectionReport.....")
                router.navTo("InspectionLotReport");
            },
              ShowDispatchQuality: function () {
                console.log("Clicked");
              let router=sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("Redirecting to InspectionReport.....")
                router.navTo("DispatchQualityList");
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