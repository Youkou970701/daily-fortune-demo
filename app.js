const form = document.querySelector("#fortuneForm");
const rerollBtn = document.querySelector("#rerollBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const card = document.querySelector("#fortuneCard");

const $ = (id) => document.querySelector(id);

const copy = {
  work: {
    keywords: ["稳住", "收尾", "别硬刚", "先对齐", "慢就是快"],
    readings: [
      "今天适合把手里的事收拢，不适合临时开新坑。先确认边界，再开始动手。",
      "你会遇到一个看似麻烦的小问题，但它其实是在提醒你把流程补齐。",
      "别急着证明自己。把最重要的一件事做完，比同时开五个窗口更有能量。",
    ],
    dos: ["整理计划，主动确认", "先写草稿，再求完美", "把大事拆成 20 分钟"],
    donts: ["临时答应所有人", "带着情绪回消息", "边焦虑边刷新"],
  },
  money: {
    keywords: ["别冲动", "小进账", "算清楚", "慢慢富", "守住"],
    readings: [
      "今天适合看清账本，不适合被限时优惠拿捏。钱会流向更清醒的人。",
      "有小机会，但别急着上头。先算投入，再看回报。",
      "你今天的财运关键词不是暴富，是少花一笔冤枉钱。",
    ],
    dos: ["记一笔账", "比较三家再买", "整理订阅扣费"],
    donts: ["为情绪消费", "借钱给不熟的人", "相信一夜翻盘"],
  },
  love: {
    keywords: ["别猜", "靠近", "松弛", "有回应", "说人话"],
    readings: [
      "今天适合把话说简单一点。少一点试探，多一点真实表达。",
      "关系里的好运来自松弛，不是靠反复分析对方每个标点。",
      "你不用把所有情绪都藏起来，但也不用在第一秒全部倒出来。",
    ],
    dos: ["直接表达需求", "给对方一点空间", "先照顾好自己"],
    donts: ["反复脑补", "深夜翻旧账", "用冷淡测试真心"],
  },
  study: {
    keywords: ["开窍", "复盘", "专注", "别贪多", "会了"],
    readings: [
      "今天适合复盘和补洞。真正的进步不是多学一页，是终于懂一块。",
      "别把学习做成收藏夹。挑一个点，讲给别人听，你就赢了一半。",
      "你的脑子不是卡住了，只是在等一个更小的入口。",
    ],
    dos: ["做一道例题", "写 5 行总结", "关掉多余标签页"],
    donts: ["只收藏不开始", "同时学三门", "用焦虑当动力"],
  },
  social: {
    keywords: ["少解释", "会被懂", "轻一点", "观察", "边界感"],
    readings: [
      "今天不必对每个人解释清楚。真正舒服的关系，会自动给你留余地。",
      "适合见朋友，也适合早点回家。热闹和边界可以同时存在。",
      "有些话不用立刻回。等情绪降下来，你会更知道怎么说。",
    ],
    dos: ["约一个真朋友", "提前说清边界", "认真听完再回答"],
    donts: ["过度解释", "替别人做决定", "把客气当亏欠"],
  },
  random: {
    keywords: ["有转机", "顺手", "发光", "先睡觉", "别纠结"],
    readings: [
      "今天的好运藏在顺手做完的小事里。别等状态来了，先动一下。",
      "你不需要把人生想明白，今天只需要把手机电充上，把水喝了。",
      "有些答案不是想出来的，是你开始之后慢慢露出来的。",
    ],
    dos: ["喝水，出门晒光", "做一个小决定", "把房间一角收好"],
    donts: ["无限纠结", "饿着想人生", "把小事拖成大事"],
  },
};

const moodBoost = {
  tired: ["今天请把自己当成低电量模式使用。", "慢一点不是退步，是续航。"],
  money: ["搞钱可以，但别让焦虑替你签字。", "今天适合让野心落到表格里。"],
  calm: ["躺平不是问题，躺到忘记翻面才是。", "允许自己轻一点，事情会更顺。"],
  fire: ["能量很足，记得把火力集中到一个方向。", "冲可以，先看路。"],
};

const toneLines = {
  soft: ["你已经做得不错了，今天只要再往前一点点。", "别催自己，先把呼吸找回来。"],
  funny: ["今天的你不宜硬撑，宜假装很会然后真的做完。", "别跟世界较劲，世界今天也没睡醒。"],
  clean: ["减少解释，增加行动。今天的关键是完成闭环。", "先做可控的事，剩下的交给时间。"],
};

const colors = ["薄荷绿", "雾蓝", "奶油黄", "番茄红", "银灰", "海盐白", "葡萄紫"];
const items = ["空白备忘录", "一杯冰美式", "干净桌面", "有电耳机", "帆布包", "一支黑笔", "早睡闹钟"];
const themes = ["mint", "blue", "rose"];

let seed = Date.now();

function seededIndex(length) {
  seed = (seed * 9301 + 49297) % 233280;
  return Math.floor((seed / 233280) * length);
}

function selected(name) {
  return new FormData(form).get(name);
}

function todayText() {
  const now = new Date();
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(now);
}

function generateFortune(event) {
  event?.preventDefault();
  const nickname = $("#nickname").value.trim() || "今天的我";
  const topic = selected("topic") || "random";
  const mood = selected("mood") || "tired";
  const tone = selected("tone") || "soft";
  const pool = copy[topic];

  const keyword = pool.keywords[seededIndex(pool.keywords.length)];
  const reading = pool.readings[seededIndex(pool.readings.length)];
  const moodLine = moodBoost[mood][seededIndex(moodBoost[mood].length)];
  const toneLine = toneLines[tone][seededIndex(toneLines[tone].length)];
  const score = 72 + seededIndex(24);

  $("#cardDate").textContent = todayText();
  $("#cardName").textContent = nickname;
  $("#score").textContent = score;
  $("#keyword").textContent = keyword;
  $("#mainReading").textContent = `${reading}${moodLine}`;
  $("#luckyColor").textContent = colors[seededIndex(colors.length)];
  $("#luckyItem").textContent = items[seededIndex(items.length)];
  $("#doText").textContent = pool.dos[seededIndex(pool.dos.length)];
  $("#dontText").textContent = pool.donts[seededIndex(pool.donts.length)];
  $("#shareLine").textContent = toneLine;
  card.dataset.theme = themes[seededIndex(themes.length)];
}

function escapeSvgText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function wrapText(text, maxChars) {
  const chunks = [];
  let current = "";
  for (const char of text) {
    current += char;
    if (current.length >= maxChars || /[，。！？,.!?]/.test(char)) {
      chunks.push(current);
      current = "";
    }
  }
  if (current) chunks.push(current);
  return chunks.slice(0, 5);
}

function downloadCard() {
  const data = {
    name: $("#cardName").textContent,
    date: $("#cardDate").textContent,
    score: $("#score").textContent,
    keyword: $("#keyword").textContent,
    reading: $("#mainReading").textContent,
    color: $("#luckyColor").textContent,
    item: $("#luckyItem").textContent,
    doText: $("#doText").textContent,
    dontText: $("#dontText").textContent,
    share: $("#shareLine").textContent,
  };

  const lines = wrapText(data.reading, 15)
    .map((line, index) => `<text x="64" y="${292 + index * 34}" class="reading">${escapeSvgText(line)}</text>`)
    .join("");

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1260" viewBox="0 0 900 1260">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#d8f2e6"/>
        <stop offset="0.52" stop-color="#f9edc7"/>
        <stop offset="1" stop-color="#f8d4df"/>
      </linearGradient>
      <style>
        text { font-family: Arial, 'Microsoft YaHei', sans-serif; fill: #17211c; }
        .small { font-size: 28px; font-weight: 700; opacity: .62; }
        .name { font-size: 74px; font-weight: 900; }
        .score { font-size: 58px; font-weight: 900; }
        .label { font-size: 24px; font-weight: 800; opacity: .58; }
        .keyword { font-size: 56px; font-weight: 900; }
        .reading { font-size: 38px; font-weight: 800; }
        .boxText { font-size: 31px; font-weight: 850; }
        .footer { font-size: 26px; font-weight: 700; opacity: .68; }
      </style>
    </defs>
    <rect width="900" height="1260" rx="58" fill="url(#bg)"/>
    <circle cx="790" cy="120" r="190" fill="none" stroke="#17211c" stroke-opacity=".12" stroke-width="3"/>
    <circle cx="60" cy="910" r="150" fill="none" stroke="#17211c" stroke-opacity=".1" stroke-width="3"/>
    <text x="64" y="92" class="small">${escapeSvgText(data.date)}</text>
    <text x="64" y="170" class="name">${escapeSvgText(data.name)}</text>
    <circle cx="760" cy="132" r="70" fill="#ffffff" fill-opacity=".42" stroke="#17211c" stroke-opacity=".12"/>
    <text x="727" y="130" class="score">${escapeSvgText(data.score)}</text>
    <text x="731" y="165" class="label">能量</text>
    <rect x="64" y="218" width="330" height="104" rx="52" fill="#ffffff" fill-opacity=".42" stroke="#17211c" stroke-opacity=".1"/>
    <text x="92" y="258" class="label">今日关键词</text>
    <text x="92" y="304" class="keyword">${escapeSvgText(data.keyword)}</text>
    ${lines}
    <rect x="64" y="520" width="362" height="150" rx="30" fill="#ffffff" fill-opacity=".4" stroke="#17211c" stroke-opacity=".1"/>
    <text x="94" y="570" class="label">幸运色</text>
    <text x="94" y="624" class="boxText">${escapeSvgText(data.color)}</text>
    <rect x="474" y="520" width="362" height="150" rx="30" fill="#ffffff" fill-opacity=".4" stroke="#17211c" stroke-opacity=".1"/>
    <text x="504" y="570" class="label">幸运物</text>
    <text x="504" y="624" class="boxText">${escapeSvgText(data.item)}</text>
    <rect x="64" y="720" width="362" height="160" rx="30" fill="#ffffff" fill-opacity=".4" stroke="#17211c" stroke-opacity=".1"/>
    <text x="94" y="772" class="label">宜</text>
    <text x="94" y="828" class="boxText">${escapeSvgText(data.doText)}</text>
    <rect x="474" y="720" width="362" height="160" rx="30" fill="#ffffff" fill-opacity=".4" stroke="#17211c" stroke-opacity=".1"/>
    <text x="504" y="772" class="label">忌</text>
    <text x="504" y="828" class="boxText">${escapeSvgText(data.dontText)}</text>
    <text x="64" y="1080" class="footer">${escapeSvgText(data.share)}</text>
    <text x="64" y="1150" class="small">daily-fortune</text>
  </svg>`;

  const image = new Image();
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1260;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    const link = document.createElement("a");
    link.download = `今日运势-${data.name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  image.src = url;
}

form.addEventListener("submit", generateFortune);
rerollBtn.addEventListener("click", () => {
  seed = Date.now() + Math.floor(Math.random() * 10000);
  generateFortune();
});
downloadBtn.addEventListener("click", downloadCard);

generateFortune();
