const handler = require('./get-song-urls').handler;
const AWS = require('aws-sdk');
const getUrl = require('./get-url');

jest.mock('./get-url');

describe('get_song_urls function', () => {
    process.env.BUCKET_TRIM_SONGS = 'trim_songs';
    const s3 = {
        listObjects: jest.fn().mockReturnValue({
            promise: jest.fn().mockResolvedValue({ Contents: [{ Key: 'song.mp3' }] })
        })
    }
    AWS.S3 = function () {
        return s3;
    };

    it('should get listObjects and return urls', async () => {
        getUrl.getSignedUrl.mockResolvedValue('url');

        const response = await handler();

        expect(s3.listObjects).toHaveBeenCalledWith({
            Bucket: process.env.BUCKET_TRIM_SONGS
        });
        expect(getUrl.getSignedUrl).toHaveBeenCalledWith(s3, {
            Bucket: process.env.BUCKET_TRIM_SONGS,
            Key: 'song.mp3'
        }, 'getObject');

        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify(['url'], null, 2)
        });
    });
});