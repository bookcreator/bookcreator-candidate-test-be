const { createLittleLink } = require('../index');
const { Firestore } = require('@google-cloud/firestore');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

jest.mock('@google-cloud/firestore');
jest.mock('@google-cloud/functions-framework');

const shortLinkRegex = /^http:\/\/localhost\/retrieveLittleLink\/[a-zA-Z0-9]{8,}$/;

describe('createLittleLink', () => {
  let req;
  let res;
  let firestoreMock;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    firestoreMock = {
      collection: jest.fn(),
    };

    Firestore.mockImplementationOnce(() => firestoreMock);
  });

  it('should return 405 if method is not POST', async () => {
    req.method = 'GET';
    await createLittleLink(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.send).toHaveBeenCalledWith('Method Not Allowed');
  });

  it('should return 400 if URL is not provided', async () => {
    req.method = 'POST';
    req.body = {};
    await createLittleLink(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'URL is required' });
  });

  it('should return 400 if URL is invalid', async () => {
    req.method = 'POST';
    req.body = { url: 'invalid-url' };
    await createLittleLink(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'URL must be a valid url including protocol' });
  });

  it('should create and return shortLink', async () => {
    req.method = 'POST';
    req.body = { url: 'http://example.com' };

    firestoreMock.collection.mockReturnValueOnce({
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ exists: false }), // Simulate new document (not found)
        set: jest.fn().mockResolvedValue() // Simulate Firestore set success
      })
    });

    req.get = jest.fn().mockReturnValue('localhost');
    req.protocol = 'http';
    await createLittleLink(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      shortLink: expect.stringMatching(shortLinkRegex)
    }));
  });
});