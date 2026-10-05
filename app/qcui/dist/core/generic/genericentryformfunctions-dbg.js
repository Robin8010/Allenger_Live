sap.ui.define([
    "core/generic/genericentryformproperties",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller"
    //"core/base/basefunction"
],
    function (genericentryformproperties, JSONModel) {
        "use strict";
        //let Etag="";

        return genericentryformproperties.extend("coregeneric.genericentryformfunctions", {

            onInit: function () {

                genericentryformproperties.prototype.onInit.apply(this, arguments);

                this.router = sap.ui.core.UIComponent.getRouterFor(this);


            },


            identifyFormMode: function (oEvent) {
                //var oArguments = oEvent.getParameter('arguments');
                //0 - Find
                //1 - Ok
                //2- Edit/Update
                //3 - Add / New
                //4 - View
                //5 - Print
                //7 - Archive
                let obj, routeData;
debugger;
                routeData = this.getRouteData();
                let sText = "";
                if (routeData !== "undefined") {

                    this.setFormMode(routeData.formMode);

                    //obj = JSON.parse(oEvent.data.data);

                    if (routeData.formMode == 1) {
                        // OK Mode
                        sText = "Okay";
                    }
                    else if (routeData.formMode == 2) {
                        // Edit Mode
                        this.setListViewEditPropertyValue(routeData.uniqueId);
                        sText = "Update";
                    }
                    else if (routeData.formMode == 3) {
                        //Add Mode
                        sText = "Add";
                    }

                    //var oButton = this.byId("EntryFormSaveButton");
                    //oButton.setText(sText);
                } else {
                    alert('FormMode');
                }

            },
 
             populateFormStatus: async function (oRequestType, aUrl, oRequestData) {
                const data = await this.callApi(oRequestType, aUrl, oRequestData);
                return data;
            },
            showEntryForm: async function (pageId) {

                if (this.getFormMode() == "2") {
                   await this.populateEntryForm("GET", this.getEntryFormDataSourceURLForEditMode(), "");
                   await this.populateEntryForm("GET", this.getEntryFormDataSourceURLForEditMode(), "");
                }
                else if (this.getFormMode() == "3") {
                    if (this.getEntryFormDataSourceURLForNewMode().length > 0) {
                    await    this.populateEntryForm("GET", this.getEntryFormDataSourceURLForNewMode(), "");
                    }
                }

            },

          populateEntryForm: async function (oRequestType, aUrl, oRequestData) {
    try {
         let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

        if (!oModel) {
            oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
        }
        const data = await this.callApi(oRequestType, aUrl, oRequestData);
          //Robin  this.Etag=data.headers["etag"];
       // console.log("Response:", data);

        // safer empty check (works for OData + JSON)
        const isEmpty =
            !data ||
            (data.value && Array.isArray(data.value) && data.value.length === 0) ||
            (Array.isArray(data) && data.length === 0);

        if (isEmpty) {
            MessageToast.show("No data returned from API");
            return;
        }

    debugger   
  //setTimeout(() => {
   
        oModel.setData(data);
        oModel.updateBindings(true);
       // oModel.refresh(true);
    
//  })

    } catch (error) {
        console.error("API failure:", error);

        MessageToast.show("Failed to load data");
    }
},
populateEntryForm2: async function (oRequestType, aUrl, oRequestData) {
    try {
         let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

        if (!oModel) {
            oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
        }
        const data = await this.callApi(oRequestType, aUrl, oRequestData);

       // console.log("Response:", data);

        // safer empty check (works for OData + JSON)
        const isEmpty =
            !data ||
            (data.value && Array.isArray(data.value) && data.value.length === 0) ||
            (Array.isArray(data) && data.length === 0);

        if (isEmpty) {
            MessageToast.show("No data returned from API");
            return;
        }

    debugger   
  //setTimeout(() => {
   
       // oModel.setData(data);
        //oModel.updateBindings(true);
       // oModel.refresh(true);
    
//  })

    } catch (error) {
        console.error("API failure:", error);

        MessageToast.show("Failed to load data");
    }
},
          populateEntryFormRunning: async function (oRequestType, aUrl, oRequestData) {
                try {
                    const data = await this.callApi(oRequestType, aUrl, oRequestData);

                    console.log("Success:", data);

                    let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

                    if (!oModel) {
                        oModel = new sap.ui.model.json.JSONModel();
                    }

                    oModel.setData(data);
                    this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());

                } catch (error) {
                    console.error("Error:", error);
                }
            },
          
            populateEntryFormold: async function (oRequestType, aUrl, oRequestData, retries = 3) {
                try {
                    debugger;
                    const data = await this.callApi(oRequestType, aUrl, oRequestData);

                    console.log("Response:", data);

                    // ✅ Check if data is empty
                    const isEmpty =
                        !data ||
                        (Array.isArray(data) && data.length === 0) ||
                        (typeof data === "object" && Object.keys(data).length === 0);

                    if (isEmpty) {
                        throw new Error("Empty response from API");
                    }

                    let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

                    if (!oModel) {
                        oModel = new sap.ui.model.json.JSONModel();
                    }
                    debugger
                  ///  oModel.attachRequestCompleted(() => {
                                        oModel.setData(data);
                                        this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                  //  });
                } catch (error) {
                   // console.warn("Attempt failed:", error.message);

                   // if (retries > 0) {
                      //  console.log(`Retrying... attempts left: ${retries}`);

                        // wait before retry (important!)
                      //  await new Promise(resolve => setTimeout(resolve, 1000));

                      //  return this.populateEntryForm(oRequestType, aUrl, oRequestData, retries - 1);
                //   }

                    console.error("Final failure after retries:", error);
                }
            },
             getModifyTime: async function () {
    try {
         let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

        if (!oModel) {
            oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
        }
        const data = await this.callApi("GET", this.getEntryFormDataSourceURLForEditMode(), "");
      
        const isEmpty =
            !data ||
            (data.value && Array.isArray(data.value) && data.value.length === 0) ||
            (Array.isArray(data) && data.length === 0);

        if (isEmpty) {
            MessageToast.show("No data returned from API");
            return;
        }

    debugger   
 return data.modifiedAt;
    
//  })

    } catch (error) {
        console.error("API failure:", error);

        MessageToast.show("Failed to load data");
    }
},
 getModifyonMiddletableTime: async function (Middletable) {
    try {
         let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

        if (!oModel) {
            oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
        }
        const data = await this.callApi("GET", this.getEntryFormDataSourceURLForEditMode(), "");
      
        const isEmpty =
            !data ||
            (data.value && Array.isArray(data.value) && data.value.length === 0) ||
            (Array.isArray(data) && data.length === 0);

        if (isEmpty) {
            MessageToast.show("No data returned from API");
            return;
        }

    debugger   
 return data.Middletable.modifiedAt;
    
//  })

    } catch (error) {
        console.error("API failure:", error);

        MessageToast.show("Failed to load data");
    }
},
            saveEntryForm: async function (oRequestType, aUrl, oRequestData) {
                // IF condition to be done to set getURLForFormModeNew or getURLForFormModeEdit
                await this.callApi(oRequestType, aUrl, oRequestData)
                    .then((data) => {
                        // writing like this .then ((data) => {}) gives the parent context, in this case the controller.
                        console.log('Success:', data);
                        var oModel = new JSONModel();
                        oModel.setData(data); // 'data' is the response from your API call
                        this.getView().setModel(oModel, this.getEntryFormResponseDataSourceModelName());

                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                        throw new Error("Error in processing. Please check log or try again...");
                    });

            },

            clearGenericEntryForm: function () {
                // to clear all properties of generic entry form
                this.clearGenericListViewForm();
                this.createNewModel(this.getEntryFormDataSourceModelName());
            },




        });
    });
