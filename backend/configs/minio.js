import * as Minio from 'minio';
// export default {
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   host: process.env.DB_HOST,
//   dialect: 'mysql',
// };

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "minioadmin",
  secretKey: "minioadmin",
})

const bucketName = "audios";

try {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName);
    console.log(`Bucket ${bucketName} created successfully.`);
  }
  else {
    console.log(`Bucket ${bucketName} already exists.`);
  }
} catch (error) {
  throw error;
}

export default minioClient;