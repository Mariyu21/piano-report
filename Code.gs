/**
 * ピアノ教室 練習報告ツール（Webアプリ）
 *
 * セットアップ:
 * 1. 新しい Google スプレッドシートを作成し、URL の ID を SPREADSHEET_ID に貼り付け
 * 2. STUDENT_NAMES を教室の生徒名に合わせて編集（空にすれば名前はすべて自由入力）
 * 3. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」で公開
 */

/** 記録先スプレッドシートの ID（URL の /d/ と /edit の間） */
var SPREADSHEET_ID = '1CbUzeqregNDtyS1CqXRXRyddW1mn52oRmt6m6krUZnE';

/** シート名（なければ自動で作成し、1行目に見出しを入れます） */
var SHEET_NAME = '練習報告';

/**
 * 名前の候補（選択式用）。空配列 [] にすると UI は「お名前」テキストのみになります。
 * 「その他」を選んだ場合は自由入力欄の内容が保存されます。
 */
var STUDENT_NAMES = [
  'サンプル 太郎',
  'サンプル 花子',
];

function doGet() {
  try {
    return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('練習報告');
  } catch (e) {
    return HtmlService.createHtmlOutput(
      '<h2>index.html の読み込みに失敗しました</h2>' +
      '<p>Apps Script プロジェクト内に「index.html」が存在するか確認してください。</p>' +
      '<pre>' + String(e && e.message ? e.message : e) + '</pre>'
    );
  }
}

/**
 * クライアントから生徒名リストを取得
 */
function getStudentNames() {
  return STUDENT_NAMES || [];
}

/**
 * 練習報告をスプレッドシートに1行追加
 * @param {Object} data
 * @param {string} data.studentName
 * @param {string} data.practiceTimeLabel 表示用（例: 15分）
 * @param {string} data.piece
 * @param {string} data.message
 */
function submitPracticeReport(data) {
  if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf('ここに') !== -1) {
    throw new Error('Code.gs の SPREADSHEET_ID を設定してください。');
  }

  var name = (data && data.studentName) ? String(data.studentName).trim() : '';
  var piece = (data && data.piece) ? String(data.piece).trim() : '';
  var message = (data && data.message) ? String(data.message).trim() : '';
  var timeLabel = (data && data.practiceTimeLabel) ? String(data.practiceTimeLabel).trim() : '';

  if (!name) {
    throw new Error('生徒のお名前を入力してください。');
  }
  if (!timeLabel) {
    throw new Error('今日の練習時間を選んでください。');
  }
  if (!piece) {
    throw new Error('練習した曲名を入力してください。');
  }

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['記録日時', '生徒名', '練習時間', '曲名', '先生へのメッセージ']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }

  sheet.appendRow([
    new Date(),
    name,
    timeLabel,
    piece,
    message,
  ]);

  return { ok: true };
}
