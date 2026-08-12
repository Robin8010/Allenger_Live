using {allengersBTP as allengersDatabase} from '../db/schema';

service UserMasterService {
    entity userMaster as projection on allengersDatabase.UserMaster;
}

service RecordResultService {
    entity RecordResultHead   as projection on allengersDatabase.RecordResultHead;
    entity RecordResultDetail as projection on allengersDatabase.RecordResultDetail;
}

service RecordResultDeviceTaggingServices{
    entity RecordResultDeviceTagging as projection on allengersDatabase.RecordResultDeviceTagging;
}
service RecordResultSAPService {
    entity RecordResultSAPHead           as projection on allengersDatabase.RecordResultSAPHead;
    entity RecordResultSerialBatchDetail as projection on allengersDatabase.RecordResultSerialBatchDetail;
    entity RecordResultParametersDetail  as projection on allengersDatabase.RecordResultParametersDetail;
    entity RecordResultDecisionHead      as projection on allengersDatabase.RecordResultDecisionHead;
    entity RecordResultDecisionDetail    as projection on allengersDatabase.RecordResultDecisionDetail;
    entity RecordResultDeviceTagging     as projection on allengersDatabase.RecordResultDeviceTagging;
}

service InventoryTransferSAPService {
    entity InventoryTransferSAPHead           as projection on allengersDatabase.InventoryTransferSAPHead;
    entity InventoryTransferSerialBatchDetail as projection on allengersDatabase.InventoryTransferSerialBatchDetail;
}

service DeviceGroupListService {
    entity DeviceGroupList as projection on allengersDatabase.DeviceGroupList;
}
service ProductQualityClearanceService {
    entity ProductQualityClearance   as projection on allengersDatabase.ProductQualityClearance;
    entity  LineInfo as projection on allengersDatabase.LineInfo;
}

service DeviceGroupListReportServices{
    entity DeviceGroupListReport as projection on allengersDatabase.DeviceGroupListReport;
}

service InspectionQCreport{
    entity InspectionQcReport as projection on allengersDatabase.InspectionQcReport;
}
service InspectionQCreport2{
    entity InspectionQcReport2 as projection on allengersDatabase.InspectionQcReport2;
}
service FormStatusServices{
    entity FormStatus as projection on allengersDatabase.FormStatus;
}  
service dispatchService{
    entity DispatchQuality as projection on allengersDatabase.DispatchQuality;
    entity FactSheetLine as projection on allengersDatabase.FactSheetLine;
}
service GetElectrialUserServices{
    entity GetElectrialUser as projection on allengersDatabase.GetElectrialUser;
}