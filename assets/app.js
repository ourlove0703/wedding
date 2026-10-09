/* 청첩장 동작 — 내용은 config.js 에서, 화면 문구는 아래 TXT 에서 바꿉니다. */
(function(){
"use strict";
const C = window.WEDDING;
const $ = id => document.getElementById(id);
const p2 = n => String(n).padStart(2, "0");

/* ═════════ 화면 문구 (한국어 / 일본어) ═════════ */
const TXT = {
ko:{
  coverOpen:"청첩장 열기", coverHint:"배경음악과 함께 열려요", coverQuiet:"음악 없이 볼게요",
  inviteTitle:"소중한 분들을 초대합니다", whenTitle:"예식 일시", galTitle:"우리의 순간", wayTitle:"오시는 길", noticeTitle:"알아두실 것",
  rsvpTitle:"참석 여부를 알려주세요", gbTitle:"축하의 한마디", giftTitle:"마음 전하실 곳",
  navWhen:"일시", navWay:"오시는 길", navRsvp:"참석", navGb:"방명록", navGift:"마음",
  dow:["일","월","화","수","목","금","토"],
  day:(y,m,d,w)=>`${y}년 ${m}월 ${d}일 ${w}요일`, bigday:(m,d,w)=>`${m}월 ${d}일 ${w}요일`,
  time:(h,mi)=>`${h<12?"오전":"오후"} ${h%12||12}시${mi?` ${mi}분`:""}`,
  calHead:(y,m)=>`${y}년 ${m}월`,
  dday:n=> n>0?`결혼식까지 <b class="num">${n}일</b> 남았어요`: n===0?`오늘, 저희 결혼합니다`:`결혼한 지 <b class="num">${-n}일</b>째예요`,
  gcal:"구글 캘린더에 저장", ics:"휴대폰 캘린더에 저장",
  galHint:"옆으로 넘기고, 누르면 크게 보여요",
  father:"아버지", mother:"어머니", rel:(f,m,o)=>`${f} · ${m}의 ${o}`, todo:"확인 필요",
  kakao:"카카오맵", naver:"네이버 지도", google:"구글 지도", copyAddr:"주소 복사", taxi:"",
  rsvpIntro:"식사와 자리를 준비할 수 있도록<br>참석 여부를 미리 알려 주세요.",
  demo:"미리보기 모드예요. 입력한 내용은 이 브라우저에만 저장됩니다. (config.js 의 api 를 채우면 실제로 전송돼요)",
  fAttend:"참석 여부", attendYes:"참석할게요", attendNo:"참석이 어려워요",
  fSide:"어느 쪽 하객이신가요?", groomSide:"신랑측", brideSide:"신부측",
  fName:"성함", fPhone:"연락처",
  fCount:"참석 인원 (본인 포함)", countHint:"혼자 오시면 1명 그대로 두시면 돼요. 아이도 함께 세어 주세요.",
  fMeal:"식사", mealYes:"식사할게요", mealNo:"식사는 안 해요",
  privacy:"보내 주신 내용은 참석 확인과 식사 준비에만 사용돼요.",
  rsvpSubmit:"참석 여부 보내기", sending:"보내는 중…", rsvpAgain:"내용 고쳐서 다시 보내기",
  eAttend:"참석 여부를 골라 주세요.", eSide:"신랑측인지 신부측인지 골라 주세요.", eName:"성함을 입력해 주세요.", eMeal:"식사 여부를 골라 주세요.",
  thxYesT:"고맙습니다", thxYes:"참석 여부를 전달했어요.<br>그날 반갑게 만나요.",
  thxNoT:"마음 고맙습니다", thxNo:"알려 주셔서 고맙습니다.<br>멀리서도 축복해 주세요.",
  updated:"이미 보내 주신 내용을 새로 고쳤어요.",
  doneYes:(n,k)=>`${n}님${k>1?` 포함 ${k}명`:""}, 참석으로 전달했어요.`, doneNo:n=>`${n}님, 불참으로 전달했어요. 마음 고맙습니다.`,
  gbIntro:"두 사람에게 축하 메시지를 남겨 주세요. 로그인 없이 바로 쓸 수 있어요.",
  gbWrite:"축하 메시지 쓰기", gbNick:"이름", gbPw:"비밀번호", gbMsg:"메시지", gbPwHint:"비밀번호는 나중에 글을 지울 때 필요해요. (4자 이상)",
  gbSubmit:"메시지 남기기", gbMore:"메시지 더 보기", gbTotal:n=>`축하 메시지 ${n}개`, gbEmpty:"아직 메시지가 없어요. 첫 축하를 남겨 주세요.",
  gbDel:"삭제", delTitle:"메시지 삭제", delBody:"글을 쓸 때 입력한 비밀번호를 입력해 주세요.", delOk:"삭제",
  deleted:"메시지를 삭제했어요", posted:"메시지를 남겼어요", wrongPw:"비밀번호가 맞지 않아요.",
  eNick:"이름을 입력해 주세요.", ePw:"비밀번호를 4자 이상 입력해 주세요.", eMsg:"메시지를 입력해 주세요.",
  giftIntro:"참석이 어려우신 분들을 위해<br>계좌번호를 안내해 드려요.",
  groomAcct:"신랑측 계좌", brideAcct:"신부측 계좌", copy:"복사", copied:"계좌번호를 복사했어요", empty:"아직 입력되지 않은 정보예요",
  thanks:"귀한 걸음으로 축복해 주셔서<br>진심으로 고맙습니다.", share:"청첩장 공유하기", copyLink:"링크 복사", linkCopied:"링크를 복사했어요", addrCopied:"주소를 복사했어요",
  ok:"확인", cancel:"취소",
  net:"인터넷 연결이 불안정해요. 잠시 후 다시 시도해 주세요.", busy:"지금 요청이 많아요. 잠시 후 다시 시도해 주세요.", server:"보내지 못했어요. 잠시 후 다시 시도해 주세요.", invalid:"입력 내용을 확인해 주세요.",
  music:["배경음악 켜기","배경음악 끄기"], view:"크게 보기", close:"닫기", prev:"이전 사진", next:"다음 사진", minus:"한 명 줄이기", plus:"한 명 늘리기"
},
ja:{
  coverOpen:"招待状を開く", coverHint:"BGMとともに開きます", coverQuiet:"音楽なしで見る",
  inviteTitle:"ご招待", whenTitle:"日時", galTitle:"ギャラリー", wayTitle:"アクセス", noticeTitle:"ご案内",
  rsvpTitle:"ご出欠のお知らせ", gbTitle:"お祝いメッセージ", giftTitle:"ご祝儀のお振込先",
  navWhen:"日時", navWay:"アクセス", navRsvp:"ご出欠", navGb:"メッセージ", navGift:"お振込先",
  dow:["日","月","火","水","木","金","土"],
  day:(y,m,d,w)=>`${y}年${m}月${d}日（${w}）`, bigday:(m,d,w)=>`${m}月${d}日（${w}）`,
  time:(h,mi)=>`${h<12?"午前":"午後"}${h%12||12}時${mi?`${mi}分`:""}`,
  calHead:(y,m)=>`${y}年${m}月`,
  dday:n=> n>0?`結婚式まで あと<b class="num">${n}日</b>`: n===0?`本日、わたしたちは結婚します`:`結婚して <b class="num">${-n}日</b>目`,
  gcal:"Google カレンダーに登録", ics:"スマホのカレンダーに登録",
  galHint:"横にスワイプ・タップで拡大",
  father:"父", mother:"母", rel:(f,m,o)=>`${f}、${m}の${o}`, todo:"確認中",
  kakao:"カカオマップ", naver:"NAVER Map", google:"Google マップ", copyAddr:"住所をコピー", taxi:"タクシーでは運転手の方に下の韓国語住所をお見せください",
  rsvpIntro:"お食事とお席のご準備のため<br>ご出欠を事前にお知らせください。",
  demo:"プレビューモードです。入力内容はこのブラウザにのみ保存されます。",
  fAttend:"ご出欠", attendYes:"出席します", attendNo:"欠席します",
  fSide:"ご関係", groomSide:"新郎側", brideSide:"新婦側",
  fName:"お名前", fPhone:"電話番号",
  fCount:"ご出席人数（ご本人を含む）", countHint:"お一人の場合は1名のままで大丈夫です。お子様も含めてお数えください。",
  fMeal:"お食事", mealYes:"いただきます", mealNo:"遠慮します",
  privacy:"いただいた内容は出欠確認とお食事の準備にのみ使用します。",
  rsvpSubmit:"出欠を送信する", sending:"送信中…", rsvpAgain:"内容を修正して再送信",
  eAttend:"ご出欠を選んでください。", eSide:"新郎側か新婦側かを選んでください。", eName:"お名前を入力してください。", eMeal:"お食事の有無を選んでください。",
  thxYesT:"ありがとうございます", thxYes:"ご出席のご連絡を承りました。<br>当日お会いできるのを楽しみにしています。",
  thxNoT:"ありがとうございます", thxNo:"ご連絡いただきありがとうございます。<br>遠くからお祝いいただけましたら幸いです。",
  updated:"以前の送信内容を更新しました。",
  doneYes:(n,k)=>`${n}様${k>1?`（${k}名）`:""}、ご出席を承りました。`, doneNo:n=>`${n}様、ご欠席を承りました。お心遣いありがとうございます。`,
  gbIntro:"ふたりへのお祝いメッセージをお寄せください。ログイン不要です。",
  gbWrite:"メッセージを書く", gbNick:"お名前", gbPw:"パスワード", gbMsg:"メッセージ", gbPwHint:"パスワードは書き込みを削除するときに必要です。（4文字以上）",
  gbSubmit:"メッセージを送る", gbMore:"もっと見る", gbTotal:n=>`お祝いメッセージ ${n}件`, gbEmpty:"まだメッセージはありません。最初のお祝いメッセージをお待ちしています。",
  gbDel:"削除", delTitle:"メッセージの削除", delBody:"書き込み時に入力したパスワードを入力してください。", delOk:"削除する",
  deleted:"メッセージを削除しました", posted:"メッセージを送りました", wrongPw:"パスワードが違います。",
  eNick:"お名前を入力してください。", ePw:"パスワードは4文字以上で入力してください。", eMsg:"メッセージを入力してください。",
  giftIntro:"ご出席が難しい方のために<br>お振込先をご案内いたします。<br>（韓国の銀行口座です）",
  groomAcct:"新郎側の口座", brideAcct:"新婦側の口座", copy:"コピー", copied:"口座番号をコピーしました", empty:"まだ入力されていない情報です",
  thanks:"皆様のご来場を<br>心よりお待ちしております。", share:"招待状を共有", copyLink:"リンクをコピー", linkCopied:"リンクをコピーしました", addrCopied:"住所をコピーしました",
  ok:"OK", cancel:"キャンセル",
  net:"接続が不安定です。しばらくしてからお試しください。", busy:"アクセスが集中しています。しばらくしてからお試しください。", server:"送信できませんでした。しばらくしてからお試しください。", invalid:"入力内容をご確認ください。",
  music:["BGMを再生","BGMを止める"], view:"拡大", close:"閉じる", prev:"前の写真", next:"次の写真", minus:"1人減らす", plus:"1人増やす"
}};

let L = "ko";
const t = k => TXT[L][k];
const pick = v => (v && typeof v === "object") ? (v[L] || v.ko || "") : (v || "");
const todo = () => `<span class="todo">${t("todo")}</span>`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const [Y, Mo, D] = C.date.split("-").map(Number), [hh, mm] = C.time.split(":").map(Number);
const WED = new Date(`${C.date}T${C.time}:00+09:00`);
const DOW = new Date(Y, Mo - 1, D).getDay();
const G = C.groom, B = C.bride;
const siteUrl = () => (C.siteUrl && !/YOUR-ID/.test(C.siteUrl)) ? C.siteUrl : location.href.split("#")[0];

/* ═════════ 화면 그리기 ═════════ */
function render(){
  document.documentElement.lang = L;
  document.querySelectorAll("[data-t]").forEach(el => el.textContent = t(el.dataset.t));
  document.querySelectorAll("[data-t-html]").forEach(el => el.innerHTML = t(el.dataset.tHtml));
  document.querySelectorAll(".lang button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === L));
  document.querySelectorAll(".demo").forEach(el => el.hidden = !DEMO);

  // 첫 화면
  $("hG").textContent = pick(G); $("hB").textContent = pick(B);
  $("heroNames").setAttribute("aria-label", `${pick(G)}, ${pick(B)}`);
  $("cvG").textContent = pick(G); $("cvB").textContent = pick(B);
  $("coverDate").textContent = `${t("day")(Y, Mo, D, t("dow")[DOW])} ${t("time")(hh, mm)}`;
  const w = t("dow")[DOW];
  $("heroWhen").innerHTML = `${esc(t("day")(Y, Mo, D, w))}<span>${esc(t("time")(hh, mm))}</span>`;
  $("heroWhere").innerHTML = `${esc(pick(C.place.name))}${L === "ja" ? "<br>" : " "}${esc(pick(C.place.hall))}`;

  // 초대의 글 · 혼주
  $("greeting").innerHTML = C.greeting[L].map(l => l ? esc(l) : '<span class="gap"></span>').join("<br>").replace(/<br><span class="gap"><\/span><br>/g, '<span class="gap"></span>');
  const fam = p => {
    const f = pick(p.father), m = pick(p.mother), o = pick(p.order);
    return `<div><dt>${t("rel")(f ? esc(f) : todo(), m ? esc(m) : todo(), esc(o))}</dt><dd>${esc(pick(p.short))}</dd></div>`;
  };
  $("families").innerHTML = fam(G) + fam(B);

  // 일시
  $("bigDay").textContent = t("bigday")(Mo, D, w);
  $("bigTime").textContent = t("time")(hh, mm);
  $("calHead").textContent = t("calHead")(Y, Mo);
  const first = new Date(Y, Mo - 1, 1).getDay(), last = new Date(Y, Mo, 0).getDate();
  let h = t("dow").map((d, i) => `<span class="dow ${i === 0 ? "sun" : ""}">${d}</span>`).join("");
  for (let i = 0; i < first; i++) h += "<span></span>";
  for (let d = 1; d <= last; d++){ const dw = (first + d - 1) % 7; h += `<span class="num ${d === D ? "on" : dw === 0 ? "sun" : ""}">${d}</span>`; }
  $("calGrid").innerHTML = h;
  tick();

  // 오시는 길
  $("venue").innerHTML = `${esc(pick(C.place.name))}<small>${esc(pick(C.place.hall))} · <a href="tel:${C.place.tel.replace(/[^\d+]/g, "")}">${L === "ja" ? "+82-" + C.place.tel.replace(/^0/, "") : C.place.tel}</a></small>`;
  $("addr").textContent = pick(C.place.address);
  const ak = $("addrKo"); ak.hidden = L !== "ja"; ak.innerHTML = L === "ja" ? `${t("taxi")}<b>${esc(C.place.address.ko)}</b>` : "";
  const s = encodeURIComponent(C.place.search), a = encodeURIComponent(C.place.address.ko);
  const maps = L === "ko"
    ? [["kakao", `https://map.kakao.com/link/search/${s}`], ["naver", `https://map.naver.com/p/search/${s}`]]
    : [["google", `https://www.google.com/maps/search/?api=1&query=${a}`], ["naver", `https://map.naver.com/p/search/${s}`]];
  $("maps").innerHTML = maps.map(([k, u]) => `<a class="btn line" href="${u}" target="_blank" rel="noopener">${t(k)}</a>`).join("")
    + `<button class="btn line" type="button" id="copyAddr">${t("copyAddr")}</button>`;
  $("copyAddr").onclick = () => copy(C.place.address.ko, t("addrCopied"));
  const dl = list => list.map(r => `<div><dt>${esc(pick(r.t))}</dt><dd>${pick(r.d) ? esc(pick(r.d)) : todo()}</dd></div>`).join("");
  $("route").innerHTML = dl(C.route); $("notice").innerHTML = dl(C.notice);

  // 계좌
  const open = [...document.querySelectorAll(".acct-g")].map(d => d.open);
  $("accounts").innerHTML = [["groom", "groomAcct"], ["bride", "brideAcct"]].map(([k, lab], gi) => `
    <details class="acct-g"${open[gi] ? " open" : ""}><summary>${t(lab)}</summary>
      ${C.accounts[k].map(x => { const v = x.bank && x.num ? `${x.bank} ${x.num}` : "";
        return `<div class="acct"><div><div class="who">${esc(pick(x.who))}</div><div class="no num">${v ? esc(v) : todo()}</div></div>${v ? `<button class="copy" type="button" data-copy="${esc(v)}">${t("copy")}</button>` : ""}</div>`; }).join("")}
    </details>`).join("");

  $("footNames").textContent = `${pick(G)} · ${pick(B)}`;
  document.title = L === "ja" ? `${G.ja} ♥ ${B.ja} 結婚式のご案内` : `${G.ko} ♥ ${B.ko} 결혼합니다`;

  // 접근성 라벨
  document.querySelectorAll(".shot").forEach((b, i) => b.setAttribute("aria-label", `${i + 1} ${t("view")}`));
  $("lbClose").setAttribute("aria-label", t("close")); $("lbPrev").setAttribute("aria-label", t("prev")); $("lbNext").setAttribute("aria-label", t("next"));
  $("cMinus").setAttribute("aria-label", t("minus")); $("cPlus").setAttribute("aria-label", t("plus"));
  setBgm(!bgm.paused);
  renderRsvpDone(); renderWall();
}
function tick(){
  const today = new Date(Date.now() + 9 * 36e5), wd = Date.UTC(Y, Mo - 1, D);
  const n = Math.round((wd - Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())) / 864e5);
  $("dday").innerHTML = t("dday")(n);
}
setInterval(tick, 60000);

/* ═════════ 사진 ═════════ */
$("heroImg").src = C.photos.main;
$("heroImg").alt = `${G.ko} ${B.ko}`;
const GAL = C.photos.gallery;
$("strip").innerHTML = GAL.map((src, i) => `<button class="shot" type="button" data-i="${i}"><img src="${esc(src)}" alt="" loading="lazy" decoding="async"></button>`).join("");
function stripIndex(){
  const st = $("strip"), x = st.scrollLeft + 24; let best = 0, bd = Infinity;
  st.querySelectorAll(".shot").forEach((s, i) => { const d = Math.abs(s.offsetLeft - x); if (d < bd){ bd = d; best = i; } });
  if (st.scrollLeft > 0 && st.scrollLeft + st.clientWidth >= st.scrollWidth - 4) best = GAL.length - 1;
  $("stripCount").textContent = `${best + 1} / ${GAL.length}`;
}
$("strip").addEventListener("scroll", () => requestAnimationFrame(stripIndex), { passive: true });
stripIndex();

const lb = $("lightbox"); let cur = 0, lastFocus = null;
function showLB(i){
  cur = (i + GAL.length) % GAL.length;
  $("lbStage").innerHTML = ""; const im = new Image(); im.src = GAL[cur]; im.alt = ""; $("lbStage").appendChild(im);
  $("lbCount").textContent = `${cur + 1} / ${GAL.length}`;
}
function openLB(i){ lastFocus = document.activeElement; showLB(i); lb.hidden = false; document.body.style.overflow = "hidden"; $("lbClose").focus(); }
function closeLB(){ lb.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); }
$("strip").addEventListener("click", e => { const b = e.target.closest(".shot"); if (b) openLB(+b.dataset.i); });
$("lbClose").onclick = closeLB; $("lbPrev").onclick = () => showLB(cur - 1); $("lbNext").onclick = () => showLB(cur + 1);
lb.addEventListener("click", e => { if (e.target === lb || e.target === $("lbStage")) closeLB(); });
document.addEventListener("keydown", e => { if (lb.hidden) return; if (e.key === "Escape") closeLB(); if (e.key === "ArrowLeft") showLB(cur - 1); if (e.key === "ArrowRight") showLB(cur + 1); });
let sx = null;
lb.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) showLB(cur + (dx < 0 ? 1 : -1)); sx = null; });

