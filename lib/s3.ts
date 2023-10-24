import AWS from "aws-sdk";

type uploadFcn = (progress: number) => void;

export async function uploadToS3(file: File, updateUploadProgress: uploadFcn) {
  try {
    const file_key = `uploads/${Date.now().toString()}_${file.name.replace(
      " ",
      "-"
    )}`;
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
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
    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        const progress = Math.floor((evt.loaded * 100) / evt.total);
        console.log(`Uploading to S3 ${progress}%.`);
        updateUploadProgress(progress);
      })
      .promise();

    await upload.then((_) => {
      console.log(`Successfully uploaded to S3!`, file_key);
    });

    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (error) {
    console.log(error);
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`;
  return url;
}
