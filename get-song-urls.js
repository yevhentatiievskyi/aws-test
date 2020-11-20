'use strict';
const AWS = require('aws-sdk');
const getUrl = require('./get-url');

module.exports.handler = async () => {
    const s3 = new AWS.S3();

    const { Contents: list } = await s3.listObjects({ Bucket: process.env.BUCKET_TRIM_SONGS }).promise();

    const urls = await Promise.all(list.map(async (object) => {
        return getUrl.getSignedUrl(s3, {
            Bucket: process.env.BUCKET_TRIM_SONGS,
            Key: object.Key
        }, 'getObject');
    }));

    return {
        statusCode: 200,
        body: JSON.stringify(urls, null, 2)
    };
};
