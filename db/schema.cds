using {
    cuid,
    managed
} from '@sap/cds/common';

namespace allengersBTP;

entity UserMaster : cuid,managed {
    UserName                : String;
    NameDsc                 :String;
    Password                : String;
    IsAdmin                 : Boolean;
    IsMechnical             : Boolean;
    IsElectrial             : Boolean;
    ManageRecordResult      : Boolean;
    ManageUserDecision      : Boolean;
    IsDebitNote             : Boolean;
    IsRecordResultreport    : Boolean;
    DispatchQuality         : Boolean;
    QualityAssurance        : Boolean;
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

entity FormStatus : cuid {
    ID_Number            :Int32;
    SerialNumber          : String;
    FormId               : String;
    IsLockedForRR        : Boolean;
    IsLockedForDS        : Boolean;
    RRUserName          : String;
    DSUserName          : String;
    RRLockedDateTime : Timestamp;
    DSLockedDateTime : Timestamp;
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
    ReasonforDesire             : String;
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
    ISO                       : String;
    InspectionPlanDesc        :String;
    Status                    : String;
    remarks                   : String;
    ElectrialUser             : String;
    ElectrialDate             : Date;
    MechnicalUser             : String;
    MechnicalDate             : Date;
    DateOfT                   : String;
    UDPostingDate             : Date;
    UDUserName                : String;
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
    remarks                    : String;
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
    ControledNo                : String;
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
    ElectricalDate:             Date;
    MechanicalDate:             Date;
    PersanAUthorizedforInspection: String;
    ProductSpecilistApproval: String;
    PADate:                     Date;
    PSDate:                     Date;
    deviation                 : String;
    deviationNo               : String;
    ElectricalPerson          : String;
    PackingEnsuredBy          : String; 
    PEByDate:                  Date;
    FinalClearBy              : String;
    FinalApprovalBy           : String;
    FinalClearByDate          :String;
    FinalApprovalByDate       :String;   
      SpecialInstruction:        String;
            DesirethengiveDetails: String;
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
entity DispatchQuality : cuid,managed {
   InspectionLot:               String;
       Production:               String;
        SerialNum:                  String;
        SalesOrder:                 String;
         Material:                  String;
         _SalesOrder:                String;
         SpecialConfiguration:      String;
         ShippingPoint:             String;
         DistributionChannel:       String;
         Isthereany:                String;
         RefNo:                     String;
         ExtraField:                String;
         ExtraField2:                String;
         thereanydeviation:         String;
         IfYesmentiondeviation:     String;
         Totalnoofpackets:          Decimal;
         DocumentNo:                String;
            ExpiryDate:             String;
        IssueDate:                  String;
            Machinewil:             String;
            ProcurementPermission: String;
            FinalApprovedBy:        String;
            FinalClearedBy:         String;
            FinalApprovedDate:        String;
            FinalClearedDate:         String;
              FinalApprovedByName:        String;
            FinalClearedByName:         String;
            CustomerCode:             String;
            CustomerName:             String;
            CityName            : String;
            SpecialInstruction:        String;
            Region:                 String;
            MachineReceivedBy:String;
            MachineReceivedByName:String;
             MachineDispatchedByName:String;
            dateofReceived:String;
            MachineDispatchedBy:String;
            dateofDispatched:String;
            IsDeviceregistered:String;
           
            FactSheet:              Composition of many FactSheetLine
                                        on FactSheet.DispatchQualityHead = $self;
}
entity FactSheetLine : cuid,managed {
     DispatchQualityHead : Association to DispatchQuality;
    DocumentName : String;
    CheckBox       : Boolean;
   
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
   left join RecordResultDeviceTagging as T3
        on T1.ID = T3.RecordResultSerialBatchDetail.ID and  T3.DeviceSelect = true
    left join RecordResultDecisionHead as t4 on T1.ID=t4.RecordResultSAPHead.ID
    left join RecordResultDecisionDetail as T5 on t4.ID=T5.RecordResultDecisionHead.ID
    {
        key T1.ID,
        T0.Status as LotStatus,
        T1.Status as SerialStatus,
            T0.InspectionLot,
            
            T0.Material,
            T1.SerialBatchNumber,
            T3.DeviceID          as DeviceGroupID,
            T3.DeviceGroup,
            T3.DeviceDescription as Dsc,
            T3.DSerial,
            t4.Status as UDStatus,
            T5.Status as Serial_StockTransfer
    }

      
    group by  
        T1.ID,
        T0.InspectionLot,
        T0.Material,
        T1.Status,
        T1.SerialBatchNumber,
        T3.DeviceID,
        T3.DeviceGroup,
        T3.DeviceDescription,
        T3.DSerial,
        T0.Status ,
        T1.Status,
        t4.Status ,
            T5.Status ;


entity InspectionQcReport    as
    select from RecordResultSAPHead as T0
    join RecordResultSerialBatchDetail as T1
        on T0.ID = T1.RecordResultSAPHead.ID
    join RecordResultParametersDetail as T2
        on T1.ID = T2.RecordResultSerialBatchDetail.ID

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
            T0.ReasonforDesire,
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
            T0.CreatedBy,
            ElectrialUser  ,        
            T1.ElectrialDate    ,         
            T1.MechnicalDate    ,         
            T1.UDPostingDate  AS InventoryTransferPostingDate     ,      
            T1.UDUserName  AS InventoryTransferUserName     ,
            T1.remarks        
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


entity InspectionQcReport2 as
    select from RecordResultSAPHead as T0 join RecordResultSerialBatchDetail as T1 on T0.ID = T1.RecordResultSAPHead.ID
    join RecordResultParametersDetail as T2  on T1.ID = T2.RecordResultSerialBatchDetail.ID
    left join RecordResultDeviceTagging as T3  on T1.ID = T3.RecordResultSerialBatchDetail.ID  and T3.DeviceSelect = true
    left join RecordResultDecisionHead as T4  on T0.ID = T4.RecordResultSAPHead.ID
    left join RecordResultDecisionDetail as T5  on T4.ID = T5.RecordResultDecisionHead.ID  and T5.SerialBatchNumber = T1.SerialBatchNumber
     left join UserMaster as T6  on T6.ID = T1.ElectrialUser  
     left join UserMaster as T7   on T7.ID = T1.MechnicalUser
     left join UserMaster as T8  on T8.UserName = T1.UDUserName
    {
        // ── Primary Key ──────────────────────────────────────
        key T2.ID,

        // ── Inspection Lot Header (T0) ────────────────────────
        T0.InspectionLot,
        T0.PostDate,
        T1.InspectionPlanDesc,
        T0.Material,
        T0.ManufacturingOrder,
        T0.ReasonforDesire,
        T0.Employeeworker,
        T0.Status               as LotStatus,

        // ── Serial / Batch (T1) ───────────────────────────────
        T1.SerialBatchNumber,
        T1.ISO,
        T1.Status               as SerialStatus,
        T1.DateOfT,
        T6.NameDsc        as ElectrialUserName,
        T1.ElectrialDate,
        T7.NameDsc        as MechnicalUserName,
        T1.MechnicalDate,
        T1.UDPostingDate,
        T8.NameDsc        as InventoryTransferUserName,

        // ── Parameters (T2) ───────────────────────────────────
        // lineid drives the correct sort order
        T2.lineid,

        // Parent row — shown as Sr No: 1, 2, 3
        T2.ParentParameterCode,
        T2.ParentParameterName,

        // Child row — shown as Sr No: 1.1, 1.2, 1.3
        T2.ParameterCode,
        T2.ParameterName,

        // Inspection data columns
        T2.Attribute,
        T2.AttributeID,
        T2.Lowervalue,
        T2.Uppervalue,
        T2.UOM,                 // ← contains Ω (Ohm) symbol
        T2.Observation,
        T2.Status,              // Accepted / Rejected
        T2.DeviceGroup,
        T2.DeviceGroupID,
        T2.InstrumentId,
        T2.InstrumentDesc,
        T2.Remarks1,
        T2.Remarks2,

        // ── Device Tagging (T3) ───────────────────────────────
        T3.DeviceID,
        T3.DeviceDescription    as DeviceDesc,
        T3.DeviceGroup          as TagDeviceGroup,
        T3.DSerial,

        // ── Usage Decision (T4) ───────────────────────────────
        T4.Status               as UDStatus,
        T4.remarks              as TransferUDRemarks,

        // ── Decision Detail (T5) ──────────────────────────────
        T5.Status               as Serial_StockTransfer,
        T5.SerialBatchNumber    as DecisionSerialBatchNumber,

        // ── Posting Date from T1 ─────────────────────────────
        T1.UDPostingDate        as InventoryTransferPostingDate
    }
    // ✅ Order by lineid so parent always comes before its children
    order by
        T1.SerialBatchNumber asc,
        T2.lineid            asc;


    entity GetElectrialUser as
    select from RecordResultSAPHead as T0 join RecordResultSerialBatchDetail as T1 on T0.ID = T1.RecordResultSAPHead.ID
     left join UserMaster as T6  on T6.ID = T1.ElectrialUser  
       left join UserMaster as T7   on T7.ID = T1.MechnicalUser
     
    {
        // ── Primary Key ──────────────────────────────────────
        key T6.UserName,
        
        T1.SerialBatchNumber,
        T1.ISO,
        T6.NameDsc as ElectrialUserName,
        T7.NameDsc as MechnicalUserName,
        T7.UserName as MechnicalUser
    }