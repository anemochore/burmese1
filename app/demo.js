/**
 * Created by anemochore on 2016-01-24.
 */
'use strict';

const TXT = 'ပျူစာ။ ။ ပျူမြို့ပြနိုင်ငံများသည် အေဒီ ၉-၁၀ ရာစုအထိ မြန်မာနိုင်ငံတွင် တည်ရှိခဲ့သည်ဟု သမိုင်းသုတေသီတို့က ယူဆကြသည်။ မြန်မာနိုင်ငံအနှံ့အပြားတွင် ပျူကျောက်စာများကို တွေ့ရသည်။ သို့သော် ယင်းကျောက်စာများတွင်း ခုနှစ်သက္ကရာဇ် မပါခြင်း၊ အချိန်ု့မှာ ဖတ်မရလောက်အောင် မှေးမှိန်နေခြင်းတို့ကြောင့် ပျူကျောက်စာများကို ခု၊ နှစ်ပိုင်းခြား၍ ပြောဆိုရန် အခက်အခဲရှိပေသည်။ အက္ခရာ ပုံသဏ္ဌာန်ကို မူတည်၍သာ ခေတ်ကို ရာစုအလိုက် ခန့်မှန်းပြောဆိုကြရပေသည်။ သို့သော် ၁၂ ရာစုအစ၌ ရေးထိုးထားသည့် ရာဇကုမာရ်ကျောက်စာ (ပျူဘာသာ) အရလည်းကောင်း၊ မူလအစ ဗြာဟ္မီက မြန်မာစာ အရေးအသား ပေါ်ပေါက်ဖြစ်ထွန်းပုံကို စူးစမ်းလေ့လာခဲ့ကြသော သုတေသီအားလုံးကပင် မြန်မာအရေးအသား၊ မြန်မာအက္ခရာသည် ခရစ်တော်မပေါ်မီ ဘီစီ ၅၀၀ ခန့်မှ အေဒီ ၃၀၀ ကျော်အထိ အိန္ဒိယဒေသတွင် ထွန်းကားခဲ့သည့် ဗြာဟ္မီအရေးအသား၌ မြစ်ဖျားခံသည်ဟု လက်ခံကြသည်။ ပျူစာများ။ ။ မြန်မာပြည် ဧရာဝတီမြစ်ဝှမ်း၌ အေဒီ ၄ ရာစုမှ ၆ ရာစုအထိ တွေ့ရသောစာများမှာ ပျူအက္ခရာ၊ ပျူဘာသာဖြင့် ရေးထိုးထားသည့် ကျောက်စာများ (ဟန်လင်း ပျူကျောက်စာစသည်) ပျူအက္ခရာဖြင့်ရေးထိုးသည့် ဘုရားဟော ကျမ်းဂန် ကောက်နုတ်ချက် ရွှေပေချပ်များ၊ ပျူ - သက္ကတ နှစ်ဘာသာရောကျောက်စာ စသည်တို့ဖြစ်သည်။';


var isMobile = false;

// http://www.gambit.ph/tip-detecting-a-mobile-browser-with-javascript/
if (navigator.userAgent.match(/Mobi/) ) {	// mobile
	isMobile = true;
}

// fps
const FPS = 30;
const INTERVAL = 1000 / FPS;
var now, then, elapsed;

// canvas
//var can = document.createElement('canvas');
var can = document.getElementById('canvas');
//document.body.appendChild(can);

var C_WIDTH;
var C_HEIGHT;

if(isMobile) {
	var deviceWidth = window.innerWidth;
	var deviceHeight = window.innerHeight;
	C_WIDTH = deviceWidth - 20;
	C_HEIGHT = deviceHeight * 0.6;

	can.addEventListener("touchmove", touchMove);
	can.addEventListener("touchstart", touchStart);
	can.addEventListener("touchend", touchEnd);
}
else {
	C_WIDTH = 576;
	C_HEIGHT = 480;

	can.addEventListener('mousemove', mouseMove);
	can.addEventListener('mousedown', mouseDown);
}

can.width = C_WIDTH;
can.height = C_HEIGHT;

const CAN_X_OFFSET = can.offsetLeft - window.pageXOffset;
const CAN_Y_OFFSET = can.offsetTop - window.pageYOffset;

var isPaused = false;

// touch
const TAP_INTERVAL = 600;	// ms
var touchStartTime;
var firstTapped = false;
var firstTapTime;
var lastAnimatedSprIndex = NaN;

// ctx
var ctx = can.getContext('2d');
ctx.textBaseline = 'top';

// multiplier
const SPR_ALPHA_M = 0.925;	// must be lesser than 1
const SPR_FONT_SIZE_M = 1.25;

// txtSprites
const FONT_NAME = 'Myanmar3';
const FONT_ALPHA_DEFAULT = 0.2;
const FONT_SIZE_RATIO_TO_CANVAS_HEIGHT = 32;

const FONT_SIZE_START = C_HEIGHT / FONT_SIZE_RATIO_TO_CANVAS_HEIGHT >> 0;
const FONT_HEIGHT = FONT_SIZE_START * 1.4 >> 0;	// 1.4 may vary depending on font
const LINE_SPACE = FONT_SIZE_START / 2 >> 0;
var spr = txt2Sprites(TXT);
var tmpSpr;
var numActive = 0;

var i;


go();


function go() {
	then = Date.now();

	// starting loop
	loop();
}

function loop() {
	requestAnimationFrame(loop);

	if(isPaused) return;

	// limiting fps
	now = Date.now();
	elapsed = now - then;
	if(elapsed <= INTERVAL) return;

	then = now - (elapsed % INTERVAL);

	update();
}

