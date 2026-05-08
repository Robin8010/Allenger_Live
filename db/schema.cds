using {
    cuid,
    managed
} from '@sap/cds/common';

namespace allengersBTP;

entity UserMaster : cuid,managed {
    UserName           : String;
    NameDsc            :String;
    Password           : String;
    IsAdmin            : Boolean;
    IsMechnical        : Boolean;
    IsElectrial        : Boolean;
    ManageRecordResult : Boolean;
    ManageUserDecision : Boolean;
}

entity RecordResultHead : cuid {
    InspectionLot      : String;
    Material           : String;
    Plant              : String;
    ManagedBy          : String;
    SerialNumber       : String;
    PostDate           : Date;
    EOI                : String;
    Quantity           : Decimal;
    AcceptedQuantity   : Decimal;
    RejectedQuantity   : Decimal;
    Status             : String;
    ManufacturingOrder : String;
    ParameterDetails   : Composition of many RecordResultDetail
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
    ManufacturingOrder          : String;
    UsageDecisionLevel          : String;
    QuantityScore               : Decimal;
    DecisionCatalog             : Int64;
    UsageDecisionSelectedSet    : String;
    UsageDecisionCodeGroup      : String;
    UsageDecisionCode           : String;
    UsageDecisionValuation      : String;
    UsageDecisionFollowupAction : String;
    Employeeworker              : String;
    Remarks                     :String;
    CreatedBy                   : String;
    LastChangedAt               :Timestamp;
    
    UDPostingDate               : Date;
    UDUser                      : String;
    SalesOrder                  : String;

    SerialBatchDetails          : Composition of many RecordResultSerialBatchDetail
                                      on SerialBatchDetails.RecordResultSAPHead = $self;
    RecordResultDecisionHead    : Composition of many RecordResultDecisionHead
                                      on RecordResultDecisionHead.RecordResultSAPHead = $self;

}

entity RecordResultSerialBatchDetail : cuid,managed {
    SerialBatchNumber         : String;
    Quantity                  : Decimal;
    Status                    : String;
    ElectrialUser             : String;
    MechnicalUser             : String;
    DateOfT                   : String;
    UsageDecisionStockType    : String;
    StorageLocation           : String;
    InspectionPlanStatus      : String;
    RecordResultSAPHead       : Association to RecordResultSAPHead;
    ParametersDetails         : Composition of many RecordResultParametersDetail
                                    on ParametersDetails.RecordResultSerialBatchDetail = $self;
    RecordResultDeviceTagging : Composition of many RecordResultDeviceTagging
                                    on RecordResultDeviceTagging.RecordResultSerialBatchDetail = $self;
}
//annotate allengersBTP.RecordResultSAPHead 
  //  with @odata.etag: 'modifiedAt';

//annotate allengersBTP.RecordResultSerialBatchDetail 
  //  with @odata.etag: 'modifiedAt';

entity RecordResultParametersDetail : cuid,managed {
    ParameterCode                 : String;
    ParameterName                 : String;
    lineid                        : Integer;
    ParentParameterCode           : String;
    ParentParameterName           : String;
    DeviceGroupID                 : String;
    DeviceGroup                   : String;
    Lowervalue                    : String;
    Uppervalue                    : String;
    UOM                           : String;
    AttributeID                   : String;
    Attribute                     : String;
    Observation                   : String;
    InstrumentId                  : String;
    InstrumentDesc                : String;
    InspectionAgency              : String;
    Status                        : String;
    Remarks1                      : String;
    Remarks2                      : String;
    RecordResultSerialBatchDetail : Association to RecordResultSerialBatchDetail;
}

entity RecordResultDeviceTagging : cuid,managed {
    DeviceSelect                  : Boolean;
    DeviceID                      : String;
    DeviceDescription             : String;
    DeviceGroup                   : String;
    Serial                        : String;
    DSerial                       : String;
    RecordResultSerialBatchDetail : Association to RecordResultSerialBatchDetail;
}

entity RecordResultDecisionHead : cuid,managed {
    PostDate                   : Date;
    Quantity                   : Decimal;
    Status                     : String;
    UsageDecisionStockType     : String;
    StorageLocation            : String;
    RecordResultSAPHead        : Association to RecordResultSAPHead;
    RecordResultDecisionDetail : Composition of many RecordResultDecisionDetail
                                     on RecordResultDecisionDetail.RecordResultDecisionHead = $self;
}

entity RecordResultDecisionDetail : cuid,managed {
    PostData                 : Boolean;
    SerialBatchNumberID      : String;
    SerialBatchNumber        : String;
    Quantity                 : Decimal;
    Status                   : String;
    RecordResultDecisionHead : Association to RecordResultDecisionHead;
}

entity InventoryTransferSAPHead : cuid,managed {
    RecordResultID     : String;
    InspectionLot      : String;
    Material           : String;
    Plant              : String;
    ManagedBy          : String;
    PostDate           : Date;
    EOI                : String;
    Quantity           : Decimal;
    Remarks            : String;
    // AcceptedQuantity   : Decimal;
    // // AcceptedPlant      : String;
    // RejectedQuantity   : Decimal;
    // // RejectedPlant      : String;
    Status             : String;
    SerialBatchDetails : Composition of many InventoryTransferSerialBatchDetail
                             on SerialBatchDetails.InventoryTransferSAPHead = $self
}

