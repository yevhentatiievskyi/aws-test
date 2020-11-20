const AWS = require('aws-sdk');

const safeJSONParser = (str) => {
  let result;

  try {
    result = JSON.parse(str);
  } catch {
    result = str;
  }

  return result;
}

const getSignedUrl = (s3, opts, target = 'putObject') => {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl(target, opts, (err, url) => {
      if (err) reject(err);
      else resolve(url);
    });
  });
}

module.exports = async (e) => {
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  });

  const { fileName, fileType } = safeJSONParser(e.body);

  const nameFile = fileName.split('.').slice(0, -1).join('.');

  const key = `${ nameFile }.${ fileType.split('/')[ 1 ] }`;

  const s3Params = {
    Bucket:      process.env.BUCKET_UPLOAD_SONGS,
    Key:         key,
    ContentType: fileType,
    ACL:         'public-read'
  };

  const result = await getSignedUrl(s3, s3Params);

  return {
    url: result,
    key
  };
}

module.exports.getSignedUrl = getSignedUrl;
