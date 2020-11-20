'use strict';
const AWS = require('aws-sdk');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

module.exports.handler = async event => {
    const s3 = new AWS.S3();

    try {
        const record = event.Records[0];
        const fileName = record.s3.object.key.replace(/\+/g, ' ');

        const getParams = {
            Bucket: record.s3.bucket.name,
            Key: fileName
        };

        const object = await s3.getObject(getParams).promise();

        await fs.promises.writeFile('/tmp/song.mp3', object.Body);

        await new Promise((resolve, reject) => {
            ffmpeg('/tmp/song.mp3')
                .outputOptions('-t 5')
                .save('/tmp/song_trim.mp3')
                .on('end', () => resolve())
                .on('err', (e) => reject(e));
        });

        const trimSong = fs.readFileSync('/tmp/song_trim.mp3');

        const putParams = {
            Body: trimSong,
            Bucket: process.env.BUCKET_TRIM_SONGS,
            Key: fileName
        };

        await s3.putObject(putParams).promise();

        const deleteParams = {
            Bucket: record.s3.bucket.name,
            Key: fileName
        };

        await s3.deleteObject(deleteParams).promise();

        fs.unlinkSync('/tmp/song.mp3');
        fs.unlinkSync('/tmp/song_trim.mp3');
    } catch (e) {
        console.error(e);
    }
};
