/*
trigram.js - Yet another trigram encoder/decoder

Copyright (c) 2017, PlasticHeart
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
The views and conclusions contained in the software and documentation are
those of the authors and should not be interpreted as representing official
policies, either expressed or implied, of the FreeBSD Project.
*/
var trigram = {
    encode: function(data) {
        var x = data.concat(0, 0, 0, 0);
        var r = '';
        for(var i = 0, j = data.length; i < j; i += 3) {
            var a = x[i + 0], b = x[i + 1], c = x[i + 2];
            r += String.fromCharCode.apply(null, [
                (a & 7),
                (a >> 3) & 7,
                (a >> 6) | ((b & 1) << 2),
                (b >> 1) & 7,
                (b >> 4) & 7,
                (b >> 7) | ((c & 3) << 1),
                (c >> 2) & 7,
                (c >> 5) & 7,
            ].map(function(e) {return 0x2637 - e}));
        }
        return r;
    },
    encodeString: function(s) {
        var r = [];
        encodeURIComponent(s).replace(/%[0-9A-Fa-f]{2}|./g, function(m) {
            r.push(m.length == 1 ? m.charCodeAt(0) : parseInt(m.substr(1), 16));
        });
        return trigram.encode(r);
    },
    decode: function(data) {
        var x = Array.from(
            data + '\u2637\u2637\u2637\u2637\u2637\u2637\u2637\u2637'
        ).map(function(e) {return 0x2637 - e.charCodeAt(0)});
        var h = function(n) {
            var h = n.toString(16);
            return h.length < 2 ? '0' + h : h;
        };
        var r = '';
        for(var i = 0, j = x.length; i < j; i += 8) {
            var a = x[i + 0] | (x[i + 1] << 3) | ((x[i + 2] & 3) << 6);
            var b = (x[i + 2] >> 2) | (x[i + 3] << 1) |
                (x[i + 4] << 4) | ((x[i + 5] & 1) << 7);
            var c = (x[i + 5] >> 1) | (x[i + 6] << 2) | (x[i + 7] << 5);
            r += decodeURIComponent('%' + h(a) + '%' + h(b) + '%' + h(c));
        }
        return r;
    }
}
