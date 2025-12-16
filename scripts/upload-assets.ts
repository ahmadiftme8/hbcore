import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

// Initialize S3 Client
const s3Client = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.S3_SECRET_KEY || "",
    },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;


// Recursive function to get all files
function getAllFiles(dirPath: string, filesArray: string[] = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, filesArray);
        } else {
            filesArray.push(filePath);
        }
    });

    return filesArray;
}

async function checkFileExists(bucket: string, key: string): Promise<boolean> {
    try {
        await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
        return true;
    } catch (error: any) {
        if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
            return false;
        }
        // If it's another error (e.g. permission), throw it or return false depending on desired strictness. 
        // For this script, we'll assume other errors mean we should try uploading or let that fail too.
        throw error;
    }
}

async function uploadAssets() {
    // Validate Bucket Name
    if (!BUCKET_NAME) {
        console.error("❌ S3_BUCKET_NAME is not defined in environment variables.");
        process.exit(1);
    }

    // Target directory: packages/web/public
    const publicDir = path.join(process.cwd(), "packages", "web", "public");

    // Verify directory exists
    if (!fs.existsSync(publicDir)) {
        console.error(`❌ Directory not found: ${publicDir}`);
        process.exit(1);
    }

    console.log(`Scanning directory: ${publicDir}...`);

    // Get all files recursively
    const allFiles = getAllFiles(publicDir);

    // Filter for images (.jpg, .png)
    const imageFiles = allFiles.filter((filePath) => /\.(jpg|png|webp)$/i.test(filePath));

    if (imageFiles.length === 0) {
        console.log("No .jpg or .png files found in packages/web/public.");
        return;
    }

    console.log(`Found ${imageFiles.length} images to upload to bucket '${BUCKET_NAME}'...`);

    // Loop and upload
    for (const filePath of imageFiles) {
        const fileContent = fs.readFileSync(filePath);

        // Create key preserving structure: images/relative/path/to/file.png
        const relativePath = path.relative(publicDir, filePath);
        // Ensure forward slashes for S3 keys regardless of OS
        const s3Path = relativePath.split(path.sep).join("/");
        const key = `images/${s3Path}`;

        // Determine content type
        let contentType = "image/jpeg"; // Default
        const lowerPath = filePath.toLowerCase();

        if (lowerPath.endsWith(".png")) {
            contentType = "image/png";
        } else if (lowerPath.endsWith(".webp")) {
            contentType = "image/webp";
        }

        try {
            // Check if file exists
            const exists = await checkFileExists(BUCKET_NAME!, key);
            if (exists) {
                console.log(`⏭️ Skipped (Already exists): ${s3Path}`);
                continue;
            }

            await s3Client.send(
                new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: key,
                    Body: fileContent,
                    ACL: "public-read",
                    ContentType: contentType,
                })
            );
            console.log(`✅ Uploaded: ${s3Path}`);
        } catch (error) {
            console.error(`❌ Failed to upload: ${s3Path}`, error);
        }
    }
}

// Execute logic
uploadAssets().catch((err) => {
    console.error("❌ Script error:", err);
    process.exit(1);
});
