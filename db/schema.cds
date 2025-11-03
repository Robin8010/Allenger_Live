using {
    cuid,
    managed
} from '@sap/cds/common';

namespace allengersBTP;

entity UserMaster : cuid {
    UserName : String;
    Password : String;
    IsAdmin  : Boolean;
}

entity RecordResultHead : cuid {
    InspectionLot    : String;
    Material         : String;
    Plant            : String;
    ManagedBy        : String;
    SerialNumber     : String;
    PostDate         : Date;
    EOI              : String;
    Quantity         : Decimal;
    AcceptedQuantity : Decimal;
    RejectedQuantity : Decimal;
    Status           : String;
    ParameterDetails : Composition of many RecordResultDetail
                           on ParameterDetails.RecordResultHead = $self
}

entity RecordResultDetail : cuid {
    ParameterCode    : String;
    ParameterName    : String;
    Attribute        : String;
    Observation      : String;
    InstrumentId     : String;
    InstrumentDesc   : String;
    Status           : String;
    Remarks1         : String;
    Remarks2         : String;
    RecordResultHead : Association to RecordResultHead;
}

entity RecordResultSAPHead : cuid {
    InspectionLot               : String;
    Material                    : String;
    Plant                       : String;
    ManagedBy                   : String;
    PostDate                    : Date;
    EOI                         : String;
    Quantity                    : Decimal;
    AcceptedQuantity            : Decimal;
    RejectedQuantity            : Decimal;
    Status                      : String;
    UsageDecisionLevel          : String;
    QuantityScore               : Decimal;
    DecisionCatalog             : Int64;
    UsageDecisionSelectedSet    : String;
    UsageDecisionCodeGroup      : String;
    UsageDecisionCode           : String;
    UsageDecisionValuation      : String;
    UsageDecisionFollowupAction : String;
    SerialBatchDetails          : Composition of many RecordResultSerialBatchDetail
                                      on SerialBatchDetails.RecordResultSAPHead = $self
}

entity RecordResultSerialBatchDetail : cuid {
    SerialBatchNumber      : String;
    Quantity               : Decimal;
    Status                 : String;
    UsageDecisionStockType : String;
    StorageLocation        : String;
    InspectionPlanStatus   : String;
    RecordResultSAPHead    : Association to RecordResultSAPHead;
    ParametersDetails      : Composition of many RecordResultParametersDetail
                                 on ParametersDetails.RecordResultSerialBatchDetail = $self
}

entity RecordResultParametersDetail : cuid {
    ParameterCode                 : String;
    ParameterName                 : String;
    ParentParameterCode           : String;
    ParentParameterName           : String;
    AttributeID                   : String;
    Attribute                     : String;
    Observation                   : String;
    InstrumentId                  : String;
    InstrumentDesc                : String;
    Status                        : String;
    Remarks1                      : String;
    Remarks2                      : String;
    RecordResultSerialBatchDetail : Association to RecordResultSerialBatchDetail;
}

entity InventoryTransferSAPHead : cuid {
    RecordResultID     : String;
    InspectionLot      : String;
    Material           : String;
    Plant              : String;
    ManagedBy          : String;
    PostDate           : Date;
    EOI                : String;
    Quantity           : Decimal;
    // AcceptedQuantity   : Decimal;
    // // AcceptedPlant      : String;
    // RejectedQuantity   : Decimal;
    // // RejectedPlant      : String;
    Status             : String;
    SerialBatchDetails : Composition of many InventoryTransferSerialBatchDetail
                             on SerialBatchDetails.InventoryTransferSAPHead = $self
}

entity InventoryTransferSerialBatchDetail : cuid {
    SerialBatchNumberID      : String;
    SerialBatchNumber        : String;
    Quantity                 : Decimal;
    Status                   : String;
    UsageDecisionStockType   : String;
    StorageLocation          : String;
    InventoryTransferSAPHead : Association to InventoryTransferSAPHead;
}