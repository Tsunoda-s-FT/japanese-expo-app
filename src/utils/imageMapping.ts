/**
 * 画像ファイルのマッピング
 * Expoでは動的なrequire()が使えないため、静的なマッピングが必要
 */

// プレースホルダー画像の実体を定義
const PLACEHOLDER_IMAGE = require('../../assets/images/placeholder.png');

// 現時点で存在することが確認できている画像のみをマッピング
export const imageFiles: { [key: string]: any } = {
    // プレースホルダー画像（常に存在することを確認）
    'images/placeholder.png': PLACEHOLDER_IMAGE,
    
    // 旧構造の画像ファイル (互換性のために残す)
    'images/lessons/ojigi_aisatsu_business_woman.png': require('../../assets/images/lessons/ojigi_aisatsu_business_woman.png'),
    
    // 新構造の画像ファイル - 共通
    'assets/adaptive-icon.png': require('../../assets/adaptive-icon.png'),
    'assets/favicon.png': require('../../assets/favicon.png'),
    'assets/icon.png': require('../../assets/icon.png'),
    'assets/splash-icon.png': require('../../assets/splash-icon.png'),
    
    // 注意: 以下の空ファイルはプレースホルダーで代用されます
    // 空ファイルへの直接的なrequireは削除し、実行時にgetImageSourceが
    // プレースホルダー画像を返すようにします
};

// 実際のファイルパスとプレースホルダーのマッピング
// ファイルが存在しない場合に使用されるマッピング
export const defaultImages: { [key: string]: any } = {
    // レッスン：挨拶
    'assets/contents/lesson_greetings/images/thumbnail.png': PLACEHOLDER_IMAGE,
    
    // アイコン
    'assets/contents/lesson_greetings/images/icons/farewell_icon.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_greetings/images/icons/gratitude_icon.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_greetings/images/icons/time_day.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_greetings/images/icons/time_evening.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_greetings/images/icons/time_morning.png': PLACEHOLDER_IMAGE,
    
    // イラスト
    'assets/contents/lesson_greetings/images/illustrations/farewell.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_greetings/images/illustrations/greeting_daytime.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_greetings/images/illustrations/greeting_evening.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_greetings/images/illustrations/greeting_morning.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_greetings/images/illustrations/thanking.png': PLACEHOLDER_IMAGE,
    
    // レッスン：ビジネス
    'assets/contents/lesson_business/images/thumbnail.png': PLACEHOLDER_IMAGE,
    
    // アイコン
    'assets/contents/lesson_business/images/icons/apology_icon.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_business/images/icons/celebration_icon.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_business/images/icons/entering_icon.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_business/images/icons/greeting_icon.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_business/images/icons/request_icon.png': PLACEHOLDER_IMAGE,
    
    // イラスト
    'assets/contents/lesson_business/images/illustrations/apologizing.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_business/images/illustrations/bowing.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_business/images/illustrations/congratulating.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_business/images/illustrations/entering_room.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_business/images/illustrations/office_greeting.png': PLACEHOLDER_IMAGE,
    
    // レッスン：レストラン
    'assets/contents/lesson_restaurant/images/thumbnail.png': PLACEHOLDER_IMAGE,
    
    // アイコン
    'assets/contents/lesson_restaurant/images/icons/menu_icon.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_restaurant/images/icons/order_icon.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_restaurant/images/icons/payment_icon.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_restaurant/images/icons/question_icon.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_restaurant/images/icons/tasty_icon.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_restaurant/images/icons/thanks_icon.png': PLACEHOLDER_IMAGE,
    'assets/contents/lesson_restaurant/images/icons/welcome_icon.png': PLACEHOLDER_IMAGE,
};