// src/utils/formatUtils.ts
// アプリ全体で日付やテキストの一貫したフォーマットを行うためのユーティリティ

/**
 * 日付を日本語形式でフォーマットする
 * @param date フォーマットする日付
 * @param includeTime 時間を含めるかどうか
 * @returns フォーマットされた日付文字列
 */
export function formatJapaneseDate(date: Date | string, includeTime: boolean = false): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('ja-JP', options).format(d);
}

/**
 * 日付を相対時間（〜分前、〜時間前など）でフォーマットする
 * @param date フォーマットする日付
 * @returns 相対時間の文字列
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return 'たった今';
  } else if (diffMin < 60) {
    return `${diffMin}分前`;
  } else if (diffHour < 24) {
    return `${diffHour}時間前`;
  } else if (diffDay < 7) {
    return `${diffDay}日前`;
  } else {
    return formatJapaneseDate(d);
  }
}

/**
 * 進捗率を表示用の文字列にフォーマットする
 * @param progress 0 to 1 の進捗値
 * @returns パーセンテージ文字列
 */
export function formatProgress(progress: number): string {
  const percentage = Math.round(progress * 100);
  return `${percentage}%`;
}

/**
 * テキストを省略して表示する
 * @param text 元のテキスト
 * @param maxLength 最大長
 * @returns 省略されたテキスト
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
} 