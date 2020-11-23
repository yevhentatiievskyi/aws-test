const handler = require('../src/trim-song/trim-song').handler;
const fs = require('fs');
const AWS = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');

jest.mock('fs')
jest.mock('fluent-ffmpeg');

describe('trim_song handler', function () {
    process.env.BUCKET_TRIM_SONGS = 'trim_songs';

    let shouldThrowErrorOnTrim = false;

    fs.promises = {
        writeFile: jest.fn(),
    }
    fs.readFileSync = jest.fn();
    fs.unlinkSync = jest.fn();
    const mockFFmpeg = {
        outputOptions: jest.fn().mockReturnThis(),
        save: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation((event, cb) => {
            if (!shouldThrowErrorOnTrim && event === 'end') cb();
            if (shouldThrowErrorOnTrim && event === 'err') cb(new Error('failed'));
        })
    }
    ffmpeg.mockReturnValue(mockFFmpeg);

    const s3 = {
        getObject: jest.fn().mockReturnValue({
            promise: jest.fn().mockResolvedValue({
                Body: new Buffer('')
            })
        }),
        putObject: jest.fn().mockReturnValue({
            promise: jest.fn()
        }),
        deleteObject: jest.fn().mockReturnValue({
            promise: jest.fn()
        })
    }
    AWS.S3 = function () {
        return s3;
    }

    const mockEvent = {
        Records: [
            {
                s3: {
                    object: {
                        key: 'song.mp3'
                    },
                    bucket: {
                        name: 'songs'
                    }
                }
            }
        ]
    }

    describe('AWS S3', () => {
        it('should get file', () => {
            handler(mockEvent);

            expect(s3.getObject).toHaveBeenCalledWith({
                Bucket: 'songs',
                Key: 'song.mp3'
            });
        });

        it('should save trim file', () => {
            handler(mockEvent);

            expect(s3.putObject).toHaveBeenCalledWith({
                Bucket: process.env.BUCKET_TRIM_SONGS,
                Key: 'song.mp3'
            });
        });

        it('should delete original file', () => {
            handler(mockEvent);

            expect(s3.deleteObject).toHaveBeenCalledWith({
                Bucket: 'songs',
                Key: 'song.mp3'
            });
        });
    });

    describe('process file', () => {
        it('should save original file', () => {
            handler(mockEvent);

            expect(fs.promises.writeFile).toHaveBeenCalledWith('/tmp/song.mp3', new Buffer(''));
        });

        it('should trim song file', () => {
            handler(mockEvent);

            expect(mockFFmpeg.outputOptions).toHaveBeenCalledWith('-t 5');
            expect(mockFFmpeg.save).toHaveBeenCalledWith('/tmp/song_trim.mp3');
        });

        it('should read trim song', () => {
            handler(mockEvent);

            expect(fs.readFileSync).toHaveBeenCalledWith('/tmp/song_trim.mp3');
        });

        it('should remove unnecessary files', () => {
            handler(mockEvent);

            expect(fs.unlinkSync).toHaveBeenCalledWith('/tmp/song.mp3');
            expect(fs.unlinkSync).toHaveBeenCalledWith('/tmp/song_trim.mp3');
        });
    });
});