using {cuid} from '@sap/cds/common';

namespace db.UM;

entity UserMasterHead : cuid {
    UserName : String;
    Password : String;
}
