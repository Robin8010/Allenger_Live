sap.ui.define([
	  "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
],  function (genericentryform, MessageToast, MessageBox, Controller) {
        "use strict";
		let UserType;
		 let globalVarForUserId = "";
		  let globalVarForUserName = "";
		 return genericentryform.extend("modconfcontroller.ProductQualityList", {

	
		onInit: function () {
			genericentryform.prototype.onInit.apply(this, arguments); 
			
		},
		 onBeforeShow: function (oEvent) {
                this.isValidUser();
			 this.identifyFormMode(oEvent);
                this.initialize();

            },
		 initialize: async function () {

                this.FillListView();
		},

		FillListView: async function () {
   			 debugger
			
					await this.createNewModelUsingAPI(
						"GET",`/odata/v4/product-quality-clearance/ProductQualityClearance`,"","QC" 
						//"GET",`/odata/v4/gmcheader-services/GMCHeader`,"","GMC" 
					);
					const oGMCModel = this.getView().getModel("QC");
					oGMCModel.refresh(true);
			
			
			},
			  isValidUser: function () {
               
                    debugger;
                const loginModel = this.getOwnerComponent().getModel('UserModel');
                if (!loginModel || loginModel === 'undefined') {
                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                    router.navTo("RouteIndex");
                    MessageToast.show("Not a valid user.");
                }
              
            },
		
		onEditPress: function (oEvent) {
			debugger;
				var oButton = oEvent.getSource();
					var oBindingContext = oButton.getBindingContext("QC");
					let oRowObject = oBindingContext.getProperty("ID");

					this.setRouteData("2",oRowObject);
					var router = sap.ui.core.UIComponent.getRouterFor(this);
                     router.navTo("ProductQualityAssurance");
					
				
		},
		Addnew: function (oEvent) {
			var ID="";
			debugger;
            this.setRouteData("3",ID);
			var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("ProductQualityAssurance");
		},

		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("newValue"); // Get search input
			var filters=[];
			if(sQuery)
			{
				var filter1 = new sap.ui.model.Filter({path:"JobworkPo",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
				filters=[filter1];
				var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
		}
		var otable = this.byId("Tbl");
		otable.getBinding("items").filter(finalFilter);
			
	},
	onSearchWithName: function (oEvent) {
		var sQuery = oEvent.getParameter("newValue"); // Get search input
		var filters=[];
		if(sQuery)
		{
			var filter1 = new sap.ui.model.Filter({path:"Name",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
			filters=[filter1];
			var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
	}
	var otable = this.byId("Tbl");
	otable.getBinding("items").filter(finalFilter);
		
},
navBack: function() {
		
		history.go(-1);
			
			//var router = sap.ui.core.UIComponent.getRouterFor(this);
           // router.navTo("RouteIndex");
		},



	});
});