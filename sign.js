/* eslint-disable import/no-extraneous-dependencies */
const mime = require('mime');
const uuid = require('uuid');
const sigv4 = require('aws-sigv4');

const config = require('./config');

module.exports = function (req, res) {
  const { fileName } = req.query;
  const mimeType = mime.lookup(fileName);
  const fileKey = uuid.v4();

  const date = sigv4
    .formatDateTime(new Date())
    .slice(0, 8);

  const credential = `${config.AWS_KEY}/${date}/${config.AWS_REGION}/s3/aws4_request`;

  const acl = 'private';

  const xAmzServerSideEncryption = 'AES256';
  const xAmzAlgorithm = 'AWS4-HMAC-SHA256';
  const xAmzDate = `${date}T000000Z`;
  const policy = Buffer
    .from(JSON.stringify({
      expiration: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes from now
      conditions: [
        { bucket: config.AWS_BUCKET },
        { key: `${fileKey}_${fileName}` },
        { acl },
        ['content-length-range', 0, config.MAX_FILE_SIZE],
        ['starts-with', '$Content-Type', mimeType],
        { 'x-amz-server-side-encryption': xAmzServerSideEncryption },
        // ['starts-with', '$x-amz-meta-tag', ''],

        { 'x-amz-credential': credential },
        { 'x-amz-algorithm': xAmzAlgorithm },
        { 'x-amz-date': xAmzDate },
      ],
    }))
    .toString('base64');

  sigv4.sign(config.AWS_SECRET, date, config.AWS_REGION, 's3', policy)
    .then((respSignature) => {
      res.json({
        key: `${fileKey}_${fileName}`,
        acl,
        contentType: mimeType,
        xAmzServerSideEncryption,
        xAmzCredential: credential,
        xAmzAlgorithm,
        xAmzDate,
        policy,
        signature: respSignature,
        success_action_redirect: '/',
      });
    });
};
