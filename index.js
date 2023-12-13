const { admin, FIREBASE_STORAGE_BUCKET } = require("./firebase");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const FIRESTORE_COLLECTION = "stickers"; // C'est ici que les stickers seront stockés


(async () => {
  for (const folder of [
    "love-expression",
    "valentines-day-stickers",
  ]) {
    for (const format of ["png"]) {
      const root = `./${folder}/${format}`;
      // list all files
      const stickers = fs.readdirSync(root);
      for (const sticker of stickers) {
        const path = `${root}/${sticker}`;
        const fileContent = fs.readFileSync(path);

        const [filename, ext] = sticker.split(".");
        const name = `${slugify(filename)}.${ext}`;

        // Create a new blob in the bucket and upload the file data.
        const blobSticker = admin.storage().bucket().file(`stickers/${name}`);
        const uuidSticker = uuidv4();
        await blobSticker.save(fileContent, {
          resumable: false,
          validation: "md5",
          metadata: {
            metadata: {
              firebaseStorageDownloadTokens: uuidSticker,
            },
          },
        });

        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(
          blobSticker.name
        )}?alt=media&token=${uuidSticker}`;

        try {
          await admin.firestore().collection(FIRESTORE_COLLECTION).doc(uuidSticker).set({
            path: imageUrl,
            name: name,
            collection: folder,
            format,
            id: uuidSticker,
          });
          console.log(`upload of ${name} success`);
        } catch (error) {
          console.log(`Something went wrong. Error : ${error.message}`);
        }
      }
    }
  }
})();


function slugify (str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with a single -
    .replace(/^-+/, "") // Trim - from the start of the text
    .replace(/-+$/, ""); // Trim - from the end of the text
};