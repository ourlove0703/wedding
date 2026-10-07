/**
 * 청첩장 ↔ 구글 시트 연결 코드 (참석 여부 · 방명록)
 *
 * 사용법 (자세한 건 README.md 2단계)
 *  1. 구글 시트를 새로 만들고  확장 프로그램 → Apps Script  를 엽니다.
 *  2. 이 파일 내용을 통째로 붙여넣고 저장합니다.
 *  3. 위쪽 함수 선택에서  setup  을 고르고 ▶실행 → 권한 허용.  (시트 3개가 자동으로 만들어집니다)
 *  4. 배포 → 새 배포 → 유형: 웹 앱 / 실행: 나 / 액세스: 모든 사용자 → 배포 → 웹 앱 URL 복사
 *  5. 복사한 URL 을 청첩장 config.js 의  api: ""  안에 붙여넣습니다.
 *
 * 시트에서 직접 할 수 있는 일
 *  - 방명록 글 숨기기: '방명록' 시트의 '숨김' 칸에 아무 글자나 입력 (예: o)  → 30초 안에 화면에서 사라짐
 *  - 방명록 글 지우기: 그 행을 통째로 삭제
 *  - 참석 집계: '요약' 시트에 자동 계산
 *  - 테스트 응답 지우기: '참석응답'·'방명록' 탭에서 2행부터 아래를 행 삭제 ('요약'은 자동으로 0이 됨)
 */

const RSVP = '참석응답';
const GB = '방명록';
const SUM = '요약';
const RSVP_HEAD = ['접수시각', '수정시각', '성함', '구분', '참석', '식사', '인원(본인 포함)', '언어', '응답번호'];
const GB_HEAD = ['번호', '작성시각', '이름', '메시지', '숨김', '비밀번호(암호화)'];
const CACHE_KEY = 'gb_v1';

/* ───────── 처음 한 번 실행: 시트 만들기 ───────── */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('Asia/Seoul');

  const r = ss.getSheetByName(RSVP) || ss.insertSheet(RSVP);
  r.getRange(1, 1, 1, r.getMaxColumns()).clearContent();
  r.getRange(1, 1, 1, RSVP_HEAD.length).setValues([RSVP_HEAD]).setFontWeight('bold').setBackground('#ECE8F3');
  r.setFrozenRows(1);
  r.getRange('A:B').setNumberFormat('yyyy-mm-dd hh:mm');
  r.getRange('D:D').setNumberFormat('General');
  r.setColumnWidths(1, 2, 140); r.setColumnWidth(7, 120);
  r.showColumns(1, Math.min(r.getMaxColumns(), 12));
  r.hideColumns(9);                                      // 응답번호(같은 휴대폰 구분용)는 숨김

  const g = ss.getSheetByName(GB) || ss.insertSheet(GB);
  g.getRange(1, 1, 1, GB_HEAD.length).setValues([GB_HEAD]).setFontWeight('bold').setBackground('#ECE8F3');
  g.setFrozenRows(1);
  g.getRange('B:B').setNumberFormat('yyyy-mm-dd hh:mm');
  g.setColumnWidth(4, 420); g.getRange('D:D').setWrap(true);
  g.hideColumns(6);                                      // 비밀번호 칸은 숨김

  const s = ss.getSheetByName(SUM) || ss.insertSheet(SUM, 0);
  const R = "'" + RSVP + "'!";
  s.clear();
  s.getRange(1, 1, 9, 2).setValues([
    ['항목', '값'],
    ['응답한 사람 수', '=COUNTA(' + R + 'C2:C)'],
    ['참석 인원 (본인 포함 합계)', '=SUMIFS(' + R + 'G2:G,' + R + 'E2:E,"참석")'],
    ['  └ 신랑측', '=SUMIFS(' + R + 'G2:G,' + R + 'E2:E,"참석",' + R + 'D2:D,"신랑측")'],
    ['  └ 신부측', '=SUMIFS(' + R + 'G2:G,' + R + 'E2:E,"참석",' + R + 'D2:D,"신부측")'],
    ['식사 인원', '=SUMIFS(' + R + 'G2:G,' + R + 'E2:E,"참석",' + R + 'F2:F,"식사함")'],
    ['불참 응답', '=COUNTIF(' + R + 'E2:E,"불참")'],
    ['방명록 글 수', "=COUNTA('" + GB + "'!A2:A)"],
    ['마지막 갱신', '=NOW()']
  ]);
  s.getRange('A1:B1').setFontWeight('bold').setBackground('#ECE8F3');
  s.getRange('B9').setNumberFormat('yyyy-mm-dd hh:mm');
  s.setColumnWidth(1, 200);

  const def = ss.getSheetByName('Sheet1') || ss.getSheetByName('시트1');
  if (def && ss.getSheets().length > 3 && def.getLastRow() === 0) ss.deleteSheet(def);
  return '준비 완료';
}

/* ───────── 읽기 (방명록 목록) ───────── */
function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.action === 'guestbook') return out(listGuestbook(+p.limit || 10, +p.before || 0));
    return out({ ok: true, hello: 'wedding api' });
  } catch (err) {
    return out({ ok: false, code: 'server' });
  }
}

