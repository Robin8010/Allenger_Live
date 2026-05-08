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
                this.initialize();

            },
		 initialize: async function () {

                this.FillListView();
		},

		FillListView: async function () {
   			 debugger
			// 2️⃣ Clear previous GMC data before fetching new one
			if (this.getView().getModel("QC")) {
				this.getView().getModel("QC").setData({ value: [] });
			}

			// 3️⃣ Fetch fresh data from backend
			debugger;

			
					await this.createNewModelUsingAPI(
						"GET",`/odata/v4/product-quality-clearance/ProductQualityClearance`,"","QC" 
					);
					const oGMCModel = this.getView().getModel("QC");
					oGMCModel.refresh(true);
			
			
			

			
			},
			  isValidUser: function () {
                // let loginInfo=this.getLoginInfo();
                // let userid = loginInfo.UserID;
                    debugger;
                const loginModel = this.getOwnerComponent().getModel('UserModel');
                if (!loginModel || loginModel === 'undefined') {
                    var router = sap.ui.core.UIComponent.getRouterFor(this);
                    router.navTo("RouteIndex");
                    MessageToast.show("Not a valid user.");
                }
                else
                {
                   globalVarForUserId= loginModel.value[0].username;
				   globalVarForUserName=loginModel.value[0].username;
                }
            },
		
		onEditPress: function (oEvent) {
			debugger;
				var oButton = oEvent.getSource();
					var oBindingContext = oButton.getBindingContext("QC");
					let oRowObject = oBindingContext.getProperty("ID");

					this.setRouteData("2",oRowObject);
					var router = sap.ui.core.UIComponent.getRouterFor(this);
                     router.navTo("GoodsMChallanEntry");
					
				
		},
		Addnew: function (oEvent) {
			var ID="";
            this.setRouteData("3",ID);
			var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("GoodsMChallanEntry");
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
onSearchWithDate: function (oEvent) {
	var sQuery = oEvent.getParameter("newValue"); // Get search input
	var filters=[];
	if(sQuery)
	{
		var filter1 = new sap.ui.model.Filter({path:"DocDate",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
		filters=[filter1];
		var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
}
var otable = this.byId("Tbl");
otable.getBinding("items").filter(finalFilter);
	
}


	});
});