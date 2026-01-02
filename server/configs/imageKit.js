import ImageKit from "imagekit";
// Debug: print envs used for initialization
console.log('imageKit init ->', {
    publicKey: !!process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: !!process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: !!process.env.IMAGEKIT_URL_ENDPOINT
});

var imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export default imagekit