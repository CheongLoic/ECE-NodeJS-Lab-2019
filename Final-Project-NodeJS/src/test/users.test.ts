import {expect} from 'chai'
import {LevelDB} from "../leveldb"
import {UserHandler, User} from "../user";

const dbPath: string = './db/test/users';
var dbUser: UserHandler;


describe('Users', function () {
    before(function () {
        LevelDB.clear(dbPath);
        dbUser = new UserHandler(dbPath)
    });

    it('jUST TESTING ', function () {
        expect(2).to.equal(2)
        expect(2).to.not.equal(1)

        const a: string = "something"
        expect(a).to.be.a('string')
    })
    

    after(function () {
        dbUser.closeDB()
    })

});