function update() {
	for (i = 0; i < numActive; i++) {
		spr[i].alpha *= SPR_ALPHA_M;
		if(spr[i].alpha < 0.1) {
			spr[i].fontSize = FONT_SIZE_START;
			spr[i].width = spr[i].oWidth;
			spr[i].height = spr[i].oHeight;
			spr[i].x1 = spr[i].oX;
			spr[i].y1 = spr[i].oY;
			
			deactivateSpr[i];
		}
		else {
			spr[i].fontSize *= SPR_FONT_SIZE_M;
			var deltaX = spr[i].width * SPR_FONT_SIZE_M - spr[i].width;
			var deltaY = spr[i].height * SPR_FONT_SIZE_M - spr[i].height;
			spr[i].width *= SPR_FONT_SIZE_M;
			spr[i].height *= SPR_FONT_SIZE_M;
			spr[i].x1 -= deltaX / 2;
			spr[i].y1 -= deltaY / 2;
		}
	}
	draw();
}

function draw() {
	// drawing goes below
	ctx.clearRect(0,0, C_WIDTH,C_HEIGHT);

	for (i = 0; i < numActive; i++) {
		ctx.fillStyle = rgba(spr[i].r, spr[i].g, spr[i].b, spr[i].alpha);
		ctx.font = spr[i].fontSize + 'px ' + FONT_NAME;
		ctx.fillText(spr[i].word, spr[i].x1,spr[i].y1);
	}
	for (i = numActive; i < spr.length; i++) {
		ctx.fillStyle = rgba(0, 0, 0, FONT_ALPHA_DEFAULT);
		ctx.font = spr[i].fontSize + 'px ' + FONT_NAME;
		ctx.fillText(spr[i].word, spr[i].x1,spr[i].y1);
	}
}

function txt2Sprites(text) {
	ctx.font = FONT_SIZE_START + 'px ' + FONT_NAME;

	var words = text.split(' ');
	var x0 = 0, y0 = FONT_HEIGHT / 2;
	var x = x0, y = y0;
	var line = '';

	var spr = [];
	var spaceWidth = (ctx.measureText(' ')).width;

	var isFull = false;

	for (i = 0; !isFull ; i++) {
		if(words[i] === undefined) i = 0;

		var testLine = line + words[i];
		var wordWidth = (ctx.measureText(words[i])).width;
		var testWidth = (ctx.measureText(testLine)).width;

		if (testWidth > C_WIDTH) {
			line = words[i] + ' ';

			y += FONT_HEIGHT + LINE_SPACE;
			if(y > C_HEIGHT - FONT_HEIGHT) {
				isFull = true;
				break;
			}
			x = x0;
		} else {
			line = testLine + ' ';
		}

		spr.push({
			word: words[i],
			oX: x,
			oY: y,
			oWidth: wordWidth,
			oHeight: FONT_SIZE_START,
			x1: x,
			y1: y,
			x2: x + wordWidth - 1,
			y2: y + FONT_HEIGHT - 1,
			width: wordWidth,
			height: FONT_SIZE_START,
			fontSize: FONT_SIZE_START,
			alpha: FONT_ALPHA_DEFAULT,
			r: Math.random() * 255 >> 0,
			g: Math.random() * 255 >> 0,
			b: Math.random() * 255 >> 0
			//isAnimating: false
		});

		x += wordWidth + spaceWidth - 1;
	}

	return spr;
}

function mouseMove(e) {
	if(isPaused) return;

	var x = e.clientX - CAN_X_OFFSET;
	var y = e.clientY - CAN_Y_OFFSET;

	checkSpr(x, y);
}

function mouseDown(e) {
	isPaused = !isPaused;
}

function touchMove(e) {
	e.preventDefault();
	if(isPaused) return;

	var x = e.touches[0].pageX - CAN_X_OFFSET;
	var y = e.touches[0].pageY - CAN_Y_OFFSET;

	checkSpr(x, y);
}

function touchStart(e) {
	e.preventDefault();
	touchStartTime = Date.now();
}

function touchEnd(e) {
	var rightNow = Date.now();

	if(rightNow - touchStartTime > TAP_INTERVAL / 2) return;	// not a tap

	// okay, it's a tap whatsoever
	if(firstTapped && (rightNow - firstTapTime < TAP_INTERVAL)) {	// and if it's a double-tap
		firstTapped = false;
		mouseDown(e);
	}
	else {	// if it's not a double-tap, it's a single-tap
		firstTapTime = rightNow;
		firstTapped = true;
	}
}

function checkSpr(x, y) {
	// I really miss actionScript here...
	for (i = numActive; i < spr.length; i++) {
		if(x >= spr[i].x1 && x <= spr[i].x2 &&
				y >= spr[i].y1 && y <= spr[i].y2 &&
				i != lastAnimatedSprIndex) {
			activateSpr(i);
			lastAnimatedSprIndex = i;
			break;
		}
	}
}

function activateSpr(i) {
	//spr[i].isAnimating = true;
	spr[i].alpha = 1.0;

	tmpSpr = spr[numActive];
	spr[numActive] = spr[i];
	spr[i] = tmpSpr;
	
	numActive++;
}

function deactivateSpr(i) {
	//spr[i].isAnimating = false;
	spr[i].alpha = 1.0;

	numActive--;
	
	tmpSpr = spr[numActive];
	spr[numActive] = spr[i];
	spr[i] = tmpSpr;
	
	console.log(numActive);
}

function rgba(r, g, b, a) {
	// r,g,b is [0, 255)
	// a is [0, 1)
	return 'rgba(' + String(r>>0) + ',' + String(g>>0) + ',' + String(b>>0) + ',' + a + ')';
}
