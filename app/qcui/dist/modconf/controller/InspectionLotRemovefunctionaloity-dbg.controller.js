

sap.ui.define([
	  "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], 
 function (genericentryform, MessageToast, MessageBox, Controller) {
	"use strict";
// Paste ABOVE your Controller.extend line
var NOTO_SANS_BASE64 = "PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ZW4+CiAgPG1ldGEgY2hhcnNldD11dGYtOD4KICA8bWV0YSBuYW1lPXZpZXdwb3J0IGNvbnRlbnQ9ImluaXRpYWwtc2NhbGU9MSwgbWluaW11bS1zY2FsZT0xLCB3aWR0aD1kZXZpY2Utd2lkdGgiPgogIDx0aXRsZT5FcnJvciA0MDQgKE5vdCBGb3VuZCkhITE8L3RpdGxlPgogIDxzdHlsZT4KICAgICp7bWFyZ2luOjA7cGFkZGluZzowfWh0bWwsY29kZXtmb250OjE1cHgvMjJweCBhcmlhbCxzYW5zLXNlcmlmfWh0bWx7YmFja2dyb3VuZDojZmZmO2NvbG9yOiMyMjI7cGFkZGluZzoxNXB4fWJvZHl7bWFyZ2luOjclIGF1dG8gMDttYXgtd2lkdGg6MzkwcHg7bWluLWhlaWdodDoxODBweDtwYWRkaW5nOjMwcHggMCAxNXB4fSogPiBib2R5e2JhY2tncm91bmQ6dXJsKC8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2Vycm9ycy9yb2JvdC5wbmcpIDEwMCUgNXB4IG5vLXJlcGVhdDtwYWRkaW5nLXJpZ2h0OjIwNXB4fXB7bWFyZ2luOjExcHggMCAyMnB4O292ZXJmbG93OmhpZGRlbn1pbnN7Y29sb3I6Izc3Nzt0ZXh0LWRlY29yYXRpb246bm9uZX1hIGltZ3tib3JkZXI6MH1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjc3MnB4KXtib2R5e2JhY2tncm91bmQ6bm9uZTttYXJnaW4tdG9wOjA7bWF4LXdpZHRoOm5vbmU7cGFkZGluZy1yaWdodDowfX0jbG9nb3tiYWNrZ3JvdW5kOnVybCgvL3d3dy5nb29nbGUuY29tL2ltYWdlcy9icmFuZGluZy9nb29nbGVsb2dvLzF4L2dvb2dsZWxvZ29fY29sb3JfMTUweDU0ZHAucG5nKSBuby1yZXBlYXQ7bWFyZ2luLWxlZnQ6LTVweH1AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4tcmVzb2x1dGlvbjoxOTJkcGkpeyNsb2dve2JhY2tncm91bmQ6dXJsKC8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2JyYW5kaW5nL2dvb2dsZWxvZ28vMngvZ29vZ2xlbG9nb19jb2xvcl8xNTB4NTRkcC5wbmcpIG5vLXJlcGVhdCAwJSAwJS8xMDAlIDEwMCU7LW1vei1ib3JkZXItaW1hZ2U6dXJsKC8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2JyYW5kaW5nL2dvb2dsZWxvZ28vMngvZ29vZ2xlbG9nb19jb2xvcl8xNTB4NTRkcC5wbmcpIDB9fUBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzoyKXsjbG9nb3tiYWNrZ3JvdW5kOnVybCgvL3d3dy5nb29nbGUuY29tL2ltYWdlcy9icmFuZGluZy9nb29nbGVsb2dvLzJ4L2dvb2dsZWxvZ29fY29sb3JfMTUweDU0ZHAucG5nKSBuby1yZXBlYXQ7LXdlYmtpdC1iYWNrZ3JvdW5kLXNpemU6MTAwJSAxMDAlfX0jbG9nb3tkaXNwbGF5OmlubGluZS1ibG9jaztoZWlnaHQ6NTRweDt3aWR0aDoxNTBweH0KICA8L3N0eWxlPgogIDxhIGhyZWY9Ly93d3cuZ29vZ2xlLmNvbS8+PHNwYW4gaWQ9bG9nbyBhcmlhLWxhYmVsPUdvb2dsZT48L3NwYW4+PC9hPgogIDxwPjxiPjQwNC48L2I+IDxpbnM+VGhhdOKAmXMgYW4gZXJyb3IuPC9pbnM+CiAgPHA+VGhlIHJlcXVlc3RlZCBVUkwgPGNvZGU+L3Mvbm90b3NhbnMvdjM2L28tMElJcFFseDNRVWxDNUE0UE5iNVEudHRmPC9jb2RlPiB3YXMgbm90IGZvdW5kIG9uIHRoaXMgc2VydmVyLiAgPGlucz5UaGF04oCZcyBhbGwgd2Uga25vdy48L2lucz4K";
    let ReportHeader_Y;
let PageHeader_Y;
let Line_Y;
let Footer_Y;
let Total=0;
let Quantity=0;
let Sgst=0;
let cgst=0;
let Igst=0;
let _LineTotal=0;
        return genericentryform.extend("modconfcontroller.InspectionLotRemovefunctionaloity", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
                debugger;
            },
            onBeforeShow: async function (oEvent) {
                this.isValidUser();
                await  this.FillListView();
                debugger;
                this.initialize();

            },
            initialize: async function () {
                debugger;
                   
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
            },

            FillListView: async function (Serial) {
                debugger;
                            // 2️⃣ Clear previous User data before fetching new one
                            if (this.getView().getModel("List")) {
                                this.getView().getModel("List").setData({ value: [] });
                            }

                           
                            await this.createNewModelUsingAPI(
                                "GET",
                                `/odata/v4/record-result-sap/RecordResultSAPHead?$filter=Status eq 'Draft'&$orderby=PostDate desc`,
                                
                                "",
                                "DeviceList" // keep model name same as your table binding
                            );
                       

                            // 4️⃣ Get model reference and refresh the UI
                            const oGMCModel = this.getView().getModel("DeviceList");
                            oGMCModel.refresh(true);

			},
            onSearchWithName: function (oEvent) {
                    debugger;
			var sQuery = oEvent.getParameter("newValue"); // Get search input
			var filters=[];
			if(sQuery)
			{
				var filter1 = new sap.ui.model.Filter({path:"InspectionLot",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
				filters=[filter1];
				var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
		}
		var otable = this.byId("_DebitTbl1");
		otable.getBinding("items").filter(finalFilter);
    },

            Go: function (oEvent) {
                debugger;
                 const viewModel = this.getView().getModel(this.getEntryFormDataSourceModelName())
			   let Serial= viewModel.getProperty("/SerialBatchNumber");
                 this.FillListView(Serial);
                   
		},
		
        navBack: function() {
            debugger;
		//	var BPText = this.getView().byId('sideNavigation');
		//	BPText.setVisible(true);
		history.go(-1);
			
			//var router = sap.ui.core.UIComponent.getRouterFor(this);
           // router.navTo("RouteIndex");
		},

        OnDelete: function (oEvent) {
 // var oTable = this.byId("_DebitTbl1");
 var oButton = oEvent.getSource();
					var oBindingContext = oButton.getBindingContext("DeviceList");
					let oRowObject = oBindingContext.getProperty("ID");

   

    // Replace with your actual API endpoint
    var sUrl = `/odata/v4/record-result-sap/RecordResultSAPHead('${oRowObject}')` ;

    fetch(sUrl, {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    })
    .then(function (oResponse) {
        if (!oResponse.ok) {
            throw new Error("HTTP error: " + oResponse.status);
        }

        sap.m.MessageToast.show("Entry deleted successfully");
        history.go(-1);
    })
    .catch(function (oError) {
        sap.m.MessageBox.error("Failed to delete entry: " + oError.message);
        console.error(oError);
    });
}
		
     
     
 });
});
