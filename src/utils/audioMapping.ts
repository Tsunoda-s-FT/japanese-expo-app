/**
 * 音声ファイルのマッピング
 * Expoでは動的なrequire()が使えないため、静的なマッピングが必要
 */

// プレースホルダー音声の実体を定義
const PLACEHOLDER_AUDIO = require('../../assets/audio/placeholder.mp3');

// 現時点で存在することが確認できている音声のみをマッピング
export const audioFiles: { [key: string]: any } = {
    // プレースホルダー音声（常に存在することを確認）
    'audio/placeholder.mp3': PLACEHOLDER_AUDIO,
    
    // 旧構造の音声ファイル (互換性のために残す)
    'audio/ohayou.mp3': PLACEHOLDER_AUDIO,
    'audio/ohayou_business.mp3': PLACEHOLDER_AUDIO,
    'audio/gozaimasu.mp3': PLACEHOLDER_AUDIO,
    'audio/konnichiwa.mp3': PLACEHOLDER_AUDIO,
    'audio/desu.mp3': PLACEHOLDER_AUDIO,
    'audio/kyou.mp3': PLACEHOLDER_AUDIO,
    'audio/watashi.mp3': PLACEHOLDER_AUDIO,
    'audio/watashi_wa_tanaka.mp3': PLACEHOLDER_AUDIO,
    'audio/yoroshiku.mp3': PLACEHOLDER_AUDIO,
    'audio/onegai_itashimasu.mp3': PLACEHOLDER_AUDIO,
    'audio/example_morning_1.mp3': PLACEHOLDER_AUDIO,
    'audio/example_konnichiwa_1.mp3': PLACEHOLDER_AUDIO,
    'audio/example_business_1.mp3': PLACEHOLDER_AUDIO,
    'audio/example_intro_1.mp3': PLACEHOLDER_AUDIO,
    'audio/irasshaimase.mp3': PLACEHOLDER_AUDIO,
    
    // 実際のコンテンツ - レッスン：挨拶
    'assets/contents/lesson_greetings/audio/ohayou_gozaimasu.mp3': require('../../assets/contents/lesson_greetings/audio/ohayou_gozaimasu.mp3'),
    
    // 実際のコンテンツ - レッスン：レストラン
    'assets/contents/lesson_restaurant/audio/irasshaimase.mp3': require('../../assets/contents/lesson_restaurant/audio/irasshaimase.mp3'),
};

// 実際のファイルパスとプレースホルダーのマッピング
// ファイルが存在しない場合に使用されるマッピング
export const defaultAudios: { [key: string]: any } = {
    // レッスン：挨拶
    'assets/contents/lesson_greetings/audio/arigatou.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_greetings/audio/arigatou_gozaimasu.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_greetings/audio/doumo_arigatou_gozaimasu.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_greetings/audio/ja_mata.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_greetings/audio/konbanwa.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_greetings/audio/konnichiwa.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_greetings/audio/ohayou.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_greetings/audio/sayounara.mp3': PLACEHOLDER_AUDIO,
    
    // 挨拶レッスン例文音声
    'assets/contents/lesson_greetings/audio/examples/ex_arigatou_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_greetings/audio/examples/ex_konbanwa_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_greetings/audio/examples/ex_konnichiwa_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_greetings/audio/examples/ex_ohayou_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_greetings/audio/examples/ex_ohayou_dialog_2.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_greetings/audio/examples/ex_sayounara_dialog_1.mp3': PLACEHOLDER_AUDIO,
    
    // レッスン：ビジネス
    'assets/contents/lesson_business/audio/moushiwake_arimasen.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/moushiwake_gozaimasen.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/omedetou_gozaimasu.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/omedetou.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/otsukaresama_deshita.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/otsukaresama_desu.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/shitsurei_itashimasu.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/shitsurei_shimasu.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/yoroshiku_onegaiitashimasu.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/yoroshiku_onegaishimasu.mp3': PLACEHOLDER_AUDIO,
    
    // ビジネスレッスン例文音声
    'assets/contents/lesson_business/audio/examples/ex_congratulations_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/examples/ex_entering_room_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/examples/ex_morning_greeting_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/examples/ex_sorry_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/examples/ex_yoroshiku_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/examples/ex_moushiwake_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/examples/ex_omedetou_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/examples/ex_otsukaresama_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_business/audio/examples/ex_shitsurei_dialog_1.mp3': PLACEHOLDER_AUDIO,
    
    // レッスン：レストラン
    'assets/contents/lesson_restaurant/audio/chumon_onegaishimasu.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/gochisousama_deshita.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/gochisousama.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/kore_kudasai.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/menu_onegaishimasu.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/oishii_desu.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/oishii.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/okaikei_onegaishimasu.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/osusume_wa_nan_desu_ka.mp3': PLACEHOLDER_AUDIO,
    
    // レストランレッスン例文音声
    'assets/contents/lesson_restaurant/audio/examples/ex_chumon_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/examples/ex_gochisousama_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/examples/ex_irasshaimase_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/examples/ex_kore_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/examples/ex_menu_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/examples/ex_oishii_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/examples/ex_okaikei_dialog_1.mp3': PLACEHOLDER_AUDIO,
    'assets/contents/lesson_restaurant/audio/examples/ex_osusume_dialog_1.mp3': PLACEHOLDER_AUDIO,
};