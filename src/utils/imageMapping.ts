/**
 * 画像ファイルのマッピング
 * Expoでは動的なrequire()が使えないため、静的なマッピングが必要
 */
export const imageFiles: { [key: string]: any } = {
    // 旧構造の画像ファイル (互換性のために残す)
    'images/lessons/ojigi_aisatsu_business_woman.png': require('../../assets/images/lessons/ojigi_aisatsu_business_woman.png'),
    'images/placeholder.png': require('../../assets/images/placeholder.png'),
    
    // 新構造の画像ファイル - 共通
    'assets/adaptive-icon.png': require('../../assets/adaptive-icon.png'),
    'assets/favicon.png': require('../../assets/favicon.png'),
    'assets/icon.png': require('../../assets/icon.png'),
    'assets/splash-icon.png': require('../../assets/splash-icon.png'),
    
    // レッスン：挨拶
    'assets/contents/lesson_greetings/images/thumbnail.png': require('../../assets/contents/lesson_greetings/images/thumbnail.png'),
    
    // アイコン
    'assets/contents/lesson_greetings/images/icons/farewell_icon.png': require('../../assets/contents/lesson_greetings/images/icons/farewell_icon.png'),
    'assets/contents/lesson_greetings/images/icons/gratitude_icon.png': require('../../assets/contents/lesson_greetings/images/icons/gratitude_icon.png'),
    'assets/contents/lesson_greetings/images/icons/time_day.png': require('../../assets/contents/lesson_greetings/images/icons/time_day.png'),
    'assets/contents/lesson_greetings/images/icons/time_evening.png': require('../../assets/contents/lesson_greetings/images/icons/time_evening.png'),
    'assets/contents/lesson_greetings/images/icons/time_morning.png': require('../../assets/contents/lesson_greetings/images/icons/time_morning.png'),
    
    // イラスト
    'assets/contents/lesson_greetings/images/illustrations/farewell.png': require('../../assets/contents/lesson_greetings/images/illustrations/farewell.png'),
    'assets/contents/lesson_greetings/images/illustrations/greeting_daytime.png': require('../../assets/contents/lesson_greetings/images/illustrations/greeting_daytime.png'),
    'assets/contents/lesson_greetings/images/illustrations/greeting_evening.png': require('../../assets/contents/lesson_greetings/images/illustrations/greeting_evening.png'),
    'assets/contents/lesson_greetings/images/illustrations/greeting_morning.png': require('../../assets/contents/lesson_greetings/images/illustrations/greeting_morning.png'),
    'assets/contents/lesson_greetings/images/illustrations/thanking.png': require('../../assets/contents/lesson_greetings/images/illustrations/thanking.png'),
    
    // レッスン：ビジネス
    'assets/contents/lesson_business/images/thumbnail.png': require('../../assets/contents/lesson_business/images/thumbnail.png'),
    
    // アイコン
    'assets/contents/lesson_business/images/icons/apology_icon.png': require('../../assets/contents/lesson_business/images/icons/apology_icon.png'),
    'assets/contents/lesson_business/images/icons/celebration_icon.png': require('../../assets/contents/lesson_business/images/icons/celebration_icon.png'),
    'assets/contents/lesson_business/images/icons/entering_icon.png': require('../../assets/contents/lesson_business/images/icons/entering_icon.png'),
    'assets/contents/lesson_business/images/icons/greeting_icon.png': require('../../assets/contents/lesson_business/images/icons/greeting_icon.png'),
    'assets/contents/lesson_business/images/icons/request_icon.png': require('../../assets/contents/lesson_business/images/icons/request_icon.png'),
    
    // イラスト
    'assets/contents/lesson_business/images/illustrations/apologizing.png': require('../../assets/contents/lesson_business/images/illustrations/apologizing.png'),
    'assets/contents/lesson_business/images/illustrations/bowing.png': require('../../assets/contents/lesson_business/images/illustrations/bowing.png'),
    'assets/contents/lesson_business/images/illustrations/congratulating.png': require('../../assets/contents/lesson_business/images/illustrations/congratulating.png'),
    'assets/contents/lesson_business/images/illustrations/entering_room.png': require('../../assets/contents/lesson_business/images/illustrations/entering_room.png'),
    'assets/contents/lesson_business/images/illustrations/office_greeting.png': require('../../assets/contents/lesson_business/images/illustrations/office_greeting.png'),
    
    // レッスン：レストラン
    'assets/contents/lesson_restaurant/images/thumbnail.png': require('../../assets/contents/lesson_restaurant/images/thumbnail.png'),
    
    // アイコン
    'assets/contents/lesson_restaurant/images/icons/menu_icon.png': require('../../assets/contents/lesson_restaurant/images/icons/menu_icon.png'),
    'assets/contents/lesson_restaurant/images/icons/order_icon.png': require('../../assets/contents/lesson_restaurant/images/icons/order_icon.png'),
    'assets/contents/lesson_restaurant/images/icons/payment_icon.png': require('../../assets/contents/lesson_restaurant/images/icons/payment_icon.png'),
    'assets/contents/lesson_restaurant/images/icons/question_icon.png': require('../../assets/contents/lesson_restaurant/images/icons/question_icon.png'),
    'assets/contents/lesson_restaurant/images/icons/tasty_icon.png': require('../../assets/contents/lesson_restaurant/images/icons/tasty_icon.png'),
    'assets/contents/lesson_restaurant/images/icons/thanks_icon.png': require('../../assets/contents/lesson_restaurant/images/icons/thanks_icon.png'),
    'assets/contents/lesson_restaurant/images/icons/welcome_icon.png': require('../../assets/contents/lesson_restaurant/images/icons/welcome_icon.png'),
    
    // イラスト
    'assets/contents/lesson_restaurant/images/illustrations/after_meal.png': require('../../assets/contents/lesson_restaurant/images/illustrations/after_meal.png'),
    'assets/contents/lesson_restaurant/images/illustrations/bill_payment.png': require('../../assets/contents/lesson_restaurant/images/illustrations/bill_payment.png'),
    'assets/contents/lesson_restaurant/images/illustrations/enjoying_food.png': require('../../assets/contents/lesson_restaurant/images/illustrations/enjoying_food.png'),
    'assets/contents/lesson_restaurant/images/illustrations/ordering.png': require('../../assets/contents/lesson_restaurant/images/illustrations/ordering.png'),
    'assets/contents/lesson_restaurant/images/illustrations/pointing_menu.png': require('../../assets/contents/lesson_restaurant/images/illustrations/pointing_menu.png'),
    'assets/contents/lesson_restaurant/images/illustrations/recommendation.png': require('../../assets/contents/lesson_restaurant/images/illustrations/recommendation.png'),
    'assets/contents/lesson_restaurant/images/illustrations/request_menu.png': require('../../assets/contents/lesson_restaurant/images/illustrations/request_menu.png'),
    'assets/contents/lesson_restaurant/images/illustrations/restaurant_welcome.png': require('../../assets/contents/lesson_restaurant/images/illustrations/restaurant_welcome.png')
  };