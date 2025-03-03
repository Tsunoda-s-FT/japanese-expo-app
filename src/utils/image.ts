import { imageFiles } from './imageMapping';

/**
 * 画像のパスから画像ソースを取得する関数
 * Expoでは動的なrequireが使えないため、事前に定義したマッピングから取得
 * 
 * @param path 画像パス (相対パスまたは絶対パス)
 * @returns 画像ソース (require済み)
 */
export function getImageSource(path: string | undefined): any {
  if (!path) {
    // パスが未定義の場合はプレースホルダーを返す
    return imageFiles['images/placeholder.png'];
  }
  
  // 絶対パス（assets/contents/...）の場合はそのまま使用
  if (path.startsWith('assets/')) {
    const imageSource = imageFiles[path];
    if (imageSource) {
      return imageSource;
    }
  }
  
  // 相対パス（旧形式）の場合はそのまま検索
  const imageSource = imageFiles[path];
  if (imageSource) {
    return imageSource;
  }
  
  // 見つからない場合はプレースホルダー画像を返す
  console.warn(`Image not found: ${path}`);
  return imageFiles['images/placeholder.png'];
}