import { User } from "./user.entity";
import * as bcrypt from 'bcrypt'

describe('User Entity', () => {
    let user: User;

    beforeEach(() => {
        user = new User()
        user.password = 'testPassword'
        user.salt = 'testSalt'
        bcrypt.hash = jest.fn()
    })
    describe('ValidatePassword', () => {
        it('returns true as password is valid', async() => {
            bcrypt.hash.mockReturnValue('testPassword')
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const result = await user.validatePassword('12345')
            expect(bcrypt.hash).toHaveBeenCalledWith('12345', 'testSalt')
            expect(result).toEqual(true)
        })
        it('returns true as password is Invalid', async() => {
            bcrypt.hash.mockReturnValue('wrongPassword')
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const result = await user.validatePassword('wrongPassword')
            expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt')
            expect(result).toEqual(false)
        })
    });    
});