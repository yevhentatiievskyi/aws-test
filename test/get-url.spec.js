const getUrl = require('../src/utils/get-url');
const AWS = require('aws-sdk');

describe('get-url module', () => {
    process.env.BUCKET_UPLOAD_SONGS = 'songs';
    const mockEvent = {
        body: {
            fileName: 'test.json',
            fileType: 'text/json'
        }
    }

    const s3 = {
        getSignedUrl: jest.fn().mockImplementation((target, opts, cb) => {
            cb(null, 'url');
        })
    }
    AWS.S3 = function () {
        return s3;
    }

    it('should call getSignedUrl()', async () => {
        const result = await getUrl(mockEvent);

        const nameFile = mockEvent.body.fileName.split('.').slice(0, -1).join('.');
        const key = `${ nameFile }.${ mockEvent.body.fileType.split('/')[ 1 ] }`;

        expect(result).toEqual({
            url: 'url',
            key
        });
    });
});