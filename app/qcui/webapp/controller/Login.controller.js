sap.ui.define([
    "core/generic/genericentryform",
    "sap/ui/core/mvc/Controller",
     "sap/m/MessageToast",
], function(genericentryform,Controller,MessageToast){
    "use strict";
    return genericentryform.extend("qcui.controller.Login", {

        onInit() {
            var loginModel = { UserName: "", Password: "" };
            let oModel = new sap.ui.model.json.JSONModel(loginModel)
            this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
        },
        onUserNameChanged: function (oEvent) {
            // Get the selected state of the CheckBox
            //var bSelected = oEvent.getParameter("selected");
            var userNameValue = oEvent.getParameter("value");
            // Update the model property based on the CheckBox selection
            let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            //let oModel = cgetModel(this.getEntryFormDataSourceModelName());
            oModel.setProperty("/UserName", userNameValue);
            oModel.refresh(true);
        },
        onPasswordChanged: function (oEvent) {
            // Get the selected state of the CheckBox
            //var bSelected = oEvent.getParameter("selected");
            var passwordValue = oEvent.getParameter("value");
            // Update the model property based on the CheckBox selection
            let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
            //let oModel = cgetModel(this.getEntryFormDataSourceModelName());
            oModel.setProperty("/Password", passwordValue);
            oModel.refresh(true);
        },
        onEnterPress: function (oEvent) {
            this.onPressLogin(); // Trigger the same logic as button press
        },
        onPressLogin: async function () {
            //Login Button disable
            let oModelL = this.getView().getModel(this.getEntryFormDataSourceModelName());
            oModelL.setProperty("/buttonEnabled", false);
            oModelL.refresh(true);
            //Login Button disableFFF
            MessageToast.show("Validating user.....")
            if (this.validateFields()) {
                const modelName = this.getEntryFormDataSourceModelName();
                const model = this.getView().getModel(modelName);
                var userName = model.getProperty("/UserName");
                var password = model.getProperty("/Password");
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/user-master/userMaster?$filter=UserName eq '${userName}' and Password eq '${password}'`,
                    '',
                    'UserModel'
                );
                const loginData = this.getView().getModel('UserModel').getData();
                var login = false;
                if (loginData && loginData.value && loginData.value.length > 0) {
                    login = true;
                }
                else {
                    login = false;
                }
                if (login) {
                    //Login Button enable
                    let oModelL = this.getView().getModel(this.getEntryFormDataSourceModelName());
                    oModelL.setProperty("/buttonEnabled", false);
                    oModelL.refresh(true);
                    //Login Button enable

                    this.getOwnerComponent().setModel(loginData, "UserModel")
                    var router = sap.ui.core.UIComponent.getRouterFor(this);


                    var isAdmin = false;
                    if (userName === "admin@uneecops.com") {
                        isAdmin = true;
                    }
                    else {
                        isAdmin = false;
                    }
                    /*
                    this.setLoginInfo(userName,
                        userName,
                        userName,
                        "",
                        "",
                        "",
                        "",
                        "",
                        userName,
                        undefined,//userData.EmployeeCode,
                        "",
                        isAdmin
                    );
                    */

                    //App Controll Enable
                    let oModelApp = this.getView().getModel('oAppModel');
                    oModelApp.setProperty("/enableToolHeader", true);
                    //Login Button enable
                    oModelL.setProperty("/buttonEnabled", true);
debugger
                     let Desc= loginData.value[0].NameDsc;
                    let _AppModel=this.getView().getModel('sysModel');
                    _AppModel.setProperty("/userDetails/UserDsc",Desc);
                    _AppModel.refresh(true);
                    oModelApp.refresh(true);
                    //App Controll Enable
                    MessageToast.show("Redirecting to home.....");
                    oModelL.setProperty("/buttonEnabled", true);
                    oModelL.refresh(true);
                    router.navTo("LandingPageIndex");
                }
                else {
                    MessageToast.show("Invalid credential....");
                }
            }
        },
        validateFields: function () {
            let isValid = true;

            const oModel = this.getEntryFormModel();
            const username = oModel.getProperty('/UserName');
            const password = oModel.getProperty('/Password');

            if (!username || username.trim() === '') {
                isValid = false;
                sap.m.MessageToast.show('Please enter username');
            } else if (!password || password.trim() === '') {
                isValid = false;
                sap.m.MessageToast.show('Please enter password');
            }
            return isValid;
        }
    });
});