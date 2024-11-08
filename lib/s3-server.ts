import AWS from "aws-sdk";
import fs from "fs";

export async function downloadFromS3(file_key: string) {
  try {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: process.env.NEXT_PUBLIC_S3_REGION,
    });
    const obj = await s3.getObject(params).promise();
    const file_name = `./tmp/pdf/${Date.now()}.pdf`;
    fs.writeFileSync(file_name, obj.Body as Buffer);

    return file_name;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function deleteFile(file_name: string) {
  try {
    fs.unlinkSync(file_name);
  } catch (error) {
    console.error(error);
  }
}
