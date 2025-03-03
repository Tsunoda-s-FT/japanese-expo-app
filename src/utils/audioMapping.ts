/**
 * 音声ファイルのマッピング
 * Expoでは動的なrequire()が使えないため、静的なマッピングが必要
 */
export const audioFiles: { [key: string]: any } = {
    // 旧構造の音声ファイル (互換性のために残す)
    'audio/ohayou_gozaimasu.mp3': require('../../assets/audio/ohayou_gozaimasu.mp3'),
    'audio/ohayou.mp3': require('../../assets/audio/ohayou.mp3'),
    'audio/ohayou_business.mp3': require('../../assets/audio/ohayou_business.mp3'),
    'audio/gozaimasu.mp3': require('../../assets/audio/gozaimasu.mp3'),
    'audio/konnichiwa.mp3': require('../../assets/audio/konnichiwa.mp3'),
    'audio/desu.mp3': require('../../assets/audio/desu.mp3'),
    'audio/kyou.mp3': require('../../assets/audio/kyou.mp3'),
    'audio/watashi.mp3': require('../../assets/audio/watashi.mp3'),
    'audio/watashi_wa_tanaka.mp3': require('../../assets/audio/watashi_wa_tanaka.mp3'),
    'audio/yoroshiku.mp3': require('../../assets/audio/yoroshiku.mp3'),
    'audio/onegai_itashimasu.mp3': require('../../assets/audio/onegai_itashimasu.mp3'),
    'audio/example_morning_1.mp3': require('../../assets/audio/example_morning_1.mp3'),
    'audio/example_konnichiwa_1.mp3': require('../../assets/audio/example_konnichiwa_1.mp3'),
    'audio/example_business_1.mp3': require('../../assets/audio/example_business_1.mp3'),
    'audio/example_intro_1.mp3': require('../../assets/audio/example_intro_1.mp3'),
    'audio/irasshaimase.mp3': require('../../assets/audio/irasshaimase.mp3'),
    
    // 新構造の音声ファイル - レッスン：挨拶
    'assets/contents/lesson_greetings/audio/arigatou.mp3': require('../../assets/contents/lesson_greetings/audio/arigatou.mp3'),
    'assets/contents/lesson_greetings/audio/arigatou_gozaimasu.mp3': require('../../assets/contents/lesson_greetings/audio/arigatou_gozaimasu.mp3'),
    'assets/contents/lesson_greetings/audio/doumo_arigatou_gozaimasu.mp3': require('../../assets/contents/lesson_greetings/audio/doumo_arigatou_gozaimasu.mp3'),
    'assets/contents/lesson_greetings/audio/ja_mata.mp3': require('../../assets/contents/lesson_greetings/audio/ja_mata.mp3'),
    'assets/contents/lesson_greetings/audio/konbanwa.mp3': require('../../assets/contents/lesson_greetings/audio/konbanwa.mp3'),
    'assets/contents/lesson_greetings/audio/konnichiwa.mp3': require('../../assets/contents/lesson_greetings/audio/konnichiwa.mp3'),
    'assets/contents/lesson_greetings/audio/ohayou.mp3': require('../../assets/contents/lesson_greetings/audio/ohayou.mp3'),
    'assets/contents/lesson_greetings/audio/ohayou_gozaimasu.mp3': require('../../assets/contents/lesson_greetings/audio/ohayou_gozaimasu.mp3'),
    'assets/contents/lesson_greetings/audio/sayounara.mp3': require('../../assets/contents/lesson_greetings/audio/sayounara.mp3'),
    
    // 例文音声
    'assets/contents/lesson_greetings/audio/examples/ex_arigatou_dialog_1.mp3': require('../../assets/contents/lesson_greetings/audio/examples/ex_arigatou_dialog_1.mp3'),
    'assets/contents/lesson_greetings/audio/examples/ex_konbanwa_dialog_1.mp3': require('../../assets/contents/lesson_greetings/audio/examples/ex_konbanwa_dialog_1.mp3'),
    'assets/contents/lesson_greetings/audio/examples/ex_konnichiwa_dialog_1.mp3': require('../../assets/contents/lesson_greetings/audio/examples/ex_konnichiwa_dialog_1.mp3'),
    'assets/contents/lesson_greetings/audio/examples/ex_ohayou_dialog_1.mp3': require('../../assets/contents/lesson_greetings/audio/examples/ex_ohayou_dialog_1.mp3'),
    'assets/contents/lesson_greetings/audio/examples/ex_ohayou_dialog_2.mp3': require('../../assets/contents/lesson_greetings/audio/examples/ex_ohayou_dialog_2.mp3'),
    'assets/contents/lesson_greetings/audio/examples/ex_sayounara_dialog_1.mp3': require('../../assets/contents/lesson_greetings/audio/examples/ex_sayounara_dialog_1.mp3'),
    
    // レッスン：ビジネス
    'assets/contents/lesson_business/audio/moushiwake_arimasen.mp3': require('../../assets/contents/lesson_business/audio/moushiwake_arimasen.mp3'),
    'assets/contents/lesson_business/audio/moushiwake_gozaimasen.mp3': require('../../assets/contents/lesson_business/audio/moushiwake_gozaimasen.mp3'),
    'assets/contents/lesson_business/audio/omedetou_gozaimasu.mp3': require('../../assets/contents/lesson_business/audio/omedetou_gozaimasu.mp3'),
    'assets/contents/lesson_business/audio/omedetou.mp3': require('../../assets/contents/lesson_business/audio/omedetou.mp3'),
    'assets/contents/lesson_business/audio/otsukaresama_deshita.mp3': require('../../assets/contents/lesson_business/audio/otsukaresama_deshita.mp3'),
    'assets/contents/lesson_business/audio/otsukaresama_desu.mp3': require('../../assets/contents/lesson_business/audio/otsukaresama_desu.mp3'),
    'assets/contents/lesson_business/audio/shitsurei_itashimasu.mp3': require('../../assets/contents/lesson_business/audio/shitsurei_itashimasu.mp3'),
    'assets/contents/lesson_business/audio/shitsurei_shimasu.mp3': require('../../assets/contents/lesson_business/audio/shitsurei_shimasu.mp3'),
    'assets/contents/lesson_business/audio/yoroshiku_onegaiitashimasu.mp3': require('../../assets/contents/lesson_business/audio/yoroshiku_onegaiitashimasu.mp3'),
    'assets/contents/lesson_business/audio/yoroshiku_onegaishimasu.mp3': require('../../assets/contents/lesson_business/audio/yoroshiku_onegaishimasu.mp3'),
    
    // ビジネス例文
    'assets/contents/lesson_business/audio/examples/ex_moushiwake_dialog_1.mp3': require('../../assets/contents/lesson_business/audio/examples/ex_moushiwake_dialog_1.mp3'),
    'assets/contents/lesson_business/audio/examples/ex_omedetou_dialog_1.mp3': require('../../assets/contents/lesson_business/audio/examples/ex_omedetou_dialog_1.mp3'),
    'assets/contents/lesson_business/audio/examples/ex_otsukaresama_dialog_1.mp3': require('../../assets/contents/lesson_business/audio/examples/ex_otsukaresama_dialog_1.mp3'),
    'assets/contents/lesson_business/audio/examples/ex_shitsurei_dialog_1.mp3': require('../../assets/contents/lesson_business/audio/examples/ex_shitsurei_dialog_1.mp3'),
    'assets/contents/lesson_business/audio/examples/ex_yoroshiku_dialog_1.mp3': require('../../assets/contents/lesson_business/audio/examples/ex_yoroshiku_dialog_1.mp3'),
    
    // レッスン：レストラン
    'assets/contents/lesson_restaurant/audio/chumon_onegaishimasu.mp3': require('../../assets/contents/lesson_restaurant/audio/chumon_onegaishimasu.mp3'),
    'assets/contents/lesson_restaurant/audio/gochisousama_deshita.mp3': require('../../assets/contents/lesson_restaurant/audio/gochisousama_deshita.mp3'),
    'assets/contents/lesson_restaurant/audio/gochisousama.mp3': require('../../assets/contents/lesson_restaurant/audio/gochisousama.mp3'),
    'assets/contents/lesson_restaurant/audio/irasshaimase.mp3': require('../../assets/contents/lesson_restaurant/audio/irasshaimase.mp3'),
    'assets/contents/lesson_restaurant/audio/kore_kudasai.mp3': require('../../assets/contents/lesson_restaurant/audio/kore_kudasai.mp3'),
    'assets/contents/lesson_restaurant/audio/menu_onegaishimasu.mp3': require('../../assets/contents/lesson_restaurant/audio/menu_onegaishimasu.mp3'),
    'assets/contents/lesson_restaurant/audio/oishii_desu.mp3': require('../../assets/contents/lesson_restaurant/audio/oishii_desu.mp3'),
    'assets/contents/lesson_restaurant/audio/oishii.mp3': require('../../assets/contents/lesson_restaurant/audio/oishii.mp3'),
    'assets/contents/lesson_restaurant/audio/okaikei_onegaishimasu.mp3': require('../../assets/contents/lesson_restaurant/audio/okaikei_onegaishimasu.mp3'),
    'assets/contents/lesson_restaurant/audio/osusume_wa_nan_desu_ka.mp3': require('../../assets/contents/lesson_restaurant/audio/osusume_wa_nan_desu_ka.mp3'),
  
    // レストラン例文
    'assets/contents/lesson_restaurant/audio/examples/ex_chumon_dialog_1.mp3': require('../../assets/contents/lesson_restaurant/audio/examples/ex_chumon_dialog_1.mp3'),
    'assets/contents/lesson_restaurant/audio/examples/ex_gochisousama_dialog_1.mp3': require('../../assets/contents/lesson_restaurant/audio/examples/ex_gochisousama_dialog_1.mp3'),
    'assets/contents/lesson_restaurant/audio/examples/ex_irasshaimase_dialog_1.mp3': require('../../assets/contents/lesson_restaurant/audio/examples/ex_irasshaimase_dialog_1.mp3'),
    'assets/contents/lesson_restaurant/audio/examples/ex_kore_dialog_1.mp3': require('../../assets/contents/lesson_restaurant/audio/examples/ex_kore_dialog_1.mp3'),
    'assets/contents/lesson_restaurant/audio/examples/ex_menu_dialog_1.mp3': require('../../assets/contents/lesson_restaurant/audio/examples/ex_menu_dialog_1.mp3'),
    'assets/contents/lesson_restaurant/audio/examples/ex_oishii_dialog_1.mp3': require('../../assets/contents/lesson_restaurant/audio/examples/ex_oishii_dialog_1.mp3'),
    'assets/contents/lesson_restaurant/audio/examples/ex_okaikei_dialog_1.mp3': require('../../assets/contents/lesson_restaurant/audio/examples/ex_okaikei_dialog_1.mp3'),
    'assets/contents/lesson_restaurant/audio/examples/ex_osusume_dialog_1.mp3': require('../../assets/contents/lesson_restaurant/audio/examples/ex_osusume_dialog_1.mp3')
  };