using {db.UM as dbum} from '../db/UserMaster';

service UserMasterServiceTest {
    entity UserMasterHead as projection on dbum.UserMasterHead;
}