/* ═════════ 표지 · 배경음악 ═════════
   휴대폰 브라우저는 소리 자동재생을 막기 때문에, 표지의 '청첩장 열기'를 누르는 순간 음악을 시작합니다. */
const bgm = new Audio(); bgm.preload = "none";
function setBgm(on){ const b = $("bgm"); b.setAttribute("aria-pressed", on); b.setAttribute("aria-label", t("music")[on ? 1 : 0]); }
function playBgm(){ if (!C.music) return; if (!bgm.src) bgm.src = C.music; bgm.play().catch(() => {}); }
if (C.music){
  $("bgm").hidden = false;
  $("bgm").onclick = () => { bgm.paused ? playBgm() : bgm.pause(); };
  bgm.addEventListener("play", () => setBgm(true)); bgm.addEventListener("pause", () => setBgm(false));
} else {
  document.querySelectorAll(".cover-hint,#coverQuiet").forEach(el => el.remove());
}
(function(){
  const cover = $("cover");
  // 바로가기 링크(#rsvp 등)로 들어온 경우에도 표지는 한 번 보여 줍니다
  document.documentElement.classList.add("covered");
  const open = withMusic => {
    if (withMusic) playBgm();
    cover.classList.add("leaving");
    document.documentElement.classList.remove("covered");
    const done = () => { cover.hidden = true; };
    matchMedia("(prefers-reduced-motion: reduce)").matches ? done() : setTimeout(done, 650);
  };
  $("coverOpen").onclick = () => open(true);
  $("coverQuiet") && ($("coverQuiet").onclick = () => open(false));
})();

