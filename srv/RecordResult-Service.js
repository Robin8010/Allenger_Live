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