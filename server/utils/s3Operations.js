const AWS = require('aws-sdk');
const AmazonS3Url = require('amazon-s3-uri');

const Bucket = process.env.S3_BUCKNAME;

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESSKEY_ID,
  secretAccessKey: process.env.ACCESSKEY,
  region: process.env.REGION,
});

exports.uploadFile = (file) => {
  const params = {
    Bucket,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err.message);
      }
      resolve(data.Location);
    });
  });
};

exports.deleteFile = (url) => new Promise((resolve, reject) => {
  try {
    const { key } = AmazonS3Url(url);
    const params = {
      Bucket,
      Key: key,
    };

    s3.deleteObject(params, (err) => {
      if (err) {
        reject(err.message);
      }
      resolve('success!');
    });
  } catch (err) {
    reject(err.message);
  }
});
