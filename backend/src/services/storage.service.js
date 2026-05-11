const ImageKit = require('imagekit');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;

let imagekit = null;
let imagekitConfigured = false;
if (IMAGEKIT_PUBLIC_KEY && IMAGEKIT_PRIVATE_KEY && IMAGEKIT_URL_ENDPOINT) {
    imagekit = new ImageKit({
        publicKey: IMAGEKIT_PUBLIC_KEY,
        privateKey: IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: IMAGEKIT_URL_ENDPOINT
    });
    imagekitConfigured = true;
} else {
    console.warn('ImageKit not configured — falling back to local uploads. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT to enable ImageKit.');
}

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

async function uploadFile(file, fileName, mime) {
    if (imagekitConfigured) {
        try {
            const base64 = Buffer.isBuffer(file) ? file.toString('base64') : file;
            // ImageKit accepts base64 data URIs. Include MIME to be explicit.
            const payload = mime ? `data:${mime};base64,${base64}` : base64;
            const nameWithExt = (() => {
                if (!mime) return fileName;
                const map = {
                    'video/mp4': '.mp4',
                    'video/webm': '.webm',
                    'video/quicktime': '.mov',
                };
                return fileName + (map[mime] || '');
            })();

            const result = await imagekit.upload({
                file: payload,
                fileName: nameWithExt,
            });
            return result;
        } catch (err) {
            console.error('ImageKit upload failed:', err);
            // Attempt local fallback instead of failing hard
            try {
                const local = await saveLocally(file, fileName);
                console.warn('ImageKit failed; saved locally to', local.url);
                return local;
            } catch (localErr) {
                const e = new Error('Image upload failed: ' + (err && err.message ? err.message : JSON.stringify(err)) + ' ; local fallback error: ' + (localErr && localErr.message ? localErr.message : JSON.stringify(localErr)));
                e.cause = { remote: err, local: localErr };
                throw e;
            }
        }
    }

    // Local fallback: write buffer to backend/uploads and return a local URL
    try {
        const safeName = `${fileName}.mp4`;
        const outPath = path.join(uploadsDir, safeName);
        await fs.promises.writeFile(outPath, file);
        const host = process.env.LOCAL_UPLOAD_URL_BASE || 'http://localhost:5000';
        return { url: `${host}/uploads/${safeName}` };
    } catch (err) {
        const e = new Error('Local file save failed: ' + (err && err.message ? err.message : String(err)));
        e.cause = err;
        throw e;
    }
}

async function saveLocally(file, fileName) {
    const safeName = `${fileName}.mp4`;
    const outPath = path.join(uploadsDir, safeName);
    await fs.promises.writeFile(outPath, file);
    const host = process.env.LOCAL_UPLOAD_URL_BASE || 'http://localhost:5000';
    return { url: `${host}/uploads/${safeName}` };
}

module.exports = {
    uploadFile
}
