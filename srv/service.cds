using {allengersBTP as allengersDatabase} from '../db/schema';

service UserMasterService {
    entity userMaster as projection on allengersDatabase.UserMaster;
}

service RecordResultService {
    entity RecordResultHead   as projection on allengersDatabase.RecordResultHead;
    entity RecordResultDetail as projection on allengersDatabase.RecordResultDetail;
}

service RecordResultSAPService {
    entity RecordResultSAPHead           as projection on allengersDatabase.RecordResultSAPHead;
    entity RecordResultSerialBatchDetail as projection on allengersDatabase.RecordResultSerialBatchDetail;
    entity RecordResultParametersDetail  as projection on allengersDatabase.RecordResultParametersDetail;
    entity RecordResultDecisionHead      as projection on allengersDatabase.RecordResultDecisionHead;
    entity RecordResultDecisionDetail    as projection on allengersDatabase.RecordResultDecisionDetail;
}

service InventoryTransferSAPService {
    entity InventoryTransferSAPHead           as projection on allengersDatabase.InventoryTransferSAPHead;
    entity InventoryTransferSerialBatchDetail as projection on allengersDatabase.InventoryTransferSerialBatchDetail;
}
