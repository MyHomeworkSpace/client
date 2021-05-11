/**
The code in this file was modified from https://github.com/duo-labs/webauthn.io,
released under the following license.

The following modifications were made:
- Converted to JavaScript module
- Changed "let" to "let" and "const" in several places
- Adjusted formatting to conform with MyHomeworkSpace styles ("npm run lint:fix")

---

BSD 3-Clause License

Copyright (c) 2019, Duo Labs
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";


const Arr = (typeof Uint8Array !== "undefined")
	? Uint8Array
	: Array;

const PLUS = "+".charCodeAt(0);
const SLASH = "/".charCodeAt(0);
const NUMBER = "0".charCodeAt(0);
const LOWER = "a".charCodeAt(0);
const UPPER = "A".charCodeAt(0);
const PLUS_URL_SAFE = "-".charCodeAt(0);
const SLASH_URL_SAFE = "_".charCodeAt(0);

function decode(elt) {
	const code = elt.charCodeAt(0);
	if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
	if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
	if (code < NUMBER) return -1; // no match
	if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
	if (code < UPPER + 26) return code - UPPER;
	if (code < LOWER + 26) return code - LOWER + 26;
}

export function base64ToByteArray(b64) {
	let i, j, l, tmp, placeHolders, arr;

	if (b64.length % 4 > 0) {
		throw new Error("Invalid string. Length must be a multiple of 4");
	}

	// the number of equal signs (place holders)
	// if there are two placeholders, than the two characters before it
	// represent one byte
	// if there is only one, then the three characters before it represent 2 bytes
	// this is just a cheap hack to not do indexOf twice
	let len = b64.length;
	placeHolders = b64.charAt(len - 2) === "=" ? 2 : b64.charAt(len - 1) === "=" ? 1 : 0;

	// base64 is 4/3 + up to two characters of the original data
	arr = new Arr(b64.length * 3 / 4 - placeHolders);

	// if there are placeholders, only get up to the last complete 4 chars
	l = placeHolders > 0 ? b64.length - 4 : b64.length;

	let L = 0;

	function push(v) {
		arr[L++] = v;
	}

	for (i = 0, j = 0; i < l; i += 4, j += 3) {
		tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3));
		push((tmp & 0xFF0000) >> 16);
		push((tmp & 0xFF00) >> 8);
		push(tmp & 0xFF);
	}

	if (placeHolders === 2) {
		tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4);
		push(tmp & 0xFF);
	} else if (placeHolders === 1) {
		tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2);
		push((tmp >> 8) & 0xFF);
		push(tmp & 0xFF);
	}

	return arr;
}

export function uint8ToBase64(uint8) {
	let i;
	let extraBytes = uint8.length % 3; // if we have 1 byte left, pad 2 bytes
	let output = "";
	let temp, length;

	function encode(num) {
		return lookup.charAt(num);
	}

	function tripletToBase64(num) {
		return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F);
	}

	// go through the array every three bytes, we'll deal with trailing stuff later
	for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
		temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
		output += tripletToBase64(temp);
	}

	// pad the end with zeros, but make sure to not forget the extra bytes
	switch (extraBytes) {
		case 1:
			temp = uint8[uint8.length - 1];
			output += encode(temp >> 2);
			output += encode((temp << 4) & 0x3F);
			output += "==";
			break;
		case 2:
			temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
			output += encode(temp >> 10);
			output += encode((temp >> 4) & 0x3F);
			output += encode((temp << 2) & 0x3F);
			output += "=";
			break;
		default:
			break;
	}

	return output;
}