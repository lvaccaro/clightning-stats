'use strict';
/* global document */
/* global qrcode */

setTimeout(() => {
	const aDom = document.getElementById('qrcodeid');

	const string = 'lnbc1pdls3l2pp5mu9wpg89c648jtld305rz3w7z5sn36acly99f06kd242dl4qge6qdqavdex2ct5v5kkzmne945kuan0d93k2cqp287pzk70fxr2u8jgqptnap4506jehf7qx7vdyv6y9efl75l9clwlxwej55xreyz8t9fa33r7t7z6mkwfe6le5anfr9wyvxytce66snqqpfx4esr';
	const qr = qrcode(0, 'M');
qr.addData(string);
qr.make();

	//  Return qr.createTableTag();
	//  return qr.createSvgTag();
aDom.innerHTML = qr.createImgTag();
}, 0);
