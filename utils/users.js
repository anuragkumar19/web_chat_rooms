class Users {
    constructor() {
        this.users = [];
    }

    createUser(id, user, room) {
        this.users.push({
            id,
            user,
            room,
        });
    }

    getUser(id) {
        return this.users.find((u) => u.id == id);
    }

    deleteUser(id) {
        let user = this.getUser(id);

        if (user) {
            let i = this.users.indexOf(user);
            if (i !== -1) {
                this.users.splice(i, 1);
                return user;
            }
        }
    }

    getRoomUser(room) {
        return this.users.filter((u) => u.room == room);
    }
}

module.exports = new Users();
