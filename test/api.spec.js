const request = require('supertest')
const app = require('../app')

const user = {
    username: 'daniel123',
    password: '123daniel'
}

const userBio = {
    name: 'daniel',
    gender: 'male',
    region: 'indonesia',
    phone: '089878787676'
}

const userHistory = {
    date: "2022-09-23",
    time: "14:14:25",
    score: 50
}

var bio = '';
var token = '';
var history = '';
var id;
var historyId;

const testingHelpers = require('../helpers/testingHelpers');
testingHelpers.userTruncate();
testingHelpers.biodataTruncate();
testingHelpers.historyTruncate();
//auth endpoint

// Register //
describe('auth register endpoint', () => {
    test('register berhasil', async () => {
        try {
            const res = await request(app)
                .post('/user/auth/register')
                .send(user)

            expect(res.statusCode).toBe(201)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body).toHaveProperty('data')
            expect(res.body.status).toBe(true)
            expect(res.body.message).toBe("success")
            expect(res.body.data).toStrictEqual({ username: user.username })
        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
    test('register gagal', async () => {
        try {
            const res = await request(app)
                .post('/user/auth/register')
                .send({ username: 'daniel123', password: 'oke' })

            expect(res.statusCode).toBe(409)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(false)
            expect(res.body.message).toBe("username already used!")
        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
})

//login//
describe('auth login endpoint', () => {
    test('user tidak ada', async () => {
        try {
            const res = await request(app)
                .post('/user/auth/login')
                .send({ username: 'daniel1234', password: '123daniel' })

            expect(res.statusCode).toBe(404)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')

            expect(res.body.status).toBe(false)
            expect(res.body.message).toBe("user doesn't exist!")

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
    test('login berhasil', async () => {
        try {
            const res = await request(app)
                .post('/user/auth/login')
                .send(user)

            token = res.body.data.token;
            //console.log(`${token}`)
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveProperty('token')
            expect(res.body.status).toBe(true)
            expect(res.body.message).toBe("success")
            //expect(res.body.data).toStrictEqual(token)

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
    test('username atau password salah', async () => {
        try {
            const res = await request(app)
                .post('/user/auth/login')
                .send({ username: 'daniel123', password: 'ok' })

            expect(res.statusCode).toBe(400)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')

            expect(res.body.status).toBe(false)
            expect(res.body.message).toBe("username or password doesn\'t match!")

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
})

//Change Password//
describe('auth change password endpoint', () => {
    test('ubah password gagal, old password does not match', async () => {
        try {
            const res = await request(app)
                .put('/user/auth/changePassword')
                .set('Authorization', token)
                .send({
                    oldPassword: 'daniel1234',
                    newPassword: 'passbaru',
                    confirmNewPassword: 'passbaru'
                })

            expect(res.statusCode).toBe(400)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')

            expect(res.body.status).toBe(false)
            expect(res.body.message).toBe('old password does not match!')

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
    test('ubah password gagal, new password and confirm new password doesn\'t match!', async () => {
        try {
            const res = await request(app)
                .put('/user/auth/changePassword')
                .set('Authorization', token)
                .send({
                    oldPassword: user.password,
                    newPassword: 'passbaru',
                    confirmNewPassword: 'passbar'
                })

            expect(res.statusCode).toBe(422)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')

            expect(res.body.status).toBe(false)
            expect(res.body.message).toBe('new password and confirm new password doesn\'t match!')

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
    test('ubah password berhasil', async () => {
        const res = await request(app)
            .put('/user/auth/changePassword')
            .set('Authorization', token)
            .send({
                oldPassword: user.password,
                newPassword: "passbar",
                confirmNewPassword: "passbar"
            })

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('message');

        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe('password changed successfully');

    });
});

//user_game_biodata endpoint
//testingHelpers.biodataTruncate();

describe('failed request bio/userBio,bio/updateBio,deleteBio endpoint', () => {
    test('failed to show user biodata, user bio not found', async () => {
        try {
            const res = await request(app)
                .get('/bio/userBio')
                .set('Authorization', token)
            expect(res.statusCode).toBe(404)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(false)
            expect(res.body.message).toBe("user bio not found")

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })

    test('failed to update user biodata, biodata not found!', async () => {
        try {
            const res = await request(app)
                .put('/bio/updateBio')
                .set('Authorization', token)
                .send({ name: 'daniel', gender: 'male', region: 'indonesia', phone: '089878787676' })
            expect(res.statusCode).toBe(404)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(false)
            expect(res.body.message).toBe("biodata not found!")

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
    test('failed to delete user biodata, biodata not found!', async () => {
        try {
            const res = await request(app)
                .delete('/bio/deleteBio')
                .set('Authorization', token)
            expect(res.statusCode).toBe(404)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(false)
            expect(res.body.message).toBe("biodata not found!")

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
})


describe('bio/createBio endpoint', () => {
    test('Create biodata succes', async () => {
        try {
            const res = await request(app)
                .post('/bio/createBio')
                .set('Authorization', token)
                .send(userBio)

            expect(res.statusCode).toBe(201)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body).toHaveProperty('data')
            expect(res.body.status).toBe(true)
            expect(res.body.message).toBe("success")
            expect(res.body.data).toStrictEqual("successfully create user biodata")
        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
    test('failed to create user biodata, biodata already created!', async () => {
        try {
            const res = await request(app)
                .post('/bio/createBio')
                .set('Authorization', token)
                .send(userBio)

            expect(res.statusCode).toBe(409)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(false)
            expect(res.body.message).toBe("biodata already created!")
        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
})

//show//
describe('bio/userBio endpoint', () => {
    test('success show user biodata', async () => {
        try {
            const res = await request(app)
                .get('/bio/userBio')
                .set('Authorization', token)
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body).toHaveProperty('data')
            bio = res.body.data
            expect(res.body.status).toBe(true)
            expect(res.body.message).toBe("success")
            expect(res.body.data).toStrictEqual(bio)

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
})

//Update biodata//
describe('bio/updateBio endpoint', () => {
    test('Success updated biodata', async () => {
        try {
            const res = await request(app)
                .put('/bio/updateBio')
                .set('Authorization', token)
                .send({
                    name: 'daniel manurung',
                    gender: 'male',
                    region: 'indonesia',
                    phone: '089878787676'
                })

            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')

            expect(res.body.status).toBe(true)
            expect(res.body.message).toBe('Success updated biodata')

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
});


//delete biodata//
describe('bio/deleteBio endpoint', () => {
    test('bio has been deleted', async () => {
        try {
            const res = await request(app)
                .delete('/bio/deleteBio')
                .set('Authorization', token)
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(true)
            expect(res.body.message).toBe('bio has been deleted')
        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
})

//user_game_history endpoint
//testingHelpers.historyTruncate();

describe('failed request history/showHistory endpoint', () => {
    test('failed to show user history, user history not found', async () => {
        try {
            const res = await request(app)
                .get('/history/showHistory')
                .set('Authorization', token)
            expect(res.statusCode).toBe(404)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(false)
            expect(res.body.message).toBe("user history not found")

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
})


describe('/history/createHistory endpoint', () => {
    test('Create history succes', async () => {
        try {
            const res = await request(app)
                .post('/history/createHistory')
                .set('Authorization', token)
                .send(userHistory)

            historyId = res.body.data.id
            expect(res.statusCode).toBe(201)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(true)
            expect(res.body.message).toBe("success")
        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
})

//show//
describe('/history/showHistory endpoint', () => {
    test('success show user history', async () => {
        try {
            const res = await request(app)
                .get('/history/showHistory')
                .set('Authorization', token)
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body).toHaveProperty('data')
            history = res.body.data
            expect(res.body.status).toBe(true)
            expect(res.body.message).toBe("success")
            expect(res.body.data).toStrictEqual(history)

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
})

//Update history//
describe('history/updateHistory endpoint', () => {
    test('Success updated history', async () => {
        try {
            const res = await request(app)
                .put(`/history/updateHistory/${historyId}`)
                .set('Authorization', token)
                .send({
                    name: 'daniel manurung',
                    gender: 'male',
                    region: 'indonesia',
                    phone: '089878787676'
                })

            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')

            expect(res.body.status).toBe(true)
            expect(res.body.message).toBe('Success updated biodata')

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })

    test('failed updated history, history not found!', async () => {
        try {
            const res = await request(app)
                .put(`/history/updateHistory/${historyId + 1}`)
                .set('Authorization', token)
                .send({
                    name: 'daniel manurung',
                    gender: 'male',
                    region: 'colombia',
                    phone: '089878787676'
                })

            expect(res.statusCode).toBe(404)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(false)
            expect(res.body.message).toBe('history not found!')

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
});


//delete history//
describe('history/deleteHistory endpoint', () => {
    test('failed to delete user history, History not found!', async () => {
        try {
            const res = await request(app)
                .delete(`/history/deleteHistory/${historyId + 1}`)
                .set('Authorization', token)
            expect(res.statusCode).toBe(404)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(false)
            expect(res.body.message).toBe('History not found!')
        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
    test('history has been deleted', async () => {
        try {
            const res = await request(app)
                .delete(`/history/deleteHistory/${historyId}`)
                .set('Authorization', token)
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(true)
            expect(res.body.message).toBe('history has been deleted')
        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
})


//delete//
describe('auth delete endpoint', () => {
    test('delete akun berhasil', async () => {
        try {
            const res = await request(app)
                .delete('/user/auth/deleteuser')
                .set('Authorization', token)

            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(true)
            expect(res.body.message).toBe('user_games account deleted')

        }
        catch (err) {
            console.log(err)
            expect(err).toBe('error')
        }
    })
})