/* ═════════ 상단 버튼 숨김 · 아래 바로가기 ═════════ */
(function(){
  let lastY = scrollY, ticking = false;
  addEventListener("scroll", () => { if (ticking) return; ticking = true; requestAnimationFrame(() => {
    const y = scrollY; if (y < 120 || y < lastY - 4) $("topbar").classList.remove("hide"); else if (y > lastY + 4) $("topbar").classList.add("hide");
    lastY = y; ticking = false; }); }, { passive: true });
  const dock = $("dock");
  dock.classList.add("off");
  new IntersectionObserver(es => dock.classList.toggle("off", es[0].isIntersecting), { threshold: .25 }).observe($("top"));
  const links = [...dock.querySelectorAll("a")];
  const secs = links.map(a => document.querySelector(a.getAttribute("href")));
  const seen = new Map();
  const io = new IntersectionObserver(es => {
    es.forEach(e => seen.set(e.target, e.isIntersecting));
    const i = secs.findIndex(s => seen.get(s));
    links.forEach((a, j) => a.classList.toggle("on", j === i));
  }, { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(s => io.observe(s));
})();

/* ═════════ 복사 · 알림 · 팝업 ═════════ */
function toast(msg){ const el = $("toast"); el.textContent = msg; el.classList.add("on"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("on"), 1800); }
function copy(text, msg){
  if (!text){ toast(t("empty")); return; }
  const fallback = () => { const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast(msg); } catch(e){ toast(text); } ta.remove(); };
  navigator.clipboard ? navigator.clipboard.writeText(text).then(() => toast(msg), fallback) : fallback();
}
document.addEventListener("click", e => { const b = e.target.closest("[data-copy]"); if (b) copy(b.dataset.copy, t("copied")); });
$("copyLink").onclick = () => copy(siteUrl(), t("linkCopied"));
$("share").onclick = () => {
  const data = { title: document.title, text: `${t("day")(Y, Mo, D, t("dow")[DOW])} ${t("time")(hh, mm)}\n${$("heroWhere").textContent}`, url: siteUrl() };
  if (navigator.share) navigator.share(data).catch(() => {}); else copy(siteUrl(), t("linkCopied"));
};

let modalLast = null;
function openModal({ title, body, okText, cancelText, password, onOk }){
  const m = $("modal"), inp = $("mInput"), err = $("mErr"), ok = $("mOk"), cn = $("mCancel");
  $("mTitle").textContent = title; $("mBody").innerHTML = body;
  ok.textContent = okText || t("ok"); cn.textContent = cancelText || t("cancel"); cn.hidden = !cancelText;
  inp.hidden = !password; inp.value = ""; showErr(err, "");
  modalLast = document.activeElement; m.hidden = false; document.body.style.overflow = "hidden";
  (password ? inp : ok).focus();
  const close = () => { m.hidden = true; document.body.style.overflow = ""; ok.onclick = cn.onclick = null; document.removeEventListener("keydown", onKey); modalLast && modalLast.focus && modalLast.focus(); };
  const submit = async () => { if (!onOk) return close(); ok.disabled = true; const msg = await onOk(inp.value); ok.disabled = false; msg ? showErr(err, msg) : close(); };
  const onKey = e => { if (e.key === "Escape") close(); if (e.key === "Enter" && password){ e.preventDefault(); submit(); } };
  document.addEventListener("keydown", onKey);
  ok.onclick = submit; cn.onclick = close;
}
function showErr(el, msg){ el.textContent = msg || ""; el.hidden = !msg; }

/* ═════════ 구글 시트 연결 ═════════ */
const API = (C.api || "").trim();
const DEMO = !API;
async function call(action, data = {}){
  if (DEMO) return demo(action, data);
  let r;
  try {
    if (action === "guestbook") r = await fetch(API + (API.includes("?") ? "&" : "?") + new URLSearchParams({ action, ...data }));
    else r = await fetch(API, { method: "POST", body: JSON.stringify({ action, ...data }) });   // text/plain → 사전요청 없이 전송
  } catch(e){ throw { code: "net" }; }
  let d = null; try { d = await r.json(); } catch(e){ throw { code: "server" }; }
  if (!d || !d.ok) throw { code: (d && d.code) || "server" };
  return d;
}
function errText(e){ return { wrong_pw: t("wrongPw"), net: t("net"), busy: t("busy"), invalid: t("invalid") }[e.code] || t("server"); }

/* 미리보기 모드: api 를 비워 두면 이 브라우저에만 저장 */
function demo(action, d){
  const K = "wd_demo"; let db; try { db = JSON.parse(localStorage.getItem(K)) || {}; } catch(e){ db = {}; }
  db.rsvp = db.rsvp || []; db.gb = db.gb || []; db.seq = db.seq || 0;
  const save = () => { try { localStorage.setItem(K, JSON.stringify(db)); } catch(e){} };
  return new Promise(res => setTimeout(() => {
    if (action === "rsvp"){ const k = d.rid; const i = db.rsvp.findIndex(r => r.k === k); const row = { ...d, k };
      if (i >= 0) db.rsvp[i] = row; else db.rsvp.push(row); save(); res({ ok: true, updated: i >= 0 }); }
    else if (action === "gb_add"){ const it = { id: ++db.seq, name: d.name, message: d.message, created_at: new Date().toISOString(), pw: d.password }; db.gb.unshift(it); save();
      res({ ok: true, item: { id: it.id, name: it.name, message: it.message, created_at: it.created_at } }); }
    else if (action === "gb_del"){ const it = db.gb.find(x => x.id === +d.id); if (it && it.pw !== d.password) return res(Promise.reject({ code: "wrong_pw" }));
      db.gb = db.gb.filter(x => x.id !== +d.id); save(); res({ ok: true }); }
    else if (action === "guestbook"){ const lim = +d.limit || 10, before = +d.before || 0;
      const list = db.gb.filter(x => !before || x.id < before), items = list.slice(0, lim).map(({ pw, ...x }) => x);
      res({ ok: true, items, total: db.gb.length, has_more: list.length > lim }); }
  }, 300));
}

/* ═════════ 참석 여부 ═════════ */
const SAVED = "wd_rsvp_done";
let rsvpDone = null; try { rsvpDone = JSON.parse(localStorage.getItem(SAVED) || "null"); } catch(e){}
// 이 휴대폰의 응답 번호: 같은 휴대폰에서 다시 보내면 시트의 기존 줄을 고칩니다
let RID = ""; try { RID = localStorage.getItem("wd_rid") || ""; } catch(e){}
if (!RID){ RID = Date.now().toString(36) + Math.random().toString(36).slice(2, 8); try { localStorage.setItem("wd_rid", RID); } catch(e){} }
const checked = n => { const e = document.querySelector(`#rsvpForm input[name="${n}"]:checked`); return e ? e.value : null; };
let count = 1;
function setCount(n){ count = Math.max(1, Math.min(10, n)); $("rCount").textContent = count; $("cMinus").disabled = count <= 1; $("cPlus").disabled = count >= 10; }
function renderRsvpDone(){
  $("rsvpForm").hidden = !!rsvpDone; $("rDone").hidden = !rsvpDone;
  if (rsvpDone) $("rDoneText").textContent = rsvpDone.attend ? t("doneYes")(rsvpDone.name, rsvpDone.count || 1) : t("doneNo")(rsvpDone.name);
}
setCount(1);
$("rsvpForm").addEventListener("input", () => showErr($("rErr"), ""));
$("rsvpForm").addEventListener("change", () => showErr($("rErr"), ""));
$("cMinus").onclick = () => setCount(count - 1);
$("cPlus").onclick = () => setCount(count + 1);
document.querySelectorAll('#rsvpForm input[name="attend"]').forEach(r => r.addEventListener("change", () => { $("rMore").hidden = checked("attend") !== "1"; }));
$("rAgain").onclick = () => { rsvpDone = null; try { localStorage.removeItem(SAVED); } catch(e){} renderRsvpDone(); $("rName").focus(); };
$("rsvpForm").addEventListener("submit", async e => {
  e.preventDefault();
  const err = $("rErr"), btn = $("rSubmit");
  const attend = checked("attend"), side = checked("side"), meal = checked("meal");
  const name = $("rName").value.trim();
  if (attend === null) return showErr(err, t("eAttend"));
  if (side === null) return showErr(err, t("eSide"));
  if (!name) return showErr(err, t("eName"));
  if (attend === "1" && meal === null) return showErr(err, t("eMeal"));
  showErr(err, ""); btn.disabled = true; btn.textContent = t("sending");
  try {
    const yes = attend === "1", n = yes ? count : 0;
    const r = await call("rsvp", { rid: RID, name, side, attend: yes, meal: yes && meal === "1", count: n, lang: L, website: $("rHp").value });
    rsvpDone = { name, attend: yes, count: n };
    try { localStorage.setItem(SAVED, JSON.stringify(rsvpDone)); } catch(e){}
    openModal({ title: t(yes ? "thxYesT" : "thxNoT"), body: t(yes ? "thxYes" : "thxNo") + (r.updated ? `<br><br>${t("updated")}` : "") });
    renderRsvpDone();
  } catch(ex){ showErr(err, errText(ex)); }
  finally { btn.disabled = false; btn.textContent = t("rsvpSubmit"); }
});

/* ═════════ 방명록 ═════════ */
const gb = { items: [], total: 0, hasMore: false, seen: new Set(), first: true, loading: false, visible: false };
function fmtDate(iso){
  const d = new Date(iso); if (isNaN(d)) return "";
  const k = new Date(d.getTime() + 9 * 36e5);
  return `${k.getUTCFullYear()}.${p2(k.getUTCMonth() + 1)}.${p2(k.getUTCDate())}`;
}
function renderWall(){
  const wall = $("wall");
  $("gbTotal").textContent = gb.total ? t("gbTotal")(gb.total) : "";
  wall.innerHTML = "";
  if (!gb.items.length && !gb.first){ const li = document.createElement("li"); li.className = "empty"; li.textContent = t("gbEmpty"); wall.appendChild(li); }
  for (const it of gb.items){
    const n = document.createElement("li"); n.className = "note";
    if (!gb.first && !gb.seen.has(it.id)) n.classList.add("fresh");
    const h = document.createElement("div"); h.className = "note-h";
    const nm = document.createElement("span"); nm.className = "note-n"; nm.textContent = it.name;
    const dt = document.createElement("span"); dt.className = "note-d num"; dt.textContent = fmtDate(it.created_at);
    const x = document.createElement("button"); x.type = "button"; x.className = "note-x"; x.textContent = t("gbDel"); x.dataset.id = it.id;
    h.append(nm, dt, x);
    const m = document.createElement("p"); m.className = "note-m"; m.textContent = it.message;
    n.append(h, m); wall.appendChild(n);
  }
  gb.items.forEach(i => gb.seen.add(i.id));
  $("gbMore").hidden = !gb.hasMore;
}
async function loadWall(refresh){
  if (gb.loading) return; gb.loading = true;
  try {
    const r = refresh
      ? await call("guestbook", { limit: Math.min(Math.max(10, gb.items.length), 100) })
      : await call("guestbook", { limit: 10, before: gb.items.length ? gb.items[gb.items.length - 1].id : 0 });
    gb.items = refresh ? r.items : gb.items.concat(r.items);
    gb.hasMore = r.has_more; gb.total = r.total; gb.first = false; renderWall();
  } catch(e){ if (gb.first){ gb.first = false; renderWall(); } }
  finally { gb.loading = false; }
}
function toggleGbForm(show){ $("gbForm").hidden = !show; $("gbOpen").hidden = show; $("gbOpen").setAttribute("aria-expanded", show); if (show) $("gNick").focus(); }
$("gbOpen").onclick = () => toggleGbForm(true);
$("gCancel").onclick = () => toggleGbForm(false);
$("gMsg").addEventListener("input", () => { $("gCount").textContent = `${$("gMsg").value.length} / 500`; });
$("gbForm").addEventListener("submit", async e => {
  e.preventDefault();
  const err = $("gErr"), btn = $("gSubmit");
  const name = $("gNick").value.trim(), pw = $("gPw").value, message = $("gMsg").value.trim();
  if (!name) return showErr(err, t("eNick"));
  if (pw.length < 4) return showErr(err, t("ePw"));
  if (!message) return showErr(err, t("eMsg"));
  showErr(err, ""); btn.disabled = true;
  try {
    const r = await call("gb_add", { name, password: pw, message, website: $("gHp").value });
    if (r.item){ gb.items.unshift(r.item); gb.total++; }
    renderWall();
    $("gMsg").value = ""; $("gPw").value = ""; $("gCount").textContent = "0 / 500";
    toggleGbForm(false); toast(t("posted"));
  } catch(ex){ showErr(err, errText(ex)); }
  finally { btn.disabled = false; }
});
$("gbMore").onclick = () => loadWall(false);
$("wall").addEventListener("click", e => {
  const b = e.target.closest(".note-x"); if (!b) return; const id = +b.dataset.id;
  openModal({ title: t("delTitle"), body: t("delBody"), okText: t("delOk"), cancelText: t("cancel"), password: true,
    onOk: async pw => {
      if (!pw) return t("wrongPw");
      try { await call("gb_del", { id, password: pw }); }
      catch(ex){ if (ex.code !== "not_found") return errText(ex); }
      gb.items = gb.items.filter(i => i.id !== id); gb.total = Math.max(0, gb.total - 1); renderWall(); toast(t("deleted")); return null;
    } });
});
new IntersectionObserver(es => { gb.visible = es[0].isIntersecting; if (gb.visible) loadWall(true); }, { rootMargin: "200px" }).observe($("guestbook"));
setInterval(() => { if (gb.visible && !document.hidden) loadWall(true); }, 30000);

/* ═════════ 언어 ═════════ */
function setLang(l){ L = l === "ja" ? "ja" : "ko"; try { localStorage.setItem("inv-lang", L); } catch(e){} render(); }
document.querySelectorAll(".lang button").forEach(b => b.onclick = () => setLang(b.dataset.lang));
let start = /^ja\b/i.test(navigator.language || "") ? "ja" : "ko";          // 휴대폰 언어
try { const s = localStorage.getItem("inv-lang"); if (s) start = s; } catch(e){} // 직접 고른 언어 우선
if (/^#ja$/i.test(location.hash)) start = "ja";                               // 링크 끝 #ja → 일본어
if (/^#ko$/i.test(location.hash)) start = "ko";
setLang(start);
})();
