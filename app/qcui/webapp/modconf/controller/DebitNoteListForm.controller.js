sap.ui.define([
	  "core/generic/genericentryform",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], 
 function (genericentryform, MessageToast, MessageBox, Controller) {
	"use strict";
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
        return genericentryform.extend("modconfcontroller.DebitNoteListForm", {

            onInit: function () {
                genericentryform.prototype.onInit.apply(this, arguments);
                debugger;
            },
            onBeforeShow: async function (oEvent) {
                //this.validateAccess();
                await  this.FillListView();
                debugger;
                this.initialize();

            },
            initialize: async function () {
                debugger;
            },
            FillListView: async function () {
                debugger;
                            // 2️⃣ Clear previous User data before fetching new one
                            if (this.getView().getModel("Debit")) {
                                this.getView().getModel("Debit").setData({ value: [] });
                            }

                            // 3️⃣ Fetch fresh data from backend
                            await this.createNewModelUsingAPI(
                                "GET",
                                `/sap/opu/odata4/sap/zune_sb_supplierinv_head/srvd_a2x/sap/zune_sd_supplierinv_head/0001/Zune_CDS_SupplierInv_Header?$top=200000`,
                                
                                "",
                                "Debit" // keep model name same as your table binding
                            );

                            // 4️⃣ Get model reference and refresh the UI
                            const oGMCModel = this.getView().getModel("Debit");
                            oGMCModel.refresh(true);

			},
            onSearchWithName: function (oEvent) {
                    debugger;
			var sQuery = oEvent.getParameter("newValue"); // Get search input
			var filters=[];
			if(sQuery)
			{
				var filter1 = new sap.ui.model.Filter({path:"SupplierInvoice",operator:sap.ui.model.FilterOperator.Contains,value1:sQuery});
				filters=[filter1];
				var finalFilter = new sap.ui.model.Filter({filters:filters, and:false});
		}
		var otable = this.byId("_DebitTbl");
		otable.getBinding("items").filter(finalFilter);
    },

            onEditPress: function (oEvent) {
                debugger;
           
					var oButton = oEvent.getSource();
					var oBindingContext = oButton.getBindingContext("Debit");
					let oRowObject = oBindingContext.getProperty("ID");

					this.setRouteData("2",oRowObject);
					var router = sap.ui.core.UIComponent.getRouterFor(this);
                     router.navTo("RouterNameUserMasterEntryForm");
                     
				
           
		},
		Addnew: function (oEvent) {
debugger;
              var ID="10";
            this.setRouteData("3", ID);
			var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("RouterNameUserMasterEntryForm");

			var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("RouterNameUserMasterEntryForm");
		},
        navBack: function() {
            debugger;
		//	var BPText = this.getView().byId('sideNavigation');
		//	BPText.setVisible(true);
		history.go(-1);
			
			//var router = sap.ui.core.UIComponent.getRouterFor(this);
           // router.navTo("RouteIndex");
		},
		
           
            onClosecflForStage: function () {
                let x = this.getCflObject();
            },
      /* ============================================================================
   DEBIT NOTE CUM DELIVERY CHALLAN — jsPDF print methods
   Built to match the existing OnPrint / ReportHeader / PageHeader / LineSection
   pattern already used in the controller for the Gate Pass print, so you can
   drop these in as sibling methods on the same controller.

   Layout source : "Format" sheet (Final_-_Debit_Note_Format_for_SAP.xlsx)
   Field mapping : "Mapping" sheet (same workbook)

   NOTE ON FIELD NAMES: line-item tax fields (CgstRate/CGSTAmount/SgstRate/
   SGSTAmount/IgstRate/IgstAmount, HSNCode, ItemCode) reuse the exact casing
   already used in your Zune_CDS_2_SI_Union based OnPrint, so this can bind to
   the same/sibling CDS view. Header-level fields (ReceiverName, ConsigneeGSTIN,
   etc.) are named to match the "Mapping" sheet columns 1:1 — rename in the
   getters below if your CDS view exposes different field names; every place
   a field is read is isolated inside ReportHeader/PageHeader/LineSection so
   remapping is a single-line change per field.
   ============================================================================ */

       async OnPrint(oEvent) {
            const oButton = oEvent.getSource();
            const oBindingContext = oButton.getBindingContext("Debit");
            const SupplierInvoice = oBindingContext.getProperty("SupplierInvoice");

            await this.createNewModelUsingAPI(
                'GET',
                `/sap/opu/odata4/sap/zune_sb_si_union_all3/srvd_a2x/sap/zune_sd_si_union_all3/0001/Zune_CDS_2_SI_Union?$top=10000&$filter=SupplierInvoice eq '${SupplierInvoice}'`,
                '',
                'reportdata'
            );

            const reportData = this.getView().getModel('reportdata').getData();
            const { value = [] } = reportData || {};
            if (!value.length) {
                sap.m.MessageToast.show("No line items found for this document.");
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });

            const headerY = this.DebitNoteReportHeader(doc, value);
            this.DebitNotePageBorder(doc, 8);
            const lineStartY = this.DebitNotePageHeader(doc, value, headerY);
            const footerY = this.DebitNoteLineSection(doc, value, lineStartY);
            this.DebitNoteFooter(doc, value, footerY);

            doc.save("DebitNote.pdf");
        },

        // ===================================================================
        // OUTER PAGE FRAME — full-height left/right borders that close off
        // the header/table/footer horizontal lines into one continuous box.
        // Call once per page, right after DebitNoteReportHeader.
        // ===================================================================
        DebitNotePageBorder: function (doc, topY) {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const bottomY = pageHeight - 10;
            doc.line(5, topY, 5, bottomY);                          // left border
            doc.line(pageWidth - 5, topY, pageWidth - 5, bottomY);   // right border
        },

        // ===================================================================
        // COMPANY / TITLE / DEBIT NOTE + RECEIVER-CONSIGNEE BLOCK
        // (mirrors "Format" sheet rows 1-9)
        // ===================================================================
      DebitNoteReportHeader: function (doc, value) {

    const h = value[0] || {};
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 8;

    doc.setDrawColor(0);
    doc.line(5, y, pageWidth - 5, y);

    // ---- Company name / address ----
    doc.setFont("Arial", "bold");
    doc.setFontSize(11);
    let Image = "data:image/jpeg;base64,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C8E9iq8qTjc1rO28ysP1k6d78RjJwuKNHDNesluXUuUHPa9ji5in/nQhLv7sq/dit0WyLbATCtWgRKSVRW29OX+oX9Emdl1qW0sBXuLD/fiUU2XeU/0Su2n819iZggvlrSIwIYR2hNENRaZ6+YdgwKPVs/cwrPaFKv33n8DxLYQQnCh7x7SAMONmEswDZo2iTqoNcr9/iVryZqdoFD8sNuM5LGbXdhxF5tzX/ZVJ8tV6S7tPqD2hlyKAZZlQFdtY+IbN3O8ceke468kc6t/TCAbuDiVbXkX4aRMqBQwoKMVKR5ayK1ftEWRhZo8BNxkaD1EHu5BJ82wkFzc33esz2nVDIVGw8u4s5yTLbDzNb408RZ9MH6e8ppgQ2u3uCyqt8gA9iJ266bf64gFN2fnMtOUwTAT8wedIQBnmKcvpmlcjLYk4Z/QLDLn+e1Q5cjL23yFV2MyZQ1B3z/ProEeOAPm/EtUqIJqg7+um+ywVy7F4D6qi5Y1LQHaoeYcQFs7qtGf8mWx0+s3wAsZ2WG9q0cFteP4n66twA7swCpyxGqtotVrOJi8RupkM3eqRVxBb3LURKBvUc65shsWiOX5hLxDubDRr2SxgzQBPU3m3Ea6TRxsk1oVxe8oVRCEGPKXtcp5dwAovbhrO0yKx8AG3C3rrRCNjlDLelCV2dxKKNEa1wzOmaPWBzKvrJ0FtzKKjGai86g3lYZCPUHEBzUIZp2gJyFX6q43M4FwDu4Odtok8l4C2worWdZdeiztcBqM/5K5XsMG38pciDIu2pjbqcb4Csvdu8xmFmw0DZj0i6L3Q2X2IymzJCGyzl03ntTG57F5iHtAYNj1m4TVl6Gl96yttBM01bNTJwWukzPtxze/G1e5bfgpSi2hW17TTjN9K9MNupn0BHeNP6JZdCCvA1OmIveUsdPScTZS0141D7zsRwVtDIUKoDYP9k//aAAwDAQACAAMAAAAQ88888888888888888888888888888888888888888888888888888nXx6786+645ypnCLNzVAEOhLw/uceOvoFc89d8888R44F891x5888sMMcssMsM8M8888888888888888888888888888888888888888888888888888//EACIRAQEAAgICAwADAQAAAAAAAAERACExQVFhcYGRUKGxYP/aAAgBAwEB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";
   doc.addImage(Image, "PNG", 10, 9, 40, 20);
    doc.text(`${h.CompanyName || ""}`, pageWidth / 2, y + 5, { align: "center" });

    doc.setFont("Arial", "normal");
    doc.setFontSize(7);
    const addrLines = doc.splitTextToSize(`${h.BusinessPlaceAddress || ""}`, 180);
    doc.text(addrLines, pageWidth / 2, y + 10, { align: "center" });
    doc.text("GSTIN No - " + `${h.BusinessPlace_GSTIN || ""}` + "  Pan - AABCA2332H", pageWidth / 2, y + 13, { align: "center" });

    y += 10 + addrLines.length * 3.2;

    // ---- Document title ----
    doc.setFont("Arial", "bold");
    doc.setFontSize(11);
    doc.text("DEBIT NOTE CUM DELIVERY CHALLAN", pageWidth / 2, y + 4, { align: "center" });
    y += 8;

    doc.line(5, y, pageWidth - 5, y);

    // ---- Debit Note No / Date / State / Code  (left column) ----
    const leftLabels = [
        ["Debit Note No. :", h.SupplierInvoice],
        ["Date  :", h.DocumentDate],
        ["State :", h.BusinessPlaceState],
        ["Code :", h.BusinessPlaceStateCode]
    ];
    doc.setFontSize(8);
    leftLabels.forEach((row, i) => {
        doc.setFont("Arial", "bold");
        doc.text(row[0], 6, y + 4 + i * 4);
        doc.setFont("Arial", "normal");
        doc.text(`${row[1] ?? ""}`, 32, y + 4 + i * 4);
    });

    // ---- Receiver / Consignee headers ----
    const recX = 90;
    const conX = 195;

    // Build address once, wrap only if longer than 60 chars
    const addressText = `${h.StreetPrefixName1 || ""} ${h.Addressline3 || ""} ${h.Addressline6 || ""}`.trim();
    const addressLinesRec = addressText.length > 60 ? doc.splitTextToSize(addressText, conX - recX - 16) : [addressText];
    const addressLinesCon = addressText.length > 60 ? doc.splitTextToSize(addressText, pageWidth - conX - 16) : [addressText];
    const addrExtraLines = Math.max(addressLinesRec.length, addressLinesCon.length) - 1;

    const boxHeight = 22 + addrExtraLines * 3.5;

    doc.line(recX - 2, y, recX - 2, y + boxHeight);
    doc.line(conX - 2, y, conX - 2, y + boxHeight);

    doc.setFont("Arial", "bold");
    doc.setFontSize(8);
    doc.text("Detail of Receiver | Billed to :", recX, y + 4);
    doc.text("Detail of Consignee | Shipped to:", conX, y + 4);

    const partyRows = [
        ["Name:", h.OrganizationName2, h.OrganizationName2],
        ["Address:", addressLinesRec, addressLinesCon],
        ["GSTIN:", h.Supplier_GSTIN, h.Supplier_GSTIN],
        ["State:", h.State, h.State]
    ];

    doc.setFont("Arial", "normal");
    doc.setFontSize(7);

    let rowY = y + 8;
    partyRows.forEach((row) => {
        const isAddress = row[0] === "Address:";
        doc.setFont("Arial", "bold");
        doc.text(row[0], recX, rowY);
        doc.text(row[0], conX, rowY);
        doc.setFont("Arial", "normal");
        doc.text(row[1], recX + 14, rowY);
        doc.text(row[2], conX + 14, rowY);

        rowY += isAddress ? addrExtraLines * 3.5 + 3.5 : 3.5;
    });

    doc.text(`Code: ${h.StateCode ?? ""}`, recX + 45, rowY - 3.5);
    doc.text(`Code: ${h.StateCode ?? ""}`, conX + 45, rowY - 3.5);

    y += boxHeight;
    doc.line(5, y, pageWidth - 5, y);

    return y;
},

        // ===================================================================
        // TABLE HEADER  (mirrors "Format" sheet row 11 — 23 columns)
        // Widths rescaled so the grid fills the full frame: x=5 through x=292
        // (287mm usable width on landscape A4), matching DebitNotePageBorder.
        // Returns the Y at which the first data row should start.
        // ===================================================================
        // Column layout: [label, x-start, width]
        _debitNoteCols: [
            ["Sr\nNo.", 5, 8.6],
            ["Bill No.", 13.6, 19.35],
            ["Bill\nDate", 32.95, 13.97],
            ["PO No.", 46.92, 15.05],
            ["PO\nItem", 61.97, 16.12],
            ["Material Description", 78.09, 32.25],
            ["HSN/\nSAC", 110.34, 11.82],
            ["UOM", 122.16, 8.6],
            ["Billed\nQty", 130.76, 10.75],
            ["Rec.\nQty", 141.51, 10.75],
            ["Short\nQty", 152.26, 10.75],
            ["Rej.\nQty", 163.01, 10.75],
            ["PO\nRate", 173.76, 10.75],
            ["Bill\nRate", 184.51, 10.75],
            ["Rate\nDiff.", 195.26, 10.75],
            ["Taxable\nAmount", 206.01, 13.97],
            ["CGST\nRate", 219.98, 8.6],
            ["CGST\nAmt", 228.58, 10.75],
            ["SGST\nRate", 239.33, 8.6],
            ["SGST\nAmt", 247.93, 10.75],
            ["IGST\nRate", 258.68, 8.6],
            ["IGST\nAmt", 267.28, 10.75],
            ["Line\nTotal", 278.03, 13.97]
        ],

        DebitNotePageHeader: function (doc, value, startY) {

            const pageWidth = doc.internal.pageSize.getWidth();
            let Py = startY;

            doc.setFont("Arial", "bold");
            doc.setFontSize(6.5);

            const cols = this._debitNoteCols;
            const headerH = 9;

            cols.forEach((col) => {
                const x = col[1];
                doc.line(x, Py, x, Py + headerH);
                const lines = col[0].split("\n");
                lines.forEach((ln, li) => doc.text(ln, x + 1, Py + 3 + li * 3));
            });
            // right border of last column
            const lastCol = cols[cols.length - 1];
            doc.line(lastCol[1] + lastCol[2], Py, lastCol[1] + lastCol[2], Py + headerH);

            doc.line(5, Py, pageWidth - 5, Py);
            Py += headerH;
            doc.line(5, Py, pageWidth - 5, Py);

            return Py + 3;
        },

        // ===================================================================
        // LINE ITEMS  (auto page-break, redraws header + table header + page
        // border on each new page)
        // ===================================================================
        DebitNoteLineSection: function (doc, value, startY) {

            let LineY = startY;
            const pageHeight = doc.internal.pageSize.getHeight();
            const bottomMargin = 55;      // room reserved for the totals footer
            const textLineHeight = 3;
            const minRowHeight = 4;
            const cols = this._debitNoteCols;
            const descColIndex = 5; // "Material Description"

            doc.setFont("Arial", "normal");
            doc.setFontSize(6.5);

            for (let i = 0; i < value.length; i++) {

                const descText = `${value[i].ItemCode || ""} / ${value[i].Item_Product_Desc || ""}`;
                const descLines = doc.splitTextToSize(descText, cols[descColIndex][2] - 2);
                const rowHeight = Math.max(descLines.length * textLineHeight, minRowHeight);

                if (LineY + rowHeight > pageHeight - bottomMargin) {
                    doc.addPage();
                    const rY = this.DebitNoteReportHeader(doc, value);
                    this.DebitNotePageBorder(doc, 8);
                    LineY = this.DebitNotePageHeader(doc, value, rY);
                    doc.setFont("Arial", "normal");
                    doc.setFontSize(6.5);
                }

                const LineAmount = Number(value[i].Quantity || 0) * Number(value[i].C_UnitPrice || 0);
                const TotalTax = Number(value[i].CGSTAmount || 0)
                    + Number(value[i].SGSTAmount || 0)
                    + Number(value[i].IgstAmount || 0);
                const LineTotal = LineAmount + TotalTax;

                const rowStartY = LineY;
                const rowVals = [
                    i + 1,
                    value[i].SupplierInvoiceIDByInvcgParty,
                    value[i].DocumentDate,
                    value[i].PurchaseOrder,
                    value[i].PurchaseOrderItem,
                    null, // description handled separately (wraps)
                    value[i].HSNCode,
                    value[i].UOM,
                    Number(value[i].Quantity || 0).toFixed(2),
                    Number(value[i].GrQty || 0).toFixed(2),
                    Number(value[i].ShortQty || 0).toFixed(2),
                    Number(value[i].RejQty || 0).toFixed(2),
                    Number(value[i].C_UnitPrice || 0).toFixed(2),
                    Number(value[i].BillRate || 0).toFixed(2),
                    Number(value[i].RateDiff || 0).toFixed(2),
                    //TotalTax.toFixed(2),
                    value[i].Total.toFixed(2),
                    Number(value[i].CgstRate || 0).toFixed(2),
                    Number(value[i].CGSTAmount || 0).toFixed(2),
                    Number(value[i].SgstRate || 0).toFixed(2),
                    Number(value[i].SGSTAmount || 0).toFixed(2),
                    Number(value[i].IgstRate || 0).toFixed(2),
                    Number(value[i].IgstAmount || 0).toFixed(2)
                    // last column (Line Total) is drawn directly from LineTotal below — no entry needed here
                ];

                cols.forEach((col, ci) => {
                    const x = col[1];
                    doc.line(x, rowStartY - 3, x, rowStartY + rowHeight + 1);

                    if (ci === descColIndex) {
                        descLines.forEach((ln, li) => doc.text(ln, x + 1, rowStartY + li * textLineHeight));
                    } else if (ci === cols.length - 1) {
                        doc.text(Number(LineTotal || 0).toFixed(2), x + col[2] - 1, rowStartY, { align: "right" });
                    } else if (ci === 0 || ci === 1 || ci === 2 || ci === 3 || ci === 4 || ci === 6 || ci === 7) {
                        // left-aligned text columns
                        doc.text(`${rowVals[ci] ?? ""}`, x + 1, rowStartY);
                    } else {
                        // right-aligned numeric columns
                        doc.text(`${rowVals[ci] ?? ""}`, x + col[2] - 1, rowStartY, { align: "right" });
                    }
                });
                const lastCol = cols[cols.length - 1];
                doc.line(lastCol[1] + lastCol[2], rowStartY - 3, lastCol[1] + lastCol[2], rowStartY + rowHeight + 1);

                doc.line(5, rowStartY + rowHeight + 1, doc.internal.pageSize.getWidth() - 5, rowStartY + rowHeight + 1);

                LineY += rowHeight + 4;
            }

            return LineY;
        },

        // ===================================================================
        // FOOTER — Remarks + Totals + Amount in words + Signatory + Addresses
        // (mirrors "Format" sheet rows 16-30)
        // ===================================================================
        DebitNoteFooter: function (doc, value, startY) {

            const h = value[0] || {};
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // ---- Aggregate totals across all line items ----
            let TotalBeforeTax = 0, TotalCGST = 0, TotalSGST = 0, TotalIGST = 0;
            value.forEach(row => {
                TotalBeforeTax += Number(row.Quantity || 0) * Number(row.C_UnitPrice || 0);
                TotalCGST += Number(row.CGSTAmount || 0);
                TotalSGST += Number(row.SGSTAmount || 0);
                TotalIGST += Number(row.IgstAmount || 0);
            });
          

            // If not enough room left on this page for the footer block, start a new page
            const footerBlockHeight = 45;
            let Fy = startY;
            if (Fy + footerBlockHeight > pageHeight - 15) {
                doc.addPage();
                const rY = this.DebitNoteReportHeader(doc, value);
                this.DebitNotePageBorder(doc, 8);
                this.DebitNotePageHeader(doc, value, rY);
                Fy = rY + 12;
            }

            doc.setFont("Arial", "normal");
            doc.setFontSize(7);

            // ---- Remarks (left) ----
            doc.setFont("Arial", "bold");
            doc.text("Remarks:-", 6, Fy + 5);
            doc.setFont("Arial", "normal");
            const remarkLines = doc.splitTextToSize("DEBIT NOTE AGAINST BILL NO. "+`${value[0].SupplierInvoiceIDByInvcgParty}`+" Date "+`${value[0].DocumentDate}`+" DUE TO RATE DIFFERENCE/SHORTAGE/REJECTION", 150);
            doc.text(remarkLines, 6, Fy + 9);

            // ---- Totals block (right) ----
              const TotalAfterTax = TotalBeforeTax+h.PackingCharges+ h.Freight+ h.OtherCharges+h.CGSTTotal + h.SGSTTotal + h.IgstTotal;
            const totLabels = [
                ["Total Amount before Tax", TotalBeforeTax],
                ["Packing Charges", h.PackingCharges],
                ["Freight Charges", h.Freight],
                ["Misc. Charges", h.MiscCharges],
                ["Other Charges", h.OtherCharges],
                ["Add: CGST", h.CGSTTotal],
                ["Add: SGST/UTGST", h.SGSTTotal],
                ["Add: IGST", h.IgstTotal],
                ["Total Amount after Tax:", TotalAfterTax]
            ];
            const totX = 195;
            doc.line(totX - 3, Fy, pageWidth - 5, Fy);
            totLabels.forEach((row, i) => {
                const isLast = i === totLabels.length - 1;
                doc.setFont("Arial", isLast ? "bold" : "normal");
                doc.text(row[0], totX, Fy + 5 + i * 4);
                doc.text(Number(row[1] || 0).toFixed(2), pageWidth - 8, Fy + 5 + i * 4, { align: "right" });
            });
            const totBottom = Fy + 5 + totLabels.length * 4;
            doc.line(totX - 3, totBottom, pageWidth - 5, totBottom);

            let y2 = Math.max(Fy + 9 + remarkLines.length * 3, totBottom) + 6;

            // ---- Amount in words ----
            doc.setFont("Arial", "bold");
            doc.setFontSize(7.5);
            const amountWords = this.getAmountSummary(TotalAfterTax) + " Only";
             doc.setFont("Arial", "normal");
            doc.text(`Total amount in words:- ${amountWords}`, 6, y2-2);

            // ---- Signatory ----
            doc.setFont("Arial", "normal");
            doc.text(`For ${h.CompanyName || "Allengers Medical Systems Limited"}`, pageWidth - 60, y2);
            doc.text("Authorized Signatory", pageWidth - 60, y2 + 10);

            y2 += 15;
            doc.line(5, y2, pageWidth - 5, y2);

            // ---- Registered / Corporate office ----
            doc.setFontSize(6);
            doc.text("Regd. Office: UNIT NO. 205, 2ND FLOOR, ANSALS CLASSIQUETOWER, J- BLOCK, COMMUNITY CENTRE, RAJOURI GARDEN, City: DELHI-110027, Phone: 01125166712,32536567, (CIN No. U33111DL1992PLC154688)", 45,pageHeight-20);
            doc.text("Corporate Office: SCO NO. 212-213-214, SEC 34 A, City: CHANDIGARH-160022, Phone: 0172-6618000-99", 75, pageHeight-17);
            doc.line(5, pageHeight-10, pageWidth - 5,  pageHeight-10);
            return y2 + 10;
        },
         getAmountSummary: function (iNum) {

    if (iNum === null || iNum === undefined || isNaN(iNum)) {
        return "";
    }

    const amount = Number(iNum);

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    const aOnes = [
        "", "One", "Two", "Three", "Four", "Five",
        "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen",
        "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];

    const aTens = [
        "", "", "Twenty", "Thirty", "Forty",
        "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    const fnConvert = function (num) {
        if (num < 20) return aOnes[num];

        if (num < 100) {
            return aTens[Math.floor(num / 10)] +
                (num % 10 ? " " + aOnes[num % 10] : "");
        }

        if (num < 1000) {
            return aOnes[Math.floor(num / 100)] + " Hundred" +
                (num % 100 ? " " + fnConvert(num % 100) : "");
        }

        if (num < 100000) {
            return fnConvert(Math.floor(num / 1000)) + " Thousand" +
                (num % 1000 ? " " + fnConvert(num % 1000) : "");
        }

        if (num < 10000000) {
            return fnConvert(Math.floor(num / 100000)) + " Lakh" +
                (num % 100000 ? " " + fnConvert(num % 100000) : "");
        }

        return fnConvert(Math.floor(num / 10000000)) + " Crore" +
            (num % 10000000 ? " " + fnConvert(num % 10000000) : "");
    };

    let result = "";

    if (rupees > 0) {
        result += fnConvert(rupees) + " Rupees";
    } else {
        result += "Zero Rupees";
    }

    if (paise > 0) {
        result += " and " + fnConvert(paise) + " Paise";
    }

   // result += " Only";

    return result;
}




        });
    });
