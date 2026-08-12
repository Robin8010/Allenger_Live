this.after(['CREATE', 'UPDATE', 'DELETE'], 'RecordResultSerialBatchDetail', async (data, req) => {

    const records = Array.isArray(data) ? data : [data];

    for (const row of records) {

        const parentId = row.RecordResultSAPHead_ID;

        if (parentId) {
            await UPDATE('RecordResultSAPHead')
                .set({ modifiedAt: new Date() })
                .where({ ID: parentId });
        }
    }
});

/*
module.exports = cds.service.impl(async function () {

    this.after("READ", "InspectionQcReport2", (data) => {

    if (!Array.isArray(data)) {
        data = [data];
    }

    let parentMap = {};
    let parentCounter = 0;

    data.forEach(row => {

        const parent = row.ParentParameterName;

        if (!parentMap[parent]) {

            parentCounter++;

            parentMap[parent] = {
                pNo: parentCounter,
                cNo: 0
            };

            // 👉 PARENT ROW
            row.Seq = `${parentCounter}`;
            row.Description = parent;
        }

        // 👉 CHILD COUNTER
        parentMap[parent].cNo++;

        const cNo = parentMap[parent].cNo;

        // 👉 if same parent row, keep parent format
        if (row.ParameterName !== parent) {

            row.Seq = `${parentMap[parent].pNo}.${cNo}`;
            row.Description = row.ParameterName;
        }

        // OPTIONAL: if you want parent first row blank detail columns
        if (row.lineid === 1) {
            row.Description = parent;
        }
    });
});
});
*/