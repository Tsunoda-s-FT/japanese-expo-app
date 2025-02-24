// src/utils/errorUtils.ts
// アプリ全体で一貫したエラーハンドリングとロギングを行うためのユーティリティ

type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

interface ErrorLogEntry {
  message: string;
  severity: ErrorSeverity;
  timestamp: Date;
  data?: any;
  error?: Error;
}

// エラーログを一時的に保存
const errorLogs: ErrorLogEntry[] = [];

/**
 * アプリ内でのエラーをログに記録する
 */
export function logError(
  message: string,
  severity: ErrorSeverity = 'error',
  data?: any,
  error?: Error
): void {
  const entry: ErrorLogEntry = {
    message,
    severity,
    timestamp: new Date(),
    data,
    error,
  };

  // 開発環境ではコンソールに出力
  if (__DEV__) {
    console.group(`[${severity.toUpperCase()}] ${message}`);
    if (data) console.log('Data:', data);
    if (error) console.error('Error:', error);
    console.groupEnd();
  }

  // エラーログを保存
  errorLogs.push(entry);

  // ログの最大数を制限（最新の100件のみ保持）
  if (errorLogs.length > 100) {
    errorLogs.shift();
  }

  // 本番環境なら外部サービスに送信するコードをここに追加
  // (例: Firebase Crashlytics, Sentry など)
}

/**
 * エラーを表示する形式に変換する
 */
export function formatError(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return JSON.stringify(error);
}

/**
 * エラーログを取得する
 */
export function getErrorLogs(): ErrorLogEntry[] {
  return [...errorLogs];
}

/**
 * エラーログをクリアする
 */
export function clearErrorLogs(): void {
  errorLogs.length = 0;
} 