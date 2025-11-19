sap.ui.define([
    "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],

    function (genericentryform, MessageToast, MessageBox, FormMode) {
        "use strict";
        var _RoleInfo = null, _LoginInfo;

        return genericentryform.extend("modconfcontroller.usermasterentryform", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
                //this.initialize();
            },
            onBeforeShow: async function (oEvent) {
                this.identifyFormMode(oEvent);
                this.initialize();
                this.setEntryFormDataSourceURLForEditMode("/odata/v4/user-master/userMaster(ID = " + this.getListViewEditPropertyValue() + ")");
                await this.showEntryForm();
                this.handleUIOperation();
            },
            initialize: async function () {
                this.setPageId("usermasterf");
                this.setFormTitle("User Master Form");
                this.setBackwardRoute("RouteNameUserMasterConfiguration");

                this.setEntryFormDataSourceURLForNewMode("");

                this.setEntryFormDataSourceURLToAddData("/odata/v4/user-master/userMaster");
                this.setEntryFormDataSourceURLToUpdateData("/odata/v4/user-master/userMaster('" + this.getListViewEditPropertyValue() + "')");
                this.setListViewFilterColumn();
                let oPath = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/userMasterEntryForm.json", // Edit Response Model
                );

                let oModel = new sap.ui.model.json.JSONModel(oPath);
                this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());

                let oPathSaveReq = jQuery.sap.getModulePath(
                    "qcui",
                    "/modconf/model/userMasterSaveRequest.json", //Save Request Model
                );

                let oModelSaveRequest = new sap.ui.model.json.JSONModel(oPathSaveReq);
                this.getView().setModel(oModelSaveRequest, "userMasterSaveRequest");
            },
            handleUIOperation: function () {
                const formMode = this.getFormMode();
                if (formMode === "2") {
                    this.handleFormInEditMode();
                }
            },
            handleFormInEditMode: function () {
                let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                oModel.setProperty("/disableUsername", false);
            },
            onSave: async function () {
                try {
                    let isRecordAdded = false;
                    const formMode = this.getFormMode();
                    if (formMode === "3") {
                        const oModelData = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        var userName = oModelData.getProperty("/UserName");
                        await this.createNewModelUsingAPI(
                            'GET',
                            `/odata/v4/user-master/userMaster?$filter=UserName eq '${userName}'`,
                            '',
                            'UserMasterData'
                        );
                        const userMasterData = this.getView().getModel('UserMasterData').getData();
                        if (userMasterData && userMasterData.value && userMasterData.value.length > 0) {
                            MessageToast.show("Record already added for this username");
                            isRecordAdded=true;
                        }
                    }
                    if(!isRecordAdded)
                    {
                        let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        let oData = oModel.getData();

                        const modelData = this.getView().getModel(this.getEntryFormDataSourceModelName()).getData();
                        let trgObject = this.getView().getModel("userMasterSaveRequest").getData();
                        console.log("Target Object:", trgObject);

                        this.transferObjectValues(modelData, trgObject);
                        await this.onPressOfEntryFormSaveButton(trgObject);
                        let response = this.getApiResponseObject();;
                        if (response.success) {
                            console.log("No duplicate found. Proceeding with save..okok.");
                            this.router.navTo(this.getBackwardRoute());
                            MessageToast.show("Record added successfully");
                        }
                    }
                }
                catch (error) {
                    MessageBox.show(error.message);
                }
            },
            onDeleteuser: function (oEvent) {
                // Step 1: Get the source of the event (e.g., the button)
                var oButton = oEvent.getSource();

                // Step 2: Get the binding context of the row containing the button
                var oBindingContext = oButton.getBindingContext(this.getEntryFormDataSourceModelName());

                if (!oBindingContext) {
                    console.error("Binding context not found");
                    return;
                }

                // Step 3: Extract the full data path and calculate the index
                var sPath = oBindingContext.getPath(); // e.g., "/Role/1"
                console.log("Binding Path:", sPath);

                var iIndex = parseInt(sPath.split("/").pop(), 10); // Extract the last part of the path
                console.log("Calculated Index:", iIndex);

                // Step 4: Access the data model and retrieve data
                var oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                var aData = oModel.getProperty("/Role");

                // Step 5: Confirm deletion
                MessageBox.show("Are you sure you want to delete record?", {
                    title: "Confirm",
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this.updateuserRoleModel(iIndex);
                        }
                    }.bind(this)
                });
            },

            updateuserRoleModel: function (iIndex) {
                // Access the model
                const modelName = this.getEntryFormDataSourceModelName();

                //const iIndex = oEvent.getSource().getParent().getParent().indexOfItem(oEvent.getSource().getParent());
                this.deleteRow(modelName, 'Role', iIndex);
                // var oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                // var aData = oModel.getProperty("/Role");

                // // Remove the item from the model
                // if (iIndex >= 0 && iIndex < aData.length) {
                //     aData.splice(iIndex, 1);
                // }

                // // Recalculate RowNumber
                // aData = aData.map((item, i) => ({
                //     ...item,
                //     RowNumber: i + 1
                // }));

                // // Update the model
                // oModel.setProperty("/Role", aData);

                // // // Refresh the binding to update the UI
                // var oTable = this.getView().byId("smuserRoleTable");
                // if (oTable) {
                //     var oBinding = oTable.getBinding("items");
                //     if (oBinding) {
                //         oBinding.refresh();
                //     } else {
                //         console.warn("No binding found for the table items.");
                //     }
                // }

                console.log("Updated Role Data:", aData);
            }
        });
    });