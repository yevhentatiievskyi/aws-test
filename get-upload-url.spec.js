const handler = require('./get-upload-url').handler;
const getUrl = require('./get-url');

jest.mock('./get-url');

describe('get_upload_url function', () => {
    const mockEvent = {};

    it('should call getUrl and return response', async () => {
        getUrl.mockResolvedValue({ url: 'url', key: 'key' })
        const response = await handler(mockEvent);

        expect(getUrl).toHaveBeenCalledWith(mockEvent);
        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify(
                { url: 'url', key: 'key' },
                null,
                2
            )
        });
    });
});