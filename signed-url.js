const {
  S3Client,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

async function createSignedUrl(params) {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: params.credentials.email,
      secretAccessKey: params.credentials.token,
    },
    endpoint: params.endpoint,
    region: 'default',
  });

  const command = new GetObjectCommand({
    Bucket: params.bucket,
    Key: params.file,
  });
  return getSignedUrl(s3, command, { expiresIn: 24 * 60 * 60 });
}

(async () => {
  const presignedUrl = await createSignedUrl({
    bucket: 'ssssas',
    file: 'Bridge.mb',
    credentials: {
      email: 'anas.rachyd@qarnot-computing.com',
      token: '<token>',
    },
    endpoint: 'https://storage<dev>qarnot.com/',
  });
  console.log(presignedUrl);
})();
