import { QRSharpener } from "./QRSharpener";
import { create } from "domain";

const annotatedImage = document.getElementById("annotatedImage") as HTMLImageElement;
const resultImage = document.getElementById("resultImage") as HTMLImageElement;
const uploader = document.getElementById("uploader") as HTMLInputElement;
const statusDiv = document.getElementById("status") as HTMLDivElement;
const dimensionsEdit = document.getElementById("dimensions") as HTMLInputElement;
const canvas = document.createElement("canvas");
const resultCanvas = document.createElement("canvas");

uploader.addEventListener("change", fileUploaded, false);

class Spinner {
    constructor(public readonly target: HTMLDivElement) {}
    start() {
        this.target.innerHTML = "Computing...";
    }

    stop() {
        this.target.innerText = "";
    }
}

function fileUploaded() {
    const files = uploader.files;
    if (files === null)
        return;

    const spinner = new Spinner(statusDiv);
    spinner.start();
    const file = files[0];
    createImageBitmap(file).then(processFile).then(res => spinner.stop()).catch((err: any) => console.error(err));
}

function processFile(bitmap: ImageBitmap) {

    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext("2d");
    if (context === null)
        throw new Error("Cannot get 2d canvas context");

    const dimensions = parseInt(dimensionsEdit.value);

    context.drawImage(bitmap, 0, 0);
    const data = context.getImageData(0, 0, bitmap.width, bitmap.height);

    const sharpener = new QRSharpener(dimensions, 50);
    const result = sharpener.sharpen(data);

    const resultImageData = new ImageData(Uint8ClampedArray.from(result.qrCodeBuffer), 29, 29);
    const annotatedImageData = new ImageData(Uint8ClampedArray.from(result.annotatedImageBuffer), bitmap.width, bitmap.height);

    renderResult(annotatedImageData, annotatedImage);
    renderResult(resultImageData, resultImage);
}

function renderResult(imageData: ImageData, destination: HTMLImageElement) {
    resultCanvas.width = imageData.width;
    resultCanvas.height = imageData.height;

    const context = resultCanvas.getContext('2d')!;
    context.putImageData(imageData, 0, 0);
    destination.src = resultCanvas.toDataURL();
}