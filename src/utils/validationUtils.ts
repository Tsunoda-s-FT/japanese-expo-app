// src/utils/validationUtils.ts
// フォーム入力のバリデーションを行うユーティリティ関数

/**
 * メールアドレスの形式を検証する
 * @param email 検証するメールアドレス
 * @returns 有効なメールアドレスの場合はtrue、そうでない場合はfalse
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * パスワードの強度を検証する
 * @param password 検証するパスワード
 * @returns エラーメッセージ（問題がなければnull）
 */
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'パスワードを入力してください';
  }
  
  if (password.length < 8) {
    return 'パスワードは8文字以上である必要があります';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'パスワードには少なくとも1つの大文字を含める必要があります';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'パスワードには少なくとも1つの小文字を含める必要があります';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'パスワードには少なくとも1つの数字を含める必要があります';
  }
  
  return null; // エラーなし
};

/**
 * 必須入力項目を検証する
 * @param value 検証する値
 * @param fieldName フィールド名（エラーメッセージに使用）
 * @returns エラーメッセージ（問題がなければnull）
 */
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName}を入力してください`;
  }
  return null;
};

/**
 * 文字列の長さを検証する
 * @param value 検証する値
 * @param min 最小文字数
 * @param max 最大文字数
 * @param fieldName フィールド名（エラーメッセージに使用）
 * @returns エラーメッセージ（問題がなければnull）
 */
export const validateLength = (
  value: string,
  min: number,
  max: number,
  fieldName: string
): string | null => {
  if (!value) {
    return null; // 空の場合は別のバリデーションで処理
  }
  
  if (value.length < min) {
    return `${fieldName}は${min}文字以上である必要があります`;
  }
  
  if (value.length > max) {
    return `${fieldName}は${max}文字以下である必要があります`;
  }
  
  return null;
};

/**
 * 数値の範囲を検証する
 * @param value 検証する値
 * @param min 最小値
 * @param max 最大値
 * @param fieldName フィールド名（エラーメッセージに使用）
 * @returns エラーメッセージ（問題がなければnull）
 */
export const validateNumberRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string
): string | null => {
  if (value < min) {
    return `${fieldName}は${min}以上である必要があります`;
  }
  
  if (value > max) {
    return `${fieldName}は${max}以下である必要があります`;
  }
  
  return null;
};

/**
 * 電話番号の形式を検証する（日本の電話番号形式）
 * @param phoneNumber 検証する電話番号
 * @returns 有効な電話番号の場合はtrue、そうでない場合はfalse
 */
export const validateJapanesePhoneNumber = (phoneNumber: string): boolean => {
  // 日本の電話番号パターン（ハイフンあり・なし両対応）
  const re = /^(0[0-9]{1,4}-[0-9]{1,4}-[0-9]{3,4}|0[0-9]{9,10})$/;
  return re.test(phoneNumber);
};

/**
 * 郵便番号の形式を検証する（日本の郵便番号形式）
 * @param postalCode 検証する郵便番号
 * @returns 有効な郵便番号の場合はtrue、そうでない場合はfalse
 */
export const validateJapanesePostalCode = (postalCode: string): boolean => {
  // 日本の郵便番号パターン（ハイフンあり・なし両対応）
  const re = /^([0-9]{3}-[0-9]{4}|[0-9]{7})$/;
  return re.test(postalCode);
}; 