using {db.UM as dbum} from '../db/UserMaster';

service UserMasterService {
    entity UserMasterHead as projection on dbum.UserMasterHead;
}
