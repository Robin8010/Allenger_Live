sap.ui.define([
    "core/generic/genericlistview"
],

    function (genericlistview) {
        "use strict";

        return genericlistview.extend("modconfcontroller.usermasterlistview", {

            onInit: function () {
                genericlistview.prototype.onInit.apply(this, arguments);

            },
            onBeforeShow: function (oEvent) {
                //this.validateAccess();
                this.initialize();

            },
            initialize: async function () {
                this.setPageId("userlv");
                this.setFormTitle("User Master View");
                this.setBackwardRoute("LandingPageIndex");

                this.setListViewDataSourceProperties("GET", "/odata/v4/user-master/userMaster", "", "value");
                this.setListViewDisplayColumns(["User Code", "Admin", "action"]);
                this.setListViewDataColumns(["UserName", "IsAdmin", "Edit"]);

                this.setFormSubTitle("User List");
                this.setListViewFilterColumn("stglvUserCode", "User Code", "Cfl", "eq", "String", "UserName", "cflForUserCode");
                this.setListViewEditProperty("ID");
                this.setForwardRoute("RouterNameUserMasterEntryForm");
                //this.setBackwardRoute("RouteIndex");
                await this.showListView(this.getPageId());
            },
            cflForUserCode: async function () {
                this.setCflTitle('Stage Code List');
                await this.createNewModelUsingAPI("GET", "/odata/v4/user-master/userMaster", "", this.getCflListViewDataSourceModelName());
                this.setCflDisplayColumns(["User Code"]);
                this.setCflDataColumns(["UserName"]);
                this.setCflValueAndDisplay("", "", "stglvUserCode", "UserName");
                this.showCfl("stglvUserCode", this.getCflListViewDataSourceModelName(), "value", this.onClosecflForStage.bind(this));
            },
            onClosecflForStage: function () {
                let x = this.getCflObject();
            }
        });
    });
