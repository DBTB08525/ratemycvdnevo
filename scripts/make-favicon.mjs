import pkg from '../node_modules/playwright/index.js';
const { chromium } = pkg;
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoPath = resolve(__dirname, '../src/assets/dnevo-logo.png');
const logoB64 = readFileSync(logoPath).toString('base64');
const logoDataUrl = `data:image/png;base64,${logoB64}`;

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 64, height: 64 });
await page.setContent(`
  <html><body style="margin:0;padding:8px;background:#fff;display:flex;align-items:center;justify-content:center;width:64px;height:64px;box-sizing:border-box;overflow:hidden">
    <img src="${logoDataUrl}" style="width:48px;height:auto;object-fit:contain" />
  </body></html>
`);
await page.waitForTimeout(400);
const pngBuf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 64, height: 64 } });
await browser.close();

// Wrap PNG bytes in a minimal ICO container (PNG-in-ICO, supported by all modern browsers)
const pngSize = pngBuf.length;
const dataOffset = 6 + 16; // ICONDIR + one ICONDIRENTRY
const ico = Buffer.alloc(dataOffset + pngSize);
ico.writeUInt16LE(0, 0);          // reserved
ico.writeUInt16LE(1, 2);          // type: ICO
ico.writeUInt16LE(1, 4);          // image count: 1
ico.writeUInt8(64, 6);            // width
ico.writeUInt8(64, 7);            // height
ico.writeUInt8(0, 8);             // color count (0 = >256)
ico.writeUInt8(0, 9);             // reserved
ico.writeUInt16LE(1, 10);         // color planes
ico.writeUInt16LE(32, 12);        // bits per pixel
ico.writeUInt32LE(pngSize, 14);   // image data size
ico.writeUInt32LE(dataOffset, 18); // offset to image data
pngBuf.copy(ico, dataOffset);

writeFileSync(resolve(__dirname, '../public/favicon.ico'), ico);
writeFileSync(resolve(__dirname, '../public/favicon.png'), pngBuf);
console.log('Done — favicon.ico and favicon.png written');
