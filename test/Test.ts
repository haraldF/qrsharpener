import { assert } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as jpeg from 'jpeg-js';

import { QRSharpener } from '../QRSharpener';

describe("QRSharpener", function() {
    it("detect code", function() {

        this.timeout(20000);

        const file = fs.readFileSync(path.join(__dirname, "../testImages/QR.jpg"));
        const imageData = jpeg.decode(file, true);

        const sharpener = new QRSharpener(29, 50);
        const result = sharpener.sharpen(imageData);

        assert.strictEqual(result.annotatedImageBuffer.length, 18592768);
        assert.strictEqual(result.qrCodeBuffer.length, 29*29*4);
    });
});