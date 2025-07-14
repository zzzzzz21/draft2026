import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 現在のモジュールのディレクトリパスを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 画像の圧縮処理を実行する関数
async function compressImages(inputDir, outputDir) {
  const files = await fs.promises.readdir(inputDir);

  // 入力ディレクトリ内のファイルを順に処理
  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const fileExt = path.extname(file).toLowerCase();

    // ファイルのステータスを取得して更新日時をチェック
    const stats = await fs.promises.stat(filePath);

    if(stats.isDirectory()) {
       // ディレクトリの場合は再帰的に処理を繰り返す
      const subOutputDir = path.join(outputDir, file);
      await fs.promises.mkdir(subOutputDir, { recursive: true });
      await compressImages(filePath, subOutputDir);
    } else {
      const outputFilePath = path.join(outputDir, file);
      switch (fileExt) {
        case '.jpg':
        case '.jpeg':
          await sharp(filePath)
            .jpeg({ quality: 100 })
            .toFile(outputFilePath)
            .catch((err) => console.error(`Error compressing image ${filePath}:`, err));
          break;
        case '.png':
          await sharp(filePath)
            .png({ compressionLevel: 6 })
            .toFile(outputFilePath)
            .catch((err) => console.error(`Error compressing image ${filePath}:`, err));
          break;
        case '.gif':
        case '.svg':
          await sharp(filePath)
            .toFile(outputFilePath)
            .catch((err) => console.error(`Error compressing image ${filePath}:`, err));
          break;

        default:
          break;
      }
    }
  }
}

// 画像の圧縮処理を実行
const inputDir = path.join(__dirname, 'src/images');
const outputDir = path.join(__dirname, 'dist/img');
await fs.promises.mkdir(outputDir, { recursive: true }); // 出力ディレクトリの作成
await compressImages(inputDir, outputDir);
console.log('Image compression completed.');
