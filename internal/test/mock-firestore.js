
const changeMe = { title: 'a firestore event', id: 1, description: 'something really cool', location: 'Joes pizza', likes: 0 };

// mock events data - for a real solution this data should be coming 
// from a cloud data store
const mockEvents = [
    {
        id: 1,
        data: function () {
            return changeMe;
        }
    },
    {
        id: 2,
        data: function () {
            return { title: 'another firestore event', id: 2, description: 'something even cooler', location: 'Johns pizza', likes: 0 };
        }
    },

];

const snapshot = {
    docs: mockEvents,
    empty: false
}

const collection = function (arg) {
    return {
        doc: function (id) {
            return  {
                get: function () {
                    return Promise.resolve(snapshot.docs.find(x => x.id === id));
                },
                update: function (arg) {
                   changeMe.likes = arg.likes;
                   return Promise.resolve(snapshot);
                },
            };
        },
        add: function (arg) {
            snapshot.docs.push({
                id: 3,
                data: function () {
                    return { title: arg.title, id: 2, description: arg.description, location: arg.location, likes: 0 };
                } 
            });
            return Promise.resolve(snapshot);
        },
        get: function () {
            return Promise.resolve(snapshot);
        }
    }
};

const Firestore = function () {
    var entity = {};
    entity.snapshot = snapshot;
    entity.collection = collection;
    return entity;

}();


module.exports = Firestore;
