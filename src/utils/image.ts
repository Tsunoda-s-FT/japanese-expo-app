import { imageFiles, defaultImages } from './imageMapping';

// プレースホルダー画像の参照
const PLACEHOLDER_IMAGE = imageFiles['images/placeholder.png'];

/**
 * 画像のパスから画像ソースを取得する関数
 * Expoでは動的なrequireが使えないため、事前に定義したマッピングから取得
 * 空ファイルエラーを許容するために改良
 * 
 * @param path 画像パス (相対パスまたは絶対パス)
 * @returns 画像ソース (require済み)、または空の場合はプレースホルダー画像
 */
export function getImageSource(path: string | undefined): any {
  if (!path) {
    // パスが未定義の場合はプレースホルダー画像を返す
    return PLACEHOLDER_IMAGE;
  }
  
  try {
    // 1. まず、マッピングされた実際の画像があるか確認
    const imageSource = imageFiles[path];
    if (imageSource) {
      return imageSource;
    }
    
    // 2. 次に、defaultImagesにマッピングがあるか確認
    // (空ファイルやまだ実装されていないファイル用)
    const defaultImage = defaultImages[path];
    if (defaultImage) {
      console.log(`Using placeholder for: ${path}`);
      return defaultImage;
    }
    
    // 3. どちらのマッピングにもない場合はプレースホルダーを返す
    console.warn(`Image not found in any mapping: ${path}, using default placeholder`);
    return PLACEHOLDER_IMAGE;
  } catch (error) {
    // 画像ロード中のエラーをキャッチし、アプリがクラッシュしないようにする
    console.warn(`Error loading image: ${path}, using placeholder`, error);
    return PLACEHOLDER_IMAGE;
  }
}

/**
 * 画像が有効かどうかを確認する関数
 * プレースホルダー画像も有効な画像として扱います
 * 
 * @param path 画像パス
 * @returns 常にtrue（すべての画像パスを有効として扱う）
 */
export function isValidImage(path: string | undefined): boolean {
  // 常にtrue - プレースホルダーもしくは要求された画像を表示するため
  return true;
}