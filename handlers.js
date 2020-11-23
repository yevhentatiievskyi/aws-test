const { handler: getSongUrls } = require('./src/get-song-urls/get-song-urls');
const { handler: getUploadUrl } = require('./src/get-upload-url/get-upload-url');
const { handler: trimSong } = require('./src/trim-song/trim-song');

module.exports = {
    getSongUrls,
    getUploadUrl,
    trimSong
};