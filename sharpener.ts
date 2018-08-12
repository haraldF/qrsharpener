import * as jpeg from 'jpeg-js';
import * as fs from 'fs';
import { QRSharpener } from './QRSharpener';

// the dimension of your QR code
const dimension = 29;

// the threshold to consider a pixel black or white
const colorThreshold = 50;

const fileName = process.argv[2];
if (fileName === undefined)
    throw new Error("Provide a file");

const contents = fs.readFileSync(fileName);
const imageData = jpeg.decode(contents, true);

const sharpener = new QRSharpener(dimension, colorThreshold);
const result = sharpener.sharpen(imageData);

const resultJpeg = jpeg.encode({ data: Uint8Array.from(result.qrCodeBuffer), width: dimension, height: dimension }, 100);
fs.writeFileSync("res.jpg", resultJpeg.data);

const annotatedJpeg = jpeg.encode({ data: Uint8Array.from(result.annotatedImageBuffer), width: imageData.width, height: imageData.height }, 100);
fs.writeFileSync("res_annotated.jpg", annotatedJpeg.data);
