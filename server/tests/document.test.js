const request = require('supertest');
const app = require('../src/app');
const Document = require('../src/models/Document');

const doc = {
    fileName: "Example.pdf",
    type: "application/pdf"
}

beforeEach(async () => {
    await Document.destroy({
        where: {},
        truncate: true
    })
    await new Document(doc).save()
})

afterEach(() => {

})


test('It should send to "/" on "/"', async () => {
    await request(app)
        .get('/')
        .send()
        .expect(200)
})

test('It should redirect to "/" on "/document"', async () => {

    await request(app)
        .get('/document')
        .send()
        .expect(302)
})

test('It should return json data with list of documents on get /document/getall', async () => {
    const response = await request(app)
        .get('/document/getall')
        .send()
        .expect(200)

    expect(response.body.data).not.toBeNull()
    expect(response.body.data.documents).not.toBeNull()
    expect(response.body.data.documents.lenth).not.toBe(0)
    expect(response.body.data.documents[0]).toMatchObject(doc)
})

test('It should delete the user on delete /document/delete/1', async () => {
    const response = await request(app)
        .delete('/document/delete/1')
        .send()
        .expect(200)
    expect(response.body.message).toEqual("deleted")
})
test('It should not delete any user not available on database on delete /document/delete/a', async () => {
    const response = await request(app)
        .delete('/document/delete/a')
        .send()
        .expect(400)
    expect(response.body.error).toEqual("Unable to delete")
})

test ('It should upload file which are supported', async () => {
    const response = await request(app)
    .post('/document/upload')
    .attach('files','tests/fixtures/Geektrust-UI-Problems1.pdf')
    .expect(200)

    expect(response.body.message).toEqual("Upload Succesful")
})

test ('It should not upload file which are not supported', async () => {
    const response = await request(app)
    .post('/document/upload')
    .attach('files','tests/fixtures/img1.jpeg')
    .expect(400)

    expect(response.body.error).toEqual("Unsupported file provided")
})