/* ───────── 쓰기 (참석 · 방명록 작성/삭제) ───────── */
function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return out({ ok: false, code: 'invalid' }); }
  if (d.website) return out({ ok: true });              // 자동 스팸 차단 (사람은 못 보는 칸)
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return out({ ok: false, code: 'busy' });
  try {
    if (d.action === 'rsvp') return out(saveRsvp(d));
    if (d.action === 'gb_add') return out(addGuestbook(d));
    if (d.action === 'gb_del') return out(deleteGuestbook(d));
    return out({ ok: false, code: 'invalid' });
  } catch (err) {
    console.error(err);
    return out({ ok: false, code: 'server' });
  } finally {
    lock.releaseLock();
  }
}

function saveRsvp(d) {
  const name = clip(d.name, 30), rid = clip(d.rid, 40);
  if (!name) return { ok: false, code: 'invalid' };
  const attend = d.attend === true;
  const count = attend ? Math.max(1, Math.min(20, parseInt(d.count, 10) || 1)) : 0;
  const side = d.side === 'groom' ? '신랑측' : d.side === 'bride' ? '신부측' : '';
  const now = new Date();
  const sh = sheet(RSVP);
  const row = [name, side, attend ? '참석' : '불참', attend ? (d.meal ? '식사함' : '식사안함') : '', count, d.lang === 'ja' ? '日本語' : '한국어'].map(safe);

  // 같은 휴대폰(응답번호)에서 다시 보내면 새 줄 대신 기존 줄을 고칩니다
  const last = sh.getLastRow();
  if (rid && last > 1) {
    const ids = sh.getRange(2, 9, last - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === rid) {
        sh.getRange(i + 2, 2, 1, 7).setValues([[now].concat(row)]);
        return { ok: true, updated: true };
      }
    }
  }
  sh.appendRow([now, now].concat(row).concat([rid]));
  return { ok: true, updated: false };
}

function addGuestbook(d) {
  const name = clip(d.name, 20), msg = clip(d.message, 500), pw = String(d.password || '');
  if (!name || !msg || pw.length < 4 || pw.length > 30) return { ok: false, code: 'invalid' };
  const sh = sheet(GB);
  const last = sh.getLastRow();
  let id = 1;
  if (last > 1) id = Math.max.apply(null, sh.getRange(2, 1, last - 1, 1).getValues().map(r => +r[0] || 0)) + 1;
  const now = new Date();
  const salt = Utilities.getUuid().slice(0, 8);
  sh.appendRow([id, now, safe(name), safe(msg), '', salt + ':' + hash(salt, pw)]);
  CacheService.getScriptCache().remove(CACHE_KEY);
  return { ok: true, item: { id: id, name: name, message: msg, created_at: now.toISOString() } };
}

function deleteGuestbook(d) {
  const id = +d.id, pw = String(d.password || '');
  const sh = sheet(GB);
  const last = sh.getLastRow();
  if (last < 2) return { ok: false, code: 'not_found' };
  const rows = sh.getRange(2, 1, last - 1, 6).getValues();
  for (let i = 0; i < rows.length; i++) {
    if (+rows[i][0] !== id) continue;
    const parts = String(rows[i][5]).split(':');
    if (parts.length !== 2 || hash(parts[0], pw) !== parts[1]) return { ok: false, code: 'wrong_pw' };
    sh.deleteRow(i + 2);
    CacheService.getScriptCache().remove(CACHE_KEY);
    return { ok: true };
  }
  return { ok: false, code: 'not_found' };
}

function listGuestbook(limit, before) {
  limit = Math.max(1, Math.min(100, limit));
  const cache = CacheService.getScriptCache();
  let all = null;
  const hit = cache.get(CACHE_KEY);
  if (hit) { try { all = JSON.parse(hit); } catch (e) {} }
  if (!all) {
    const sh = sheet(GB), last = sh.getLastRow();
    all = last < 2 ? [] : sh.getRange(2, 1, last - 1, 5).getValues()
      .filter(r => r[0] !== '' && String(r[4]).trim() === '')
      .map(r => ({ id: +r[0], name: unsafe(r[2]), message: unsafe(r[3]), created_at: r[1] instanceof Date ? r[1].toISOString() : String(r[1]) }))
      .sort((a, b) => b.id - a.id);
    try { cache.put(CACHE_KEY, JSON.stringify(all), 30); } catch (e) {}   // 30초 동안 재사용 (너무 크면 건너뜀)
  }
  const list = before ? all.filter(x => x.id < before) : all;
  return { ok: true, items: list.slice(0, limit), total: all.length, has_more: list.length > limit };
}

/* ───────── 도우미 ───────── */
function sheet(name) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error('setup 을 먼저 실행해 주세요: ' + name);
  return sh;
}
function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function clip(v, n) { return String(v == null ? '' : v).trim().slice(0, n); }
// 하객이 쓴 글이 시트 수식(=, +, -, @)으로 실행되지 않게 앞에 ' 를 붙임
function safe(v) { return (typeof v === 'string' && /^[=+\-@\t\r]/.test(v)) ? "'" + v : v; }
function unsafe(v) { return String(v); }
function hash(salt, pw) {
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + '|' + pw, Utilities.Charset.UTF_8));
}
