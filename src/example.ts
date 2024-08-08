import { exec } from "child_process";

class FriendsList {
    friends =[];

    addFriend(name) {
        this.friends.push(name)
        this.announceFriendship(name)
    }

    announceFriendship(name){
        console.log(`${name} is now a friend`)
    }

    removeFriend(name) {
        const idx = this.friends.indexOf(name)
        if(idx === -1) {
            throw new Error('Friend not found!')
        }
        this.friends.splice(idx, 1)
    }
}

// tests
describe('FriendsList', () => {
    let friendsLists;

    beforeEach(() => {
        friendsLists = new FriendsList()
    })
    it('initializes friends list', () => {
        expect(friendsLists.friends.length).toEqual(0)
    })

    it('adds a friend to the list', () => {
        friendsLists.addFriend('Ariel');

        expect(friendsLists.friends.length).toEqual(1)
    })

    it('announces friendship', () => {
        friendsLists.announceFriendship = jest.fn()

        expect(friendsLists.announceFriendship).not.toHaveBeenCalled()
        friendsLists.addFriend('Ariel');
        expect(friendsLists.announceFriendship).toHaveBeenCalledWith('Ariel')
    })

    describe('removeFriend', () => {
        it('removes a friend from the list', () => {
            friendsLists.addFriend('Ariel')
            expect(friendsLists.friends[0]).toEqual('Ariel')
            friendsLists.removeFriend('Ariel')
            expect(friendsLists.friends[0]).toBeUndefined()
        })

        it('throws an error as friend does not exist', () => {
           expect(() => friendsLists.removeFriend('Ariel')).toThrow(new Error('Friend not found!'))
        })
    })
})
