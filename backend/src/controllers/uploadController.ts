import { Request, Response } from 'express';
import fs from 'fs';
import s3 from '../config/awsConfig';

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

// Initiate multipart upload
const initiateUpload = async (fileName: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    ContentType: 'application/octet-stream',
  };
  return s3.createMultipartUpload(params).promise();
};

// Upload a part
const uploadPart = async (uploadId: string, fileName: string, partNumber: number, buffer: Buffer) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    PartNumber: partNumber,
    UploadId: uploadId,
    Body: buffer,
  };
  return s3.uploadPart(params).promise();
};

// Complete multipart upload
const completeUpload = async (uploadId: string, fileName: string, parts: { ETag: string; PartNumber: number }[]) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  };
  return s3.completeMultipartUpload(params).promise();
};

// Upload file handler
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const filePath = file.path;
    const fileName = file.originalname;
    const fileSize = fs.statSync(filePath).size;
    const partSize = 5 * 1024 * 1024; // 5MB
    let partNumber = 1;
    let parts: { ETag: string; PartNumber: number }[] = [];

    const { UploadId } = await initiateUpload(fileName);
    if (!UploadId) {
      throw new Error('UploadId is undefined');
    }

for (let start = 0; start < fileSize; start += partSize) {
  const buffer = fs.readFileSync(filePath).slice(start, Math.min(start + partSize, fileSize));
  const part = await uploadPart(UploadId, fileName, partNumber, buffer);

  
  parts.push({ ETag: part.ETag ?? '', PartNumber: partNumber });

  partNumber++;
}


    await completeUpload(UploadId, fileName, parts);
    fs.unlinkSync(filePath); 

    res.status(200).json({ message: 'File uploaded successfully', fileName });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const listFiles = async (req: Request, res: Response) => {
  try {
    const params = { Bucket: BUCKET_NAME };
    const { Contents } = await s3.listObjectsV2(params).promise();

    if (!Contents) {
      return res.status(200).json([]);
    }

    const fileUrls = await Promise.all(
      Contents.map(async (file) => {
        if (!file.Key) return null;
        const url = await s3.getSignedUrlPromise('getObject', {
          Bucket: BUCKET_NAME,
          Key: file.Key,
        });
        return { key: file.Key, url };
      })
    );

    res.status(200).json(fileUrls.filter(Boolean)); 
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};