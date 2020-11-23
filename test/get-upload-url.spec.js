const handler = require('../src/get-upload-url/get-upload-url').handler;
const getUrl = require('../src/utils/get-url');

jest.mock('../src/utils/get-url');

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