entity ProductQualityClearance : cuid, managed {
    OrderType                 : String;
    MachinePartCode           : String;
    DetailDescription         : String;
    Serial                    : String;
    Inspection                : String;
    CertificateType           : String;
    CertificateNo             : String;
    CertificationType         : String;
    MachineType               : String;
    ProductionOrder           : String;
    MachineModel              : String;
    ManufacturingCode         : String;
    MachineSeries             : String;
    ManufacturingCodeRevision : String;
    ElectricalQA              : String;
    MechanicalQA              : String;
    deviation                 : String;
    deviationNo               : String;
    ElectricalPerson          : String;
    ProductSpecilist          : String;
    FinalClearBy              : String;
    FinalApprovalBy           : String;
    LineItem                  : Composition of many LineInfo
                                    on LineItem.ProductQualityHead = $self;


}

entity LineInfo : cuid,managed {
    ProductQualityHead : Association to ProductQualityClearance;
    DocumentNum        : String;
    IsDocumentAtteched : Boolean;
    IsApplicable       : Boolean;


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

entity DeviceGroupList       as
    select from RecordResultSAPHead as T0
    join RecordResultSerialBatchDetail as T1
        on T0.ID = T1.RecordResultSAPHead.ID
    join RecordResultParametersDetail as T2
        on T1.ID = T2.RecordResultSerialBatchDetail.ID
    {
        key T1.ID,
            T1.SerialBatchNumber,
            T2.DeviceGroupID,
            T2.DeviceGroup
    }
    group by
        T1.ID,
        T2.DeviceGroupID,
        T2.DeviceGroup,
        T1.SerialBatchNumber;

entity DeviceGroupListReport as
    select from RecordResultSAPHead as T0
    join RecordResultSerialBatchDetail as T1
        on T0.ID = T1.RecordResultSAPHead.ID
    join RecordResultParametersDetail as T2
        on T1.ID = T2.RecordResultSerialBatchDetail.ID
    join RecordResultDeviceTagging as T3
        on T1.ID = T3.RecordResultSerialBatchDetail.ID
    {
        key T1.ID,
            T0.InspectionLot,
            T0.Material,
            T1.SerialBatchNumber,
            T3.DeviceID          as DeviceGroupID,
            T3.DeviceGroup,
            T3.DeviceDescription as Dsc,
            T3.DSerial
    }
    where
        DeviceSelect = true
    group by
        T1.ID,
        T0.InspectionLot,
        T0.Material,
        T1.SerialBatchNumber,
        T3.DeviceID,
        T3.DeviceGroup,
        T3.DeviceDescription,
        T3.DSerial;


entity InspectionQcReport    as
    select from RecordResultSAPHead as T0
    join RecordResultSerialBatchDetail as T1
        on T0.ID = T1.RecordResultSAPHead.ID
    join RecordResultParametersDetail as T2
        on T1.ID = T2.RecordResultSerialBatchDetail.ID

    // join RecordResultDeviceTagging as T3 on T1.ID = T3.RecordResultSerialBatchDetail.ID
     //join RecordResultDecisionHead as T6 on T0.ID = T6.RecordResultSAPHead.ID
    left join UserMaster as T4
        on T4.ID = T1.ElectrialUser
    left join UserMaster as T5
        on T5.ID = T1.MechnicalUser
    {
        key T1.ID,
            T4.NameDsc as ElectrialUserName,
            T5.NameDsc as MechnicalUserName,
            T0.InspectionLot,
            T0.Material,
            T0.ManufacturingOrder,
            T1.SerialBatchNumber,
            T2.lineid,
            T2.ParameterName,
            T2.ParentParameterName,
            T2.Attribute,
            T2.Lowervalue,
            T2.Uppervalue,
            T2.Observation,
            T2.UOM,
            T2.Status,
            T2.DeviceGroup,
            // T3.DeviceGroup as Dsc,
            //T3.DeviceID,
            //T3.DSerial,
            T0.Employeeworker,
            T0.SalesOrder,
            T1.DateOfT,
            T0.UDPostingDate,
            T0.UDUser,
            T0.CreatedBy
    }
//where DeviceSelect=true
    /*
    group by
        T1.ID,
        T4.UserName,
        T5.UserName,
        T0.InspectionLot,
        T0.Material,
        T0.ManufacturingOrder,
        T1.SerialBatchNumber,

        T2.ParameterName,
        T2.Attribute,
        T2.Lowervalue,
        T2.Uppervalue,
        T2.Observation,
        T2.UOM,
        T2.Status,
        //T3.DeviceGroup,
        //  T3.DeviceID,
        // T3.DSerial,
        T0.Employeeworker,
        T0.SalesOrder,
        T0.DateOfT,
        T0.UDPostingDate,
        T0.UDUser,
        T0.CreatedBy;
*/