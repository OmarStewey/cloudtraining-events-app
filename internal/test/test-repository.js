var chai = require('chai');
const sinon = require('sinon');
var repo = require('../repository');
var db = sinon.mock(require('mariadb'))

describe('Testing Get Events', function () {
    it('should return events  ', function () {
        const request = [];
        repo.getEvents(db).then(
            (data) => {
                chai.expect(data).to.have.property('events');
            }
        )
    });
    it('should return mock events when no data in db ', function () {
        repo.getEvents(db).then(
            (data) => {
                chai.expect(data.events[0].title).to.equal('a mock event');
            }
        )
    });
});


describe('Testing Add Event', function () {
    it('should  add new item to events ', function () {
        const request = {
            body: {
                title: 'new',
                description: 'event',
                location: 'somewhere'
            }
        }
        repo.addEvent(request, db).then(
            (data) => {
                chai.expect(data.events).to.have.lengthOf(3);
            }
        )
    });
});


describe('Testing Un-Like Event', function () {
    it('should decrement likes for event ', function () {
        repo.removeLike(1, db).then(
            (data) => {
                chai.expect(data.events[0].likes).to.equal(0);
            }
        )
    });
});

describe('Testing Like Event', function () {
    it('should increment likes for event ', function () {
        repo.addLike(1, db).then(
            (data) => {
                chai.expect(data.events[0].likes).to.equal(1);
            }
        )
    });
});
