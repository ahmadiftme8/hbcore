// scripts/list-bucket.ts
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

// Load variables (if the .env file is in the root)
dotenv.config(); 
// If the .env.local file is in packages/web and you want to load it, you need to manually specify the path or provide the values.
// However, since the script runs from the root, it typically reads the root .env file.

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

async function listAllFiles() {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
  };

  try {
    const data = await s3.send(new ListObjectsV2Command(params));
    
    console.log("\n📂 Bucket Structure Check:");
    console.log("--------------------------");
    
    if (!data.Contents || data.Contents.length === 0) {
      console.log("⚠️ Bucket is empty!");
      return;
    }

    // Print 5 files for sample
    data.Contents.slice(0, 10).forEach((file) => {
      console.log(`📄 Key: ${file.Key}`);
    });

    console.log("--------------------------");
    console.log(`Total files: ${data.Contents.length}`);
    
  } catch (err) {
    console.error("❌ Error listing bucket:", err);
  }
}

listAllFiles();