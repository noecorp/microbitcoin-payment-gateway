const window = {};

/*
			 * Crypto-JS v2.5.4
			 * http://code.google.com/p/crypto-js/
			 * (c) 2009-2012 by Jeff Mott. All rights reserved.
			 * http://code.google.com/p/crypto-js/wiki/License
			 */
(typeof Crypto=='undefined'||!Crypto.util)&&function() {
  var e=window.Crypto={};
  var f=e.util={
    rotl: function(a, b) {
      return a<<b|a>>>32-b;
    }, rotr: function(a, b) {
      return a<<32-b|a>>>b;
    }, endian: function(a) {
      if (a.constructor==Number) return f.rotl(a, 8)&16711935|f.rotl(a, 24)&4278255360; for (let b=0; b<a.length; b++)a[b]=f.endian(a[b]); return a;
    }, randomBytes: function(a) {
      for (var b=[]; a>0; a--)b.push(Math.floor(Math.random()*256)); return b;
    }, bytesToWords: function(a) {
      for (var b=[], c=0, d=0; c<a.length; c++, d+=8) {
        b[d>>>5]|=(a[c]&255)<<
			24-d%32;
      } return b;
    }, wordsToBytes: function(a) {
      for (var b=[], c=0; c<a.length*32; c+=8)b.push(a[c>>>5]>>>24-c%32&255); return b;
    }, bytesToHex: function(a) {
      for (var b=[], c=0; c<a.length; c++)b.push((a[c]>>>4).toString(16)), b.push((a[c]&15).toString(16)); return b.join('');
    }, hexToBytes: function(a) {
      for (var b=[], c=0; c<a.length; c+=2)b.push(parseInt(a.substr(c, 2), 16)); return b;
    }, bytesToBase64: function(a) {
      for (var b=[], c=0; c<a.length; c+=3) {
        for (let d=a[c]<<16|a[c+1]<<8|a[c+2], e=0; e<4; e++) {
c*8+e*6<=a.length*8?b.push('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.charAt(d>>>
			6*(3-e)&63)):b.push('=');
        }
      } return b.join('');
    }, base64ToBytes: function(a) {
      for (var a=a.replace(/[^A-Z0-9+\/]/ig, ''), b=[], c=0, d=0; c<a.length; d=++c%4)d!=0&&b.push(('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(a.charAt(c-1))&Math.pow(2, -2*d+8)-1)<<d*2|'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(a.charAt(c))>>>6-d*2); return b;
    }}; var e=e.charenc={}; e.UTF8={stringToBytes: function(a) {
    return g.stringToBytes(unescape(encodeURIComponent(a)));
  }, bytesToString: function(a) {
    return decodeURIComponent(escape(g.bytesToString(a)));
  }};
  var g=e.Binary={stringToBytes: function(a) {
    for (var b=[], c=0; c<a.length; c++)b.push(a.charCodeAt(c)&255); return b;
  }, bytesToString: function(a) {
    for (var b=[], c=0; c<a.length; c++)b.push(String.fromCharCode(a[c])); return b.join('');
  }};
}();

/*
			 * Crypto-JS v2.5.4
			 * http://code.google.com/p/crypto-js/
			 * (c) 2009-2012 by Jeff Mott. All rights reserved.
			 * http://code.google.com/p/crypto-js/wiki/License
			 */
(typeof Crypto=='undefined'||!Crypto.util)&&function() {
  var f=window.Crypto={}; var l=f.util={rotl: function(b, a) {
    return b<<a|b>>>32-a;
  }, rotr: function(b, a) {
    return b<<32-a|b>>>a;
  }, endian: function(b) {
    if (b.constructor==Number) return l.rotl(b, 8)&16711935|l.rotl(b, 24)&4278255360; for (let a=0; a<b.length; a++)b[a]=l.endian(b[a]); return b;
  }, randomBytes: function(b) {
    for (var a=[]; b>0; b--)a.push(Math.floor(Math.random()*256)); return a;
  }, bytesToWords: function(b) {
    for (var a=[], c=0, d=0; c<b.length; c++, d+=8) {
      a[d>>>5]|=(b[c]&255)<<
			24-d%32;
    } return a;
  }, wordsToBytes: function(b) {
    for (var a=[], c=0; c<b.length*32; c+=8)a.push(b[c>>>5]>>>24-c%32&255); return a;
  }, bytesToHex: function(b) {
    for (var a=[], c=0; c<b.length; c++)a.push((b[c]>>>4).toString(16)), a.push((b[c]&15).toString(16)); return a.join('');
  }, hexToBytes: function(b) {
    for (var a=[], c=0; c<b.length; c+=2)a.push(parseInt(b.substr(c, 2), 16)); return a;
  }, bytesToBase64: function(b) {
    for (var a=[], c=0; c<b.length; c+=3) {
      for (let d=b[c]<<16|b[c+1]<<8|b[c+2], q=0; q<4; q++) {
c*8+q*6<=b.length*8?a.push('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.charAt(d>>>
			6*(3-q)&63)):a.push('=');
      }
    } return a.join('');
  }, base64ToBytes: function(b) {
    for (var b=b.replace(/[^A-Z0-9+\/]/ig, ''), a=[], c=0, d=0; c<b.length; d=++c%4)d!=0&&a.push(('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(b.charAt(c-1))&Math.pow(2, -2*d+8)-1)<<d*2|'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(b.charAt(c))>>>6-d*2); return a;
  }}; var f=f.charenc={}; f.UTF8={stringToBytes: function(b) {
    return i.stringToBytes(unescape(encodeURIComponent(b)));
  }, bytesToString: function(b) {
    return decodeURIComponent(escape(i.bytesToString(b)));
  }};
  var i=f.Binary={stringToBytes: function(b) {
    for (var a=[], c=0; c<b.length; c++)a.push(b.charCodeAt(c)&255); return a;
  }, bytesToString: function(b) {
    for (var a=[], c=0; c<b.length; c++)a.push(String.fromCharCode(b[c])); return a.join('');
  }};
}();
(function() {
  const f=window.Crypto;
  const l=f.util;
  const i=f.charenc;
  const b=i.UTF8;
  const a=i.Binary;
  const c=[1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921,
    2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
  var d=f.SHA256=function(b, c) {
    const e=l.wordsToBytes(d._sha256(b)); return c&&c.asBytes?e:c&&c.asString?a.bytesToString(e):l.bytesToHex(e);
  }; d._sha256=function(a) {
    a.constructor==String&&(a=b.stringToBytes(a)); const d=l.bytesToWords(a); let e=a.length*8; var a=[1779033703, 3144134277,
      1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]; const f=[]; let m; let n; let i; let h; let o; let p; let r; let s; let g; let k; let j; d[e>>5]|=128<<24-e%32; d[(e+64>>9<<4)+15]=e; for (s=0; s<d.length; s+=16) {
      e=a[0]; m=a[1]; n=a[2]; i=a[3]; h=a[4]; o=a[5]; p=a[6]; r=a[7]; for (g=0; g<64; g++) {
g<16?f[g]=d[g+s]:(k=f[g-15], j=f[g-2], f[g]=((k<<25|k>>>7)^(k<<14|k>>>18)^k>>>3)+(f[g-7]>>>0)+((j<<15|j>>>17)^(j<<13|j>>>19)^j>>>10)+(f[g-16]>>>0)); j=e&m^e&n^m&n; const t=(e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22); k=(r>>>0)+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+
			(h&o^~h&p)+c[g]+(f[g]>>>0); j=t+j; r=p; p=o; o=h; h=i+k>>>0; i=n; n=m; m=e; e=k+j>>>0;
      }a[0]+=e; a[1]+=m; a[2]+=n; a[3]+=i; a[4]+=h; a[5]+=o; a[6]+=p; a[7]+=r;
    } return a;
  }; d._blocksize=16; d._digestsize=32;
})();

/*
			 * Crypto-JS v2.5.4
			 * http://code.google.com/p/crypto-js/
			 * (c) 2009-2012 by Jeff Mott. All rights reserved.
			 * http://code.google.com/p/crypto-js/wiki/License
			 */
(typeof Crypto=='undefined'||!Crypto.util)&&function() {
  var d=window.Crypto={}; var k=d.util={rotl: function(b, a) {
    return b<<a|b>>>32-a;
  }, rotr: function(b, a) {
    return b<<32-a|b>>>a;
  }, endian: function(b) {
    if (b.constructor==Number) return k.rotl(b, 8)&16711935|k.rotl(b, 24)&4278255360; for (let a=0; a<b.length; a++)b[a]=k.endian(b[a]); return b;
  }, randomBytes: function(b) {
    for (var a=[]; b>0; b--)a.push(Math.floor(Math.random()*256)); return a;
  }, bytesToWords: function(b) {
    for (var a=[], c=0, e=0; c<b.length; c++, e+=8) {
      a[e>>>5]|=(b[c]&255)<<
			24-e%32;
    } return a;
  }, wordsToBytes: function(b) {
    for (var a=[], c=0; c<b.length*32; c+=8)a.push(b[c>>>5]>>>24-c%32&255); return a;
  }, bytesToHex: function(b) {
    for (var a=[], c=0; c<b.length; c++)a.push((b[c]>>>4).toString(16)), a.push((b[c]&15).toString(16)); return a.join('');
  }, hexToBytes: function(b) {
    for (var a=[], c=0; c<b.length; c+=2)a.push(parseInt(b.substr(c, 2), 16)); return a;
  }, bytesToBase64: function(b) {
    for (var a=[], c=0; c<b.length; c+=3) {
      for (let e=b[c]<<16|b[c+1]<<8|b[c+2], p=0; p<4; p++) {
c*8+p*6<=b.length*8?a.push('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.charAt(e>>>
			6*(3-p)&63)):a.push('=');
      }
    } return a.join('');
  }, base64ToBytes: function(b) {
    for (var b=b.replace(/[^A-Z0-9+\/]/ig, ''), a=[], c=0, e=0; c<b.length; e=++c%4)e!=0&&a.push(('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(b.charAt(c-1))&Math.pow(2, -2*e+8)-1)<<e*2|'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(b.charAt(c))>>>6-e*2); return a;
  }}; var d=d.charenc={}; d.UTF8={stringToBytes: function(b) {
    return g.stringToBytes(unescape(encodeURIComponent(b)));
  }, bytesToString: function(b) {
    return decodeURIComponent(escape(g.bytesToString(b)));
  }};
  var g=d.Binary={stringToBytes: function(b) {
    for (var a=[], c=0; c<b.length; c++)a.push(b.charCodeAt(c)&255); return a;
  }, bytesToString: function(b) {
    for (var a=[], c=0; c<b.length; c++)a.push(String.fromCharCode(b[c])); return a.join('');
  }};
}();
(function() {
  const d=window.Crypto; const k=d.util; const g=d.charenc; const b=g.UTF8; const a=g.Binary; const c=[1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921,
    2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]; var e=d.SHA256=function(b, c) {
    const f=k.wordsToBytes(e._sha256(b)); return c&&c.asBytes?f:c&&c.asString?a.bytesToString(f):k.bytesToHex(f);
  }; e._sha256=function(a) {
    a.constructor==String&&(a=b.stringToBytes(a)); const e=k.bytesToWords(a); let f=a.length*8; var a=[1779033703, 3144134277,
      1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]; const d=[]; let g; let m; let r; let i; let n; let o; let s; let t; let h; let l; let j; e[f>>5]|=128<<24-f%32; e[(f+64>>9<<4)+15]=f; for (t=0; t<e.length; t+=16) {
      f=a[0]; g=a[1]; m=a[2]; r=a[3]; i=a[4]; n=a[5]; o=a[6]; s=a[7]; for (h=0; h<64; h++) {
h<16?d[h]=e[h+t]:(l=d[h-15], j=d[h-2], d[h]=((l<<25|l>>>7)^(l<<14|l>>>18)^l>>>3)+(d[h-7]>>>0)+((j<<15|j>>>17)^(j<<13|j>>>19)^j>>>10)+(d[h-16]>>>0)); j=f&g^f&m^g&m; const u=(f<<30|f>>>2)^(f<<19|f>>>13)^(f<<10|f>>>22); l=(s>>>0)+((i<<26|i>>>6)^(i<<21|i>>>11)^(i<<7|i>>>25))+
			(i&n^~i&o)+c[h]+(d[h]>>>0); j=u+j; s=o; o=n; n=i; i=r+l>>>0; r=m; m=g; g=f; f=l+j>>>0;
      }a[0]+=f; a[1]+=g; a[2]+=m; a[3]+=r; a[4]+=i; a[5]+=n; a[6]+=o; a[7]+=s;
    } return a;
  }; e._blocksize=16; e._digestsize=32;
})();
(function() {
  const d=window.Crypto; const k=d.util; const g=d.charenc; const b=g.UTF8; const a=g.Binary; d.HMAC=function(c, e, d, g) {
    e.constructor==String&&(e=b.stringToBytes(e)); d.constructor==String&&(d=b.stringToBytes(d)); d.length>c._blocksize*4&&(d=c(d, {asBytes: !0})); for (var f=d.slice(0), d=d.slice(0), q=0; q<c._blocksize*4; q++)f[q]^=92, d[q]^=54; c=c(f.concat(c(d.concat(e), {asBytes: !0})), {asBytes: !0}); return g&&g.asBytes?c:g&&g.asString?a.bytesToString(c):k.bytesToHex(c);
  };
})();

(function() {/*
			 A JavaScript implementation of the SHA family of hashes, as defined in FIPS
			 PUB 180-2 as well as the corresponding HMAC implementation as defined in
			 FIPS PUB 198a

			 Copyright Brian Turek 2008-2012
			 Distributed under the BSD License
			 See http://caligatio.github.com/jsSHA/ for more information

			 Several functions taken from Paul Johnson
			*/
  function n(a) {
    throw a;
  } const q=null; function s(a, b) {
    this.a=a; this.b=b;
  } function u(a, b) {
    const d=[]; const h=(1<<b)-1; const f=a.length*b; let g; for (g=0; g<f; g+=b)d[g>>>5]|=(a.charCodeAt(g/b)&h)<<32-b-g%32; return {value: d, binLen: f};
  } function x(a) {
    const b=[]; const d=a.length; let h; let f; 0!==d%2&&n('String of HEX type must be in byte increments'); for (h=0; h<d; h+=2)f=parseInt(a.substr(h, 2), 16), isNaN(f)&&n('String of HEX type contains invalid characters'), b[h>>>3]|=f<<24-4*(h%8); return {value: b, binLen: 4*d};
  }
  function B(a) {
    const b=[]; let d=0; let h; let f; let g; let k; let m; -1===a.search(/^[a-zA-Z0-9=+\/]+$/)&&n('Invalid character in base-64 string'); h=a.indexOf('='); a=a.replace(/\=/g, ''); -1!==h&&h<a.length&&n('Invalid \'=\' found in base-64 string'); for (f=0; f<a.length; f+=4) {
      m=a.substr(f, 4); for (g=k=0; g<m.length; g+=1)h='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(m[g]), k|=h<<18-6*g; for (g=0; g<m.length-1; g+=1)b[d>>2]|=(k>>>16-8*g&255)<<24-8*(d%4), d+=1;
    } return {value: b, binLen: 8*d};
  }
  function E(a, b) {
    let d=''; const h=4*a.length; let f; let g; for (f=0; f<h; f+=1)g=a[f>>>2]>>>8*(3-f%4), d+='0123456789abcdef'.charAt(g>>>4&15)+'0123456789abcdef'.charAt(g&15); return b.outputUpper?d.toUpperCase():d;
  }
  function F(a, b) {
    let d=''; const h=4*a.length; let f; let g; let k; for (f=0; f<h; f+=3) {
      k=(a[f>>>2]>>>8*(3-f%4)&255)<<16|(a[f+1>>>2]>>>8*(3-(f+1)%4)&255)<<8|a[f+2>>>2]>>>8*(3-(f+2)%4)&255; for (g=0; 4>g; g+=1)d=8*f+6*g<=32*a.length?d+'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.charAt(k>>>6*(3-g)&63):d+b.b64Pad;
    } return d;
  }
  function G(a) {
    const b={outputUpper: !1, b64Pad: '='}; try {
      a.hasOwnProperty('outputUpper')&&(b.outputUpper=a.outputUpper), a.hasOwnProperty('b64Pad')&&(b.b64Pad=a.b64Pad);
    } catch (d) {}'boolean'!==typeof b.outputUpper&&n('Invalid outputUpper formatting option'); 'string'!==typeof b.b64Pad&&n('Invalid b64Pad formatting option'); return b;
  }
  function H(a, b) {
    var d=q; var d=new s(a.a, a.b); return d=32>=b?new s(d.a>>>b|d.b<<32-b&4294967295, d.b>>>b|d.a<<32-b&4294967295):new s(d.b>>>b-32|d.a<<64-b&4294967295, d.a>>>b-32|d.b<<64-b&4294967295);
  } function I(a, b) {
    let d=q; return d=32>=b?new s(a.a>>>b, a.b>>>b|a.a<<32-b&4294967295):new s(0, a.a>>>b-32);
  } function J(a, b, d) {
    return new s(a.a&b.a^~a.a&d.a, a.b&b.b^~a.b&d.b);
  } function U(a, b, d) {
    return new s(a.a&b.a^a.a&d.a^b.a&d.a, a.b&b.b^a.b&d.b^b.b&d.b);
  }
  function V(a) {
    const b=H(a, 28); const d=H(a, 34); a=H(a, 39); return new s(b.a^d.a^a.a, b.b^d.b^a.b);
  } function W(a) {
    const b=H(a, 14); const d=H(a, 18); a=H(a, 41); return new s(b.a^d.a^a.a, b.b^d.b^a.b);
  } function X(a) {
    const b=H(a, 1); const d=H(a, 8); a=I(a, 7); return new s(b.a^d.a^a.a, b.b^d.b^a.b);
  } function Y(a) {
    const b=H(a, 19); const d=H(a, 61); a=I(a, 6); return new s(b.a^d.a^a.a, b.b^d.b^a.b);
  }
  function Z(a, b) {
    let d; let h; let f; d=(a.b&65535)+(b.b&65535); h=(a.b>>>16)+(b.b>>>16)+(d>>>16); f=(h&65535)<<16|d&65535; d=(a.a&65535)+(b.a&65535)+(h>>>16); h=(a.a>>>16)+(b.a>>>16)+(d>>>16); return new s((h&65535)<<16|d&65535, f);
  }
  function aa(a, b, d, h) {
    let f; let g; let k; f=(a.b&65535)+(b.b&65535)+(d.b&65535)+(h.b&65535); g=(a.b>>>16)+(b.b>>>16)+(d.b>>>16)+(h.b>>>16)+(f>>>16); k=(g&65535)<<16|f&65535; f=(a.a&65535)+(b.a&65535)+(d.a&65535)+(h.a&65535)+(g>>>16); g=(a.a>>>16)+(b.a>>>16)+(d.a>>>16)+(h.a>>>16)+(f>>>16); return new s((g&65535)<<16|f&65535, k);
  }
  function ba(a, b, d, h, f) {
    let g; let k; let m; g=(a.b&65535)+(b.b&65535)+(d.b&65535)+(h.b&65535)+(f.b&65535); k=(a.b>>>16)+(b.b>>>16)+(d.b>>>16)+(h.b>>>16)+(f.b>>>16)+(g>>>16); m=(k&65535)<<16|g&65535; g=(a.a&65535)+(b.a&65535)+(d.a&65535)+(h.a&65535)+(f.a&65535)+(k>>>16); k=(a.a>>>16)+(b.a>>>16)+(d.a>>>16)+(h.a>>>16)+(f.a>>>16)+(g>>>16); return new s((k&65535)<<16|g&65535, m);
  }
  function $(a, b, d) {
    let h; let f; let g; let k; let m; let j; let A; let C; let K; let e; let L; let v; let l; let M; let t; let p; let y; let z; let r; let N; let O; let P; let Q; let R; let c; let S; const w=[]; let T; let D; 'SHA-384'===d||'SHA-512'===d?(L=80, h=(b+128>>>10<<5)+31, M=32, t=2, c=s, p=Z, y=aa, z=ba, r=X, N=Y, O=V, P=W, R=U, Q=J, S=[new c(1116352408, 3609767458), new c(1899447441, 602891725), new c(3049323471, 3964484399), new c(3921009573, 2173295548), new c(961987163, 4081628472), new c(1508970993, 3053834265), new c(2453635748, 2937671579), new c(2870763221, 3664609560), new c(3624381080, 2734883394), new c(310598401, 1164996542), new c(607225278, 1323610764),
      new c(1426881987, 3590304994), new c(1925078388, 4068182383), new c(2162078206, 991336113), new c(2614888103, 633803317), new c(3248222580, 3479774868), new c(3835390401, 2666613458), new c(4022224774, 944711139), new c(264347078, 2341262773), new c(604807628, 2007800933), new c(770255983, 1495990901), new c(1249150122, 1856431235), new c(1555081692, 3175218132), new c(1996064986, 2198950837), new c(2554220882, 3999719339), new c(2821834349, 766784016), new c(2952996808, 2566594879), new c(3210313671, 3203337956), new c(3336571891,
          1034457026), new c(3584528711, 2466948901), new c(113926993, 3758326383), new c(338241895, 168717936), new c(666307205, 1188179964), new c(773529912, 1546045734), new c(1294757372, 1522805485), new c(1396182291, 2643833823), new c(1695183700, 2343527390), new c(1986661051, 1014477480), new c(2177026350, 1206759142), new c(2456956037, 344077627), new c(2730485921, 1290863460), new c(2820302411, 3158454273), new c(3259730800, 3505952657), new c(3345764771, 106217008), new c(3516065817, 3606008344), new c(3600352804, 1432725776), new c(4094571909,
          1467031594), new c(275423344, 851169720), new c(430227734, 3100823752), new c(506948616, 1363258195), new c(659060556, 3750685593), new c(883997877, 3785050280), new c(958139571, 3318307427), new c(1322822218, 3812723403), new c(1537002063, 2003034995), new c(1747873779, 3602036899), new c(1955562222, 1575990012), new c(2024104815, 1125592928), new c(2227730452, 2716904306), new c(2361852424, 442776044), new c(2428436474, 593698344), new c(2756734187, 3733110249), new c(3204031479, 2999351573), new c(3329325298, 3815920427), new c(3391569614,
          3928383900), new c(3515267271, 566280711), new c(3940187606, 3454069534), new c(4118630271, 4000239992), new c(116418474, 1914138554), new c(174292421, 2731055270), new c(289380356, 3203993006), new c(460393269, 320620315), new c(685471733, 587496836), new c(852142971, 1086792851), new c(1017036298, 365543100), new c(1126000580, 2618297676), new c(1288033470, 3409855158), new c(1501505948, 4234509866), new c(1607167915, 987167468), new c(1816402316, 1246189591)], e='SHA-384'===d?[new c(3418070365, 3238371032), new c(1654270250, 914150663),
            new c(2438529370, 812702999), new c(355462360, 4144912697), new c(1731405415, 4290775857), new c(41048885895, 1750603025), new c(3675008525, 1694076839), new c(1203062813, 3204075428)]:[new c(1779033703, 4089235720), new c(3144134277, 2227873595), new c(1013904242, 4271175723), new c(2773480762, 1595750129), new c(1359893119, 2917565137), new c(2600822924, 725511199), new c(528734635, 4215389547), new c(1541459225, 327033209)]):n('Unexpected error in SHA-2 implementation'); a[b>>>5]|=128<<24-b%32; a[h]=b; T=a.length; for (v=0; v<
			T; v+=M) {
      b=e[0]; h=e[1]; f=e[2]; g=e[3]; k=e[4]; m=e[5]; j=e[6]; A=e[7]; for (l=0; l<L; l+=1)w[l]=16>l?new c(a[l*t+v], a[l*t+v+1]):y(N(w[l-2]), w[l-7], r(w[l-15]), w[l-16]), C=z(A, P(k), Q(k, m, j), S[l], w[l]), K=p(O(b), R(b, h, f)), A=j, j=m, m=k, k=p(g, C), g=f, f=h, h=b, b=p(C, K); e[0]=p(b, e[0]); e[1]=p(h, e[1]); e[2]=p(f, e[2]); e[3]=p(g, e[3]); e[4]=p(k, e[4]); e[5]=p(m, e[5]); e[6]=p(j, e[6]); e[7]=p(A, e[7]);
    }'SHA-384'===d?D=[e[0].a, e[0].b, e[1].a, e[1].b, e[2].a, e[2].b, e[3].a, e[3].b, e[4].a, e[4].b, e[5].a, e[5].b]:'SHA-512'===d?D=[e[0].a, e[0].b,
			  e[1].a, e[1].b, e[2].a, e[2].b, e[3].a, e[3].b, e[4].a, e[4].b, e[5].a, e[5].b, e[6].a, e[6].b, e[7].a, e[7].b]:n('Unexpected error in SHA-2 implementation'); return D;
  }
  window.jsSHA=function(a, b, d) {
    let h=q; let f=q; let g=0; let k=[0]; var m=0; let j=q; var m='undefined'!==typeof d?d:8; 8===m||16===m||n('charSize must be 8 or 16'); 'HEX'===b?(0!==a.length%2&&n('srcString of HEX type must be in byte increments'), j=x(a), g=j.binLen, k=j.value):'ASCII'===b||'TEXT'===b?(j=u(a, m), g=j.binLen, k=j.value):'B64'===b?(j=B(a), g=j.binLen, k=j.value):n('inputFormat must be HEX, TEXT, ASCII, or B64'); this.getHash=function(a, b, d) {
      let e=q; const m=k.slice(); let j=''; switch (b) {
        case 'HEX': e=E; break; case 'B64': e=F; break; default: n('format must be HEX or B64');
      }'SHA-384'===
			a?(q===h&&(h=$(m, g, a)), j=e(h, G(d))):'SHA-512'===a?(q===f&&(f=$(m, g, a)), j=e(f, G(d))):n('Chosen SHA variant is not supported'); return j;
    }; this.getHMAC=function(a, b, d, e, f) {
      let h; let l; let j; let t; let p; const y=[]; const z=[]; let r=q; switch (e) {
        case 'HEX': h=E; break; case 'B64': h=F; break; default: n('outputFormat must be HEX or B64');
      }'SHA-384'===d?(j=128, p=384):'SHA-512'===d?(j=128, p=512):n('Chosen SHA variant is not supported'); 'HEX'===b?(r=x(a), t=r.binLen, l=r.value):'ASCII'===b||'TEXT'===b?(r=u(a, m), t=r.binLen, l=r.value):'B64'===b?(r=B(a),
      t=r.binLen, l=r.value):n('inputFormat must be HEX, TEXT, ASCII, or B64'); a=8*j; b=j/4-1; j<t/8?(l=$(l, t, d), l[b]&=4294967040):j>t/8&&(l[b]&=4294967040); for (j=0; j<=b; j+=1)y[j]=l[j]^909522486, z[j]=l[j]^1549556828; d=$(z.concat($(y.concat(k), a+g, d)), a+p, d); return h(d, G(f));
    };
  };
})();

/*
			CryptoJS v3.1.2
			code.google.com/p/crypto-js
			(c) 2009-2013 by Jeff Mott. All rights reserved.
			code.google.com/p/crypto-js/wiki/License
			*/
/** @preserve
			(c) 2012 by Cédric Mesnil. All rights reserved.

			Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

				- Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
				- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

			THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
			*/

const zl=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]; const zr=[5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]; const sl=[11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]; const sr=[8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]; const hl=[0, 1518500249, 1859775393, 2400959708, 2840853838]; const hr=[1352829926, 1548603684, 1836072691, 2053994217, 0]; const bytesToWords=function(r) {
  for (var n=[], o=0, t=0; o<r.length; o++, t+=8)n[t>>>5]|=r[o]<<24-t%32; return n;
}; const wordsToBytes=function(r) {
  for (var n=[], o=0; o<32*r.length; o+=8)n.push(r[o>>>5]>>>24-o%32&255); return n;
}; const processBlock=function(r, n, o) {
  for (var t=0; t<16; t++) {
    const f=o+t; const l=n[f]; n[f]=16711935&(l<<8|l>>>24)|4278255360&(l<<24|l>>>8);
  } let e; let u; let h; let s; let c; let i; let a; let v; let d; let g; let p; i=e=r[0], a=u=r[1], v=h=r[2], d=s=r[3], g=c=r[4]; for (t=0; t<80; t+=1)p=e+n[o+zl[t]]|0, p+=t<16?f1(u, h, s)+hl[0]:t<32?f2(u, h, s)+hl[1]:t<48?f3(u, h, s)+hl[2]:t<64?f4(u, h, s)+hl[3]:f5(u, h, s)+hl[4], p=(p=rotl(p|=0, sl[t]))+c|0, e=c, c=s, s=rotl(h, 10), h=u, u=p, p=i+n[o+zr[t]]|0, p+=t<16?f5(a, v, d)+hr[0]:t<32?f4(a, v, d)+hr[1]:t<48?f3(a, v, d)+hr[2]:t<64?f2(a, v, d)+hr[3]:f1(a, v, d)+hr[4], p=(p=rotl(p|=0, sr[t]))+g|0, i=g, g=d, d=rotl(v, 10), v=a, a=p; p=r[1]+h+d|0, r[1]=r[2]+s+g|0, r[2]=r[3]+c+i|0, r[3]=r[4]+e+a|0, r[4]=r[0]+u+v|0, r[0]=p;
}; function f1(r, n, o) {
  return r^n^o;
} function f2(r, n, o) {
  return r&n|~r&o;
} function f3(r, n, o) {
  return (r|~n)^o;
} function f4(r, n, o) {
  return r&o|n&~o;
} function f5(r, n, o) {
  return r^(n|~o);
} function rotl(r, n) {
  return r<<n|r>>>32-n;
} function ripemd160(r) {
  const n=[1732584193, 4023233417, 2562383102, 271733878, 3285377520]; const o=bytesToWords(r); const t=8*r.length; const f=8*r.length; o[t>>>5]|=128<<24-t%32, o[14+(t+64>>>9<<4)]=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8); for (var l=0; l<o.length; l+=16)processBlock(n, o, l); for (l=0; l<5; l++) {
    const e=n[l]; n[l]=16711935&(e<<8|e>>>24)|4278255360&(e<<24|e>>>8);
  } return wordsToBytes(n);
}

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// Basic JavaScript BN library - subset useful for RSA encryption.
// Bits per digit
let dbits; const canary=0xdeadbeefcafe; const j_lm=15715070==(16777215&canary); function BigInteger(t, r, o) {
  if (!(this instanceof BigInteger)) return new BigInteger(t, r, o); null!=t&&('number'==typeof t?this.fromNumber(t, r, o):null==r&&'string'!=typeof t?this.fromString(t, 256):this.fromString(t, r));
} const proto=BigInteger.prototype; function nbi() {
  return new BigInteger(null);
} function am1(t, r, o, n, i, e) {
  for (;--e>=0;) {
    const s=r*this[t++]+o[n]+i; i=Math.floor(s/67108864), o[n++]=67108863&s;
  } return i;
} function am2(t, r, o, n, i, e) {
  for (let s=32767&r, u=r>>15; --e>=0;) {
    let h=32767&this[t]; const f=this[t++]>>15; const a=u*h+f*s; i=((h=s*h+((32767&a)<<15)+o[n]+(1073741823&i))>>>30)+(a>>>15)+u*f+(i>>>30), o[n++]=1073741823&h;
  } return i;
} function am3(t, r, o, n, i, e) {
  for (let s=16383&r, u=r>>14; --e>=0;) {
    let h=16383&this[t]; const f=this[t++]>>14; const a=u*h+f*s; i=((h=s*h+((16383&a)<<14)+o[n]+i)>>28)+(a>>14)+u*f, o[n++]=268435455&h;
  } return i;
}BigInteger.prototype.am=am1, dbits=26, BigInteger.prototype.DB=dbits, BigInteger.prototype.DM=(1<<dbits)-1; const DV=BigInteger.prototype.DV=1<<dbits; const BI_FP=52; BigInteger.prototype.FV=Math.pow(2, BI_FP), BigInteger.prototype.F1=BI_FP-dbits, BigInteger.prototype.F2=2*dbits-BI_FP; let rr; let vv; const BI_RM='0123456789abcdefghijklmnopqrstuvwxyz'; const BI_RC=new Array; for (rr='0'.charCodeAt(0), vv=0; vv<=9; ++vv)BI_RC[rr++]=vv; for (rr='a'.charCodeAt(0), vv=10; vv<36; ++vv)BI_RC[rr++]=vv; for (rr='A'.charCodeAt(0), vv=10; vv<36; ++vv)BI_RC[rr++]=vv; function int2char(t) {
  return BI_RM.charAt(t);
} function intAt(t, r) {
  const o=BI_RC[t.charCodeAt(r)]; return null==o?-1:o;
} function bnpCopyTo(t) {
  for (let r=this.t-1; r>=0; --r)t[r]=this[r]; t.t=this.t, t.s=this.s;
} function bnpFromInt(t) {
  this.t=1, this.s=t<0?-1:0, t>0?this[0]=t:t<-1?this[0]=t+DV:this.t=0;
} function nbv(t) {
  const r=nbi(); return r.fromInt(t), r;
} function bnpFromString(t, r) {
  let o; const n=this; if (16==r)o=4; else if (8==r)o=3; else if (256==r)o=8; else if (2==r)o=1; else if (32==r)o=5; else {
    if (4!=r) return void n.fromRadix(t, r); o=2;
  }n.t=0, n.s=0; for (var i=t.length, e=!1, s=0; --i>=0;) {
    const u=8==o?255&t[i]:intAt(t, i); u<0?'-'==t.charAt(i)&&(e=!0):(e=!1, 0==s?n[n.t++]=u:s+o>n.DB?(n[n.t-1]|=(u&(1<<n.DB-s)-1)<<s, n[n.t++]=u>>n.DB-s):n[n.t-1]|=u<<s, (s+=o)>=n.DB&&(s-=n.DB));
  }8==o&&0!=(128&t[0])&&(n.s=-1, s>0&&(n[n.t-1]|=(1<<n.DB-s)-1<<s)), n.clamp(), e&&BigInteger.ZERO.subTo(n, n);
} function bnpClamp() {
  for (let t=this.s&this.DM; this.t>0&&this[this.t-1]==t;)--this.t;
} function bnToString(t) {
  let r; const o=this; if (o.s<0) return '-'+o.negate().toString(t); if (16==t)r=4; else if (8==t)r=3; else if (2==t)r=1; else if (32==t)r=5; else {
    if (4!=t) return o.toRadix(t); r=2;
  } let n; const i=(1<<r)-1; let e=!1; let s=''; let u=o.t; let h=o.DB-u*o.DB%r; if (u-- >0) for (h<o.DB&&(n=o[u]>>h)>0&&(e=!0, s=int2char(n)); u>=0;)h<r?(n=(o[u]&(1<<h)-1)<<r-h, n|=o[--u]>>(h+=o.DB-r)):(n=o[u]>>(h-=r)&i, h<=0&&(h+=o.DB, --u)), n>0&&(e=!0), e&&(s+=int2char(n)); return e?s:'0';
} function bnNegate() {
  const t=nbi(); return BigInteger.ZERO.subTo(this, t), t;
} function bnAbs() {
  return this.s<0?this.negate():this;
} function bnCompareTo(t) {
  let r=this.s-t.s; if (0!=r) return r; let o=this.t; if (0!=(r=o-t.t)) return this.s<0?-r:r; for (;--o>=0;) if (0!=(r=this[o]-t[o])) return r; return 0;
} function nbits(t) {
  let r; let o=1; return 0!=(r=t>>>16)&&(t=r, o+=16), 0!=(r=t>>8)&&(t=r, o+=8), 0!=(r=t>>4)&&(t=r, o+=4), 0!=(r=t>>2)&&(t=r, o+=2), 0!=(r=t>>1)&&(t=r, o+=1), o;
} function bnBitLength() {
  return this.t<=0?0:this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM);
} function bnpDLShiftTo(t, r) {
  let o; for (o=this.t-1; o>=0; --o)r[o+t]=this[o]; for (o=t-1; o>=0; --o)r[o]=0; r.t=this.t+t, r.s=this.s;
} function bnpDRShiftTo(t, r) {
  for (let o=t; o<this.t; ++o)r[o-t]=this[o]; r.t=Math.max(this.t-t, 0), r.s=this.s;
} function bnpLShiftTo(t, r) {
  let o; const n=this; const i=t%n.DB; const e=n.DB-i; const s=(1<<e)-1; const u=Math.floor(t/n.DB); let h=n.s<<i&n.DM; for (o=n.t-1; o>=0; --o)r[o+u+1]=n[o]>>e|h, h=(n[o]&s)<<i; for (o=u-1; o>=0; --o)r[o]=0; r[u]=h, r.t=n.t+u+1, r.s=n.s, r.clamp();
} function bnpRShiftTo(t, r) {
  const o=this; r.s=o.s; const n=Math.floor(t/o.DB); if (n>=o.t)r.t=0; else {
    const i=t%o.DB; const e=o.DB-i; const s=(1<<i)-1; r[0]=o[n]>>i; for (let u=n+1; u<o.t; ++u)r[u-n-1]|=(o[u]&s)<<e, r[u-n]=o[u]>>i; i>0&&(r[o.t-n-1]|=(o.s&s)<<e), r.t=o.t-n, r.clamp();
  }
} function bnpSubTo(t, r) {
  for (var o=this, n=0, i=0, e=Math.min(t.t, o.t); n<e;)i+=o[n]-t[n], r[n++]=i&o.DM, i>>=o.DB; if (t.t<o.t) {
    for (i-=t.s; n<o.t;)i+=o[n], r[n++]=i&o.DM, i>>=o.DB; i+=o.s;
  } else {
    for (i+=o.s; n<t.t;)i-=t[n], r[n++]=i&o.DM, i>>=o.DB; i-=t.s;
  }r.s=i<0?-1:0, i<-1?r[n++]=o.DV+i:i>0&&(r[n++]=i), r.t=n, r.clamp();
} function bnpMultiplyTo(t, r) {
  const o=this.abs(); const n=t.abs(); let i=o.t; for (r.t=i+n.t; --i>=0;)r[i]=0; for (i=0; i<n.t; ++i)r[i+o.t]=o.am(0, n[i], r, i, 0, o.t); r.s=0, r.clamp(), this.s!=t.s&&BigInteger.ZERO.subTo(r, r);
} function bnpSquareTo(t) {
  for (var r=this.abs(), o=t.t=2*r.t; --o>=0;)t[o]=0; for (o=0; o<r.t-1; ++o) {
    const n=r.am(o, r[o], t, 2*o, 0, 1); (t[o+r.t]+=r.am(o+1, 2*r[o], t, 2*o+1, n, r.t-o-1))>=r.DV&&(t[o+r.t]-=r.DV, t[o+r.t+1]=1);
  }t.t>0&&(t[t.t-1]+=r.am(o, r[o], t, 2*o, 0, 1)), t.s=0, t.clamp();
} function bnpDivRemTo(t, r, o) {
  const n=this; const i=t.abs(); if (!(i.t<=0)) {
    const e=n.abs(); if (e.t<i.t) return null!=r&&r.fromInt(0), void(null!=o&&n.copyTo(o)); null==o&&(o=nbi()); const s=nbi(); const u=n.s; const h=t.s; const f=n.DB-nbits(i[i.t-1]); f>0?(i.lShiftTo(f, s), e.lShiftTo(f, o)):(i.copyTo(s), e.copyTo(o)); const a=s.t; const p=s[a-1]; if (0!=p) {
      const b=p*(1<<n.F1)+(a>1?s[a-2]>>n.F2:0); const c=n.FV/b; const l=(1<<n.F1)/b; const m=1<<n.F2; let v=o.t; let T=v-a; const d=null==r?nbi():r; for (s.dlShiftTo(T, d), o.compareTo(d)>=0&&(o[o.t++]=1, o.subTo(d, o)), BigInteger.ONE.dlShiftTo(a, d), d.subTo(s, s); s.t<a;)s[s.t++]=0; for (;--T>=0;) {
        let g=o[--v]==p?n.DM:Math.floor(o[v]*c+(o[v-1]+m)*l); if ((o[v]+=s.am(0, g, o, T, 0, a))<g) for (s.dlShiftTo(T, d), o.subTo(d, o); o[v]<--g;)o.subTo(d, o);
      }null!=r&&(o.drShiftTo(a, r), u!=h&&BigInteger.ZERO.subTo(r, r)), o.t=a, o.clamp(), f>0&&o.rShiftTo(f, o), u<0&&BigInteger.ZERO.subTo(o, o);
    }
  }
} function bnMod(t) {
  const r=nbi(); return this.abs().divRemTo(t, null, r), this.s<0&&r.compareTo(BigInteger.ZERO)>0&&t.subTo(r, r), r;
} function Classic(t) {
  this.m=t;
} function cConvert(t) {
  return t.s<0||t.compareTo(this.m)>=0?t.mod(this.m):t;
} function cRevert(t) {
  return t;
} function cReduce(t) {
  t.divRemTo(this.m, null, t);
} function cMulTo(t, r, o) {
  t.multiplyTo(r, o), this.reduce(o);
} function cSqrTo(t, r) {
  t.squareTo(r), this.reduce(r);
} function bnpInvDigit() {
  if (this.t<1) return 0; const t=this[0]; if (0==(1&t)) return 0; let r=3&t; return (r=(r=(r=(r=r*(2-(15&t)*r)&15)*(2-(255&t)*r)&255)*(2-((65535&t)*r&65535))&65535)*(2-t*r%this.DV)%this.DV)>0?this.DV-r:-r;
} function Montgomery(t) {
  this.m=t, this.mp=t.invDigit(), this.mpl=32767&this.mp, this.mph=this.mp>>15, this.um=(1<<t.DB-15)-1, this.mt2=2*t.t;
} function montConvert(t) {
  const r=nbi(); return t.abs().dlShiftTo(this.m.t, r), r.divRemTo(this.m, null, r), t.s<0&&r.compareTo(BigInteger.ZERO)>0&&this.m.subTo(r, r), r;
} function montRevert(t) {
  const r=nbi(); return t.copyTo(r), this.reduce(r), r;
} function montReduce(t) {
  for (;t.t<=this.mt2;)t[t.t++]=0; for (let r=0; r<this.m.t; ++r) {
    let o=32767&t[r]; const n=o*this.mpl+((o*this.mph+(t[r]>>15)*this.mpl&this.um)<<15)&t.DM; for (t[o=r+this.m.t]+=this.m.am(0, n, t, r, 0, this.m.t); t[o]>=t.DV;)t[o]-=t.DV, t[++o]++;
  }t.clamp(), t.drShiftTo(this.m.t, t), t.compareTo(this.m)>=0&&t.subTo(this.m, t);
} function montSqrTo(t, r) {
  t.squareTo(r), this.reduce(r);
} function montMulTo(t, r, o) {
  t.multiplyTo(r, o), this.reduce(o);
} function bnpIsEven() {
  return 0==(this.t>0?1&this[0]:this.s);
} function bnpExp(t, r) {
  if (t>4294967295||t<1) return BigInteger.ONE; let o=nbi(); let n=nbi(); const i=r.convert(this); let e=nbits(t)-1; for (i.copyTo(o); --e>=0;) {
    if (r.sqrTo(o, n), (t&1<<e)>0)r.mulTo(n, i, o); else {
      const s=o; o=n, n=s;
    }
  } return r.revert(o);
} function bnModPowInt(t, r) {
  let o; return o=t<256||r.isEven()?new Classic(r):new Montgomery(r), this.exp(t, o);
} function nbi() {
  return new BigInteger(null);
} function bnClone() {
  const t=nbi(); return this.copyTo(t), t;
} function bnIntValue() {
  if (this.s<0) {
    if (1==this.t) return this[0]-this.DV; if (0==this.t) return -1;
  } else {
    if (1==this.t) return this[0]; if (0==this.t) return 0;
  } return (this[1]&(1<<32-this.DB)-1)<<this.DB|this[0];
} function bnByteValue() {
  return 0==this.t?this.s:this[0]<<24>>24;
} function bnShortValue() {
  return 0==this.t?this.s:this[0]<<16>>16;
} function bnpChunkSize(t) {
  return Math.floor(Math.LN2*this.DB/Math.log(t));
} function bnSigNum() {
  return this.s<0?-1:this.t<=0||1==this.t&&this[0]<=0?0:1;
} function bnpToRadix(t) {
  if (null==t&&(t=10), 0==this.signum()||t<2||t>36) return '0'; const r=this.chunkSize(t); const o=Math.pow(t, r); const n=nbv(o); const i=nbi(); const e=nbi(); let s=''; for (this.divRemTo(n, i, e); i.signum()>0;)s=(o+e.intValue()).toString(t).substr(1)+s, i.divRemTo(n, i, e); return e.intValue().toString(t)+s;
} function bnpFromRadix(t, r) {
  const o=this; o.fromInt(0), null==r&&(r=10); for (var n=o.chunkSize(r), i=Math.pow(r, n), e=!1, s=0, u=0, h=0; h<t.length; ++h) {
    const f=intAt(t, h); f<0?'-'==t.charAt(h)&&0==o.signum()&&(e=!0):(u=r*u+f, ++s>=n&&(o.dMultiply(i), o.dAddOffset(u, 0), s=0, u=0));
  }s>0&&(o.dMultiply(Math.pow(r, s)), o.dAddOffset(u, 0)), e&&BigInteger.ZERO.subTo(o, o);
} function bnpFromNumber(t, r, o) {
  const n=this; if ('number'==typeof r) if (t<2)n.fromInt(1); else for (n.fromNumber(t, o), n.testBit(t-1)||n.bitwiseTo(BigInteger.ONE.shiftLeft(t-1), op_or, n), n.isEven()&&n.dAddOffset(1, 0); !n.isProbablePrime(r);)n.dAddOffset(2, 0), n.bitLength()>t&&n.subTo(BigInteger.ONE.shiftLeft(t-1), n); else {
    const i=new Array; const e=7&t; i.length=1+(t>>3), r.nextBytes(i), e>0?i[0]&=(1<<e)-1:i[0]=0, n.fromString(i, 256);
  }
} function bnToByteArray() {
  const t=this; let r=t.t; const o=new Array; o[0]=t.s; let n; let i=t.DB-r*t.DB%8; let e=0; if (r-- >0) for (i<t.DB&&(n=t[r]>>i)!=(t.s&t.DM)>>i&&(o[e++]=n|t.s<<t.DB-i); r>=0;)i<8?(n=(t[r]&(1<<i)-1)<<8-i, n|=t[--r]>>(i+=t.DB-8)):(n=t[r]>>(i-=8)&255, i<=0&&(i+=t.DB, --r)), 0!=(128&n)&&(n|=-256), 0===e&&(128&t.s)!=(128&n)&&++e, (e>0||n!=t.s)&&(o[e++]=n); return o;
} function bnEquals(t) {
  return 0==this.compareTo(t);
} function bnMin(t) {
  return this.compareTo(t)<0?this:t;
} function bnMax(t) {
  return this.compareTo(t)>0?this:t;
} function bnpBitwiseTo(t, r, o) {
  let n; let i; const e=this; const s=Math.min(t.t, e.t); for (n=0; n<s; ++n)o[n]=r(e[n], t[n]); if (t.t<e.t) {
    for (i=t.s&e.DM, n=s; n<e.t; ++n)o[n]=r(e[n], i); o.t=e.t;
  } else {
    for (i=e.s&e.DM, n=s; n<t.t; ++n)o[n]=r(i, t[n]); o.t=t.t;
  }o.s=r(e.s, t.s), o.clamp();
} function op_and(t, r) {
  return t&r;
} function bnAnd(t) {
  const r=nbi(); return this.bitwiseTo(t, op_and, r), r;
} function op_or(t, r) {
  return t|r;
} function bnOr(t) {
  const r=nbi(); return this.bitwiseTo(t, op_or, r), r;
} function op_xor(t, r) {
  return t^r;
} function bnXor(t) {
  const r=nbi(); return this.bitwiseTo(t, op_xor, r), r;
} function op_andnot(t, r) {
  return t&~r;
} function bnAndNot(t) {
  const r=nbi(); return this.bitwiseTo(t, op_andnot, r), r;
} function bnNot() {
  for (var t=nbi(), r=0; r<this.t; ++r)t[r]=this.DM&~this[r]; return t.t=this.t, t.s=~this.s, t;
} function bnShiftLeft(t) {
  const r=nbi(); return t<0?this.rShiftTo(-t, r):this.lShiftTo(t, r), r;
} function bnShiftRight(t) {
  const r=nbi(); return t<0?this.lShiftTo(-t, r):this.rShiftTo(t, r), r;
} function lbit(t) {
  if (0==t) return -1; let r=0; return 0==(65535&t)&&(t>>=16, r+=16), 0==(255&t)&&(t>>=8, r+=8), 0==(15&t)&&(t>>=4, r+=4), 0==(3&t)&&(t>>=2, r+=2), 0==(1&t)&&++r, r;
} function bnGetLowestSetBit() {
  for (let t=0; t<this.t; ++t) if (0!=this[t]) return t*this.DB+lbit(this[t]); return this.s<0?this.t*this.DB:-1;
} function cbit(t) {
  for (var r=0; 0!=t;)t&=t-1, ++r; return r;
} function bnBitCount() {
  for (var t=0, r=this.s&this.DM, o=0; o<this.t; ++o)t+=cbit(this[o]^r); return t;
} function bnTestBit(t) {
  const r=Math.floor(t/this.DB); return r>=this.t?0!=this.s:0!=(this[r]&1<<t%this.DB);
} function bnpChangeBit(t, r) {
  const o=BigInteger.ONE.shiftLeft(t); return this.bitwiseTo(o, r, o), o;
} function bnSetBit(t) {
  return this.changeBit(t, op_or);
} function bnClearBit(t) {
  return this.changeBit(t, op_andnot);
} function bnFlipBit(t) {
  return this.changeBit(t, op_xor);
} function bnpAddTo(t, r) {
  for (var o=this, n=0, i=0, e=Math.min(t.t, o.t); n<e;)i+=o[n]+t[n], r[n++]=i&o.DM, i>>=o.DB; if (t.t<o.t) {
    for (i+=t.s; n<o.t;)i+=o[n], r[n++]=i&o.DM, i>>=o.DB; i+=o.s;
  } else {
    for (i+=o.s; n<t.t;)i+=t[n], r[n++]=i&o.DM, i>>=o.DB; i+=t.s;
  }r.s=i<0?-1:0, i>0?r[n++]=i:i<-1&&(r[n++]=o.DV+i), r.t=n, r.clamp();
} function bnAdd(t) {
  const r=nbi(); return this.addTo(t, r), r;
} function bnSubtract(t) {
  const r=nbi(); return this.subTo(t, r), r;
} function bnMultiply(t) {
  const r=nbi(); return this.multiplyTo(t, r), r;
} function bnSquare() {
  const t=nbi(); return this.squareTo(t), t;
} function bnDivide(t) {
  const r=nbi(); return this.divRemTo(t, r, null), r;
} function bnRemainder(t) {
  const r=nbi(); return this.divRemTo(t, null, r), r;
} function bnDivideAndRemainder(t) {
  const r=nbi(); const o=nbi(); return this.divRemTo(t, r, o), new Array(r, o);
} function bnpDMultiply(t) {
  this[this.t]=this.am(0, t-1, this, 0, 0, this.t), ++this.t, this.clamp();
} function bnpDAddOffset(t, r) {
  if (0!=t) {
    for (;this.t<=r;) this[this.t++]=0; for (this[r]+=t; this[r]>=this.DV;) this[r]-=this.DV, ++r>=this.t&&(this[this.t++]=0), ++this[r];
  }
} function NullExp() {} function nNop(t) {
  return t;
} function nMulTo(t, r, o) {
  t.multiplyTo(r, o);
} function nSqrTo(t, r) {
  t.squareTo(r);
} function bnPow(t) {
  return this.exp(t, new NullExp);
} function bnpMultiplyLowerTo(t, r, o) {
  let n; let i=Math.min(this.t+t.t, r); for (o.s=0, o.t=i; i>0;)o[--i]=0; for (n=o.t-this.t; i<n; ++i)o[i+this.t]=this.am(0, t[i], o, i, 0, this.t); for (n=Math.min(t.t, r); i<n; ++i) this.am(0, t[i], o, i, 0, r-i); o.clamp();
} function bnpMultiplyUpperTo(t, r, o) {
  --r; let n=o.t=this.t+t.t-r; for (o.s=0; --n>=0;)o[n]=0; for (n=Math.max(r-this.t, 0); n<t.t; ++n)o[this.t+n-r]=this.am(r-n, t[n], o, 0, 0, this.t+n-r); o.clamp(), o.drShiftTo(1, o);
} function Barrett(t) {
  this.r2=nbi(), this.q3=nbi(), BigInteger.ONE.dlShiftTo(2*t.t, this.r2), this.mu=this.r2.divide(t), this.m=t;
} function barrettConvert(t) {
  if (t.s<0||t.t>2*this.m.t) return t.mod(this.m); if (t.compareTo(this.m)<0) return t; const r=nbi(); return t.copyTo(r), this.reduce(r), r;
} function barrettRevert(t) {
  return t;
} function barrettReduce(t) {
  const r=this; for (t.drShiftTo(r.m.t-1, r.r2), t.t>r.m.t+1&&(t.t=r.m.t+1, t.clamp()), r.mu.multiplyUpperTo(r.r2, r.m.t+1, r.q3), r.m.multiplyLowerTo(r.q3, r.m.t+1, r.r2); t.compareTo(r.r2)<0;)t.dAddOffset(1, r.m.t+1); for (t.subTo(r.r2, t); t.compareTo(r.m)>=0;)t.subTo(r.m, t);
} function barrettSqrTo(t, r) {
  t.squareTo(r), this.reduce(r);
} function barrettMulTo(t, r, o) {
  t.multiplyTo(r, o), this.reduce(o);
} function bnModPow(t, r) {
  let o; let n; let i=t.bitLength(); let e=nbv(1); if (i<=0) return e; o=i<18?1:i<48?3:i<144?4:i<768?5:6, n=i<8?new Classic(r):r.isEven()?new Barrett(r):new Montgomery(r); const s=new Array; let u=3; const h=o-1; const f=(1<<o)-1; if (s[1]=n.convert(this), o>1) {
    const a=nbi(); for (n.sqrTo(s[1], a); u<=f;)s[u]=nbi(), n.mulTo(a, s[u-2], s[u]), u+=2;
  } let p; let b; let c=t.t-1; let l=!0; let m=nbi(); for (i=nbits(t[c])-1; c>=0;) {
    for (i>=h?p=t[c]>>i-h&f:(p=(t[c]&(1<<i+1)-1)<<h-i, c>0&&(p|=t[c-1]>>this.DB+i-h)), u=o; 0==(1&p);)p>>=1, --u; if ((i-=u)<0&&(i+=this.DB, --c), l)s[p].copyTo(e), l=!1; else {
      for (;u>1;)n.sqrTo(e, m), n.sqrTo(m, e), u-=2; u>0?n.sqrTo(e, m):(b=e, e=m, m=b), n.mulTo(m, s[p], e);
    } for (;c>=0&&0==(t[c]&1<<i);)n.sqrTo(e, m), b=e, e=m, m=b, --i<0&&(i=this.DB-1, --c);
  } return n.revert(e);
} function bnGCD(t) {
  let r=this.s<0?this.negate():this.clone(); let o=t.s<0?t.negate():t.clone(); if (r.compareTo(o)<0) {
    const n=r; r=o, o=n;
  } let i=r.getLowestSetBit(); let e=o.getLowestSetBit(); if (e<0) return r; for (i<e&&(e=i), e>0&&(r.rShiftTo(e, r), o.rShiftTo(e, o)); r.signum()>0;)(i=r.getLowestSetBit())>0&&r.rShiftTo(i, r), (i=o.getLowestSetBit())>0&&o.rShiftTo(i, o), r.compareTo(o)>=0?(r.subTo(o, r), r.rShiftTo(1, r)):(o.subTo(r, o), o.rShiftTo(1, o)); return e>0&&o.lShiftTo(e, o), o;
} function bnpModInt(t) {
  if (t<=0) return 0; const r=this.DV%t; let o=this.s<0?t-1:0; if (this.t>0) if (0==r)o=this[0]%t; else for (let n=this.t-1; n>=0; --n)o=(r*o+this[n])%t; return o;
} function bnModInverse(t) {
  const r=t.isEven(); if (this.isEven()&&r||0==t.signum()) return BigInteger.ZERO; for (var o=t.clone(), n=this.clone(), i=nbv(1), e=nbv(0), s=nbv(0), u=nbv(1); 0!=o.signum();) {
    for (;o.isEven();)o.rShiftTo(1, o), r?(i.isEven()&&e.isEven()||(i.addTo(this, i), e.subTo(t, e)), i.rShiftTo(1, i)):e.isEven()||e.subTo(t, e), e.rShiftTo(1, e); for (;n.isEven();)n.rShiftTo(1, n), r?(s.isEven()&&u.isEven()||(s.addTo(this, s), u.subTo(t, u)), s.rShiftTo(1, s)):u.isEven()||u.subTo(t, u), u.rShiftTo(1, u); o.compareTo(n)>=0?(o.subTo(n, o), r&&i.subTo(s, i), e.subTo(u, e)):(n.subTo(o, n), r&&s.subTo(i, s), u.subTo(e, u));
  } return 0!=n.compareTo(BigInteger.ONE)?BigInteger.ZERO:u.compareTo(t)>=0?u.subtract(t):u.signum()<0?(u.addTo(t, u), u.signum()<0?u.add(t):u):u;
}Classic.prototype.convert=cConvert, Classic.prototype.revert=cRevert, Classic.prototype.reduce=cReduce, Classic.prototype.mulTo=cMulTo, Classic.prototype.sqrTo=cSqrTo, Montgomery.prototype.convert=montConvert, Montgomery.prototype.revert=montRevert, Montgomery.prototype.reduce=montReduce, Montgomery.prototype.mulTo=montMulTo, Montgomery.prototype.sqrTo=montSqrTo, proto.copyTo=bnpCopyTo, proto.fromInt=bnpFromInt, proto.fromString=bnpFromString, proto.clamp=bnpClamp, proto.dlShiftTo=bnpDLShiftTo, proto.drShiftTo=bnpDRShiftTo, proto.lShiftTo=bnpLShiftTo, proto.rShiftTo=bnpRShiftTo, proto.subTo=bnpSubTo, proto.multiplyTo=bnpMultiplyTo, proto.squareTo=bnpSquareTo, proto.divRemTo=bnpDivRemTo, proto.invDigit=bnpInvDigit, proto.isEven=bnpIsEven, proto.exp=bnpExp, proto.toString=bnToString, proto.negate=bnNegate, proto.abs=bnAbs, proto.compareTo=bnCompareTo, proto.bitLength=bnBitLength, proto.mod=bnMod, proto.modPowInt=bnModPowInt, NullExp.prototype.convert=nNop, NullExp.prototype.revert=nNop, NullExp.prototype.mulTo=nMulTo, NullExp.prototype.sqrTo=nSqrTo, Barrett.prototype.convert=barrettConvert, Barrett.prototype.revert=barrettRevert, Barrett.prototype.reduce=barrettReduce, Barrett.prototype.mulTo=barrettMulTo, Barrett.prototype.sqrTo=barrettSqrTo, proto.chunkSize=bnpChunkSize, proto.toRadix=bnpToRadix, proto.fromRadix=bnpFromRadix, proto.fromNumber=bnpFromNumber, proto.bitwiseTo=bnpBitwiseTo, proto.changeBit=bnpChangeBit, proto.addTo=bnpAddTo, proto.dMultiply=bnpDMultiply, proto.dAddOffset=bnpDAddOffset, proto.multiplyLowerTo=bnpMultiplyLowerTo, proto.multiplyUpperTo=bnpMultiplyUpperTo, proto.modInt=bnpModInt, proto.clone=bnClone, proto.intValue=bnIntValue, proto.byteValue=bnByteValue, proto.shortValue=bnShortValue, proto.signum=bnSigNum, proto.toByteArray=bnToByteArray, proto.equals=bnEquals, proto.min=bnMin, proto.max=bnMax, proto.and=bnAnd, proto.or=bnOr, proto.xor=bnXor, proto.andNot=bnAndNot, proto.not=bnNot, proto.shiftLeft=bnShiftLeft, proto.shiftRight=bnShiftRight, proto.getLowestSetBit=bnGetLowestSetBit, proto.bitCount=bnBitCount, proto.testBit=bnTestBit, proto.setBit=bnSetBit, proto.clearBit=bnClearBit, proto.flipBit=bnFlipBit, proto.add=bnAdd, proto.subtract=bnSubtract, proto.multiply=bnMultiply, proto.divide=bnDivide, proto.remainder=bnRemainder, proto.divideAndRemainder=bnDivideAndRemainder, proto.modPow=bnModPow, proto.modInverse=bnModInverse, proto.pow=bnPow, proto.gcd=bnGCD, proto.square=bnSquare, BigInteger.ZERO=nbv(0), BigInteger.ONE=nbv(1), BigInteger.valueOf=nbv, BigInteger.fromByteArrayUnsigned=function(t) {
  return t.length?128&t[0]?new BigInteger([0].concat(t)):new BigInteger(t):new BigInteger.valueOf(0);
}, BigInteger.fromByteArraySigned=function(t) {
  return 128&t[0]?(t[0]&=127, BigInteger.fromByteArrayUnsigned(t).negate()):BigInteger.fromByteArrayUnsigned(t);
}, BigInteger.prototype.toByteArrayUnsigned=function() {
  let t=this.abs().toByteArray(); if (!t.length) return t; 0===t[0]&&(t=t.slice(1)); for (let r=0; r<t.length; ++r)t[r]=t[r]<0?t[r]+256:t[r]; return t;
}, BigInteger.prototype.toByteArraySigned=function() {
  const t=this.toByteArrayUnsigned(); const r=this.s<0; return 128&t[0]?t.unshift(r?128:0):r&&(t[0]|=128), t;
};

/* !
			* Basic Javascript Elliptic Curve implementation
			* Ported loosely from BouncyCastle's Java EC code
			* Only Fp curves implemented for now
			*
			* Copyright Tom Wu, bitaddress.org  BSD License.
			* http://www-cs-students.stanford.edu/~tjw/jsbn/LICENSE
			*/
!function() {
  const t=window.EllipticCurve=function() {}; t.FieldElementFp=function(t, e) {
    this.x=e, this.q=t;
  }, t.FieldElementFp.prototype.equals=function(t) {
    return t==this||this.q.equals(t.q)&&this.x.equals(t.x);
  }, t.FieldElementFp.prototype.toBigInteger=function() {
    return this.x;
  }, t.FieldElementFp.prototype.negate=function() {
    return new t.FieldElementFp(this.q, this.x.negate().mod(this.q));
  }, t.FieldElementFp.prototype.add=function(e) {
    return new t.FieldElementFp(this.q, this.x.add(e.toBigInteger()).mod(this.q));
  }, t.FieldElementFp.prototype.subtract=function(e) {
    return new t.FieldElementFp(this.q, this.x.subtract(e.toBigInteger()).mod(this.q));
  }, t.FieldElementFp.prototype.multiply=function(e) {
    return new t.FieldElementFp(this.q, this.x.multiply(e.toBigInteger()).mod(this.q));
  }, t.FieldElementFp.prototype.square=function() {
    return new t.FieldElementFp(this.q, this.x.square().mod(this.q));
  }, t.FieldElementFp.prototype.divide=function(e) {
    return new t.FieldElementFp(this.q, this.x.multiply(e.toBigInteger().modInverse(this.q)).mod(this.q));
  }, t.FieldElementFp.prototype.getByteLength=function() {
    return Math.floor((this.toBigInteger().bitLength()+7)/8);
  }, t.FieldElementFp.prototype.sqrt=function() {
    if (!this.q.testBit(0)) throw new Error('even value of q'); if (this.q.testBit(1)) {
      const e=new t.FieldElementFp(this.q, this.x.modPow(this.q.shiftRight(2).add(BigInteger.ONE), this.q)); return e.square().equals(this)?e:null;
    } const i=this.q.subtract(BigInteger.ONE); const r=i.shiftRight(1); if (!this.x.modPow(r, this.q).equals(BigInteger.ONE)) return null; let n; let s; const u=i.shiftRight(2).shiftLeft(1).add(BigInteger.ONE); const o=this.x; const h=o.shiftLeft(2).mod(this.q); do {
      var l; const g=new SecureRandom; do {
        l=new BigInteger(this.q.bitLength(), g);
      } while (l.compareTo(this.q)>=0||!l.multiply(l).subtract(h).modPow(r, this.q).equals(i));const p=t.FieldElementFp.fastLucasSequence(this.q, l, o, u); if (n=p[0], (s=p[1]).multiply(s).mod(this.q).equals(h)) return s.testBit(0)&&(s=s.add(this.q)), s=s.shiftRight(1), new t.FieldElementFp(this.q, s);
    } while (n.equals(BigInteger.ONE)||n.equals(i));return null;
  }, t.FieldElementFp.fastLucasSequence=function(t, e, i, r) {
    for (var n=r.bitLength(), s=r.getLowestSetBit(), u=BigInteger.ONE, o=BigInteger.TWO, h=e, l=BigInteger.ONE, g=BigInteger.ONE, p=n-1; p>=s+1; --p)l=l.multiply(g).mod(t), r.testBit(p)?(g=l.multiply(i).mod(t), u=u.multiply(h).mod(t), o=h.multiply(o).subtract(e.multiply(l)).mod(t), h=h.multiply(h).subtract(g.shiftLeft(1)).mod(t)):(g=l, u=u.multiply(o).subtract(l).mod(t), h=h.multiply(o).subtract(e.multiply(l)).mod(t), o=o.multiply(o).subtract(l.shiftLeft(1)).mod(t)); g=(l=l.multiply(g).mod(t)).multiply(i).mod(t), u=u.multiply(o).subtract(l).mod(t), o=h.multiply(o).subtract(e.multiply(l)).mod(t), l=l.multiply(g).mod(t); for (p=1; p<=s; ++p)u=u.multiply(o).mod(t), o=o.multiply(o).subtract(l.shiftLeft(1)).mod(t), l=l.multiply(l).mod(t); return [u, o];
  }, t.PointFp=function(t, e, i, r, n) {
    this.curve=t, this.x=e, this.y=i, this.z=null==r?BigInteger.ONE:r, this.zinv=null, this.compressed=!!n;
  }, t.PointFp.prototype.getX=function() {
    null==this.zinv&&(this.zinv=this.z.modInverse(this.curve.q)); const t=this.x.toBigInteger().multiply(this.zinv); return this.curve.reduce(t), this.curve.fromBigInteger(t);
  }, t.PointFp.prototype.getY=function() {
    null==this.zinv&&(this.zinv=this.z.modInverse(this.curve.q)); const t=this.y.toBigInteger().multiply(this.zinv); return this.curve.reduce(t), this.curve.fromBigInteger(t);
  }, t.PointFp.prototype.equals=function(t) {
    return t==this||(this.isInfinity()?t.isInfinity():t.isInfinity()?this.isInfinity():!!t.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(t.z)).mod(this.curve.q).equals(BigInteger.ZERO)&&t.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(t.z)).mod(this.curve.q).equals(BigInteger.ZERO));
  }, t.PointFp.prototype.isInfinity=function() {
    return null==this.x&&null==this.y||this.z.equals(BigInteger.ZERO)&&!this.y.toBigInteger().equals(BigInteger.ZERO);
  }, t.PointFp.prototype.negate=function() {
    return new t.PointFp(this.curve, this.x, this.y.negate(), this.z);
  }, t.PointFp.prototype.add=function(e) {
    if (this.isInfinity()) return e; if (e.isInfinity()) return this; const i=e.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(e.z)).mod(this.curve.q); const r=e.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(e.z)).mod(this.curve.q); if (BigInteger.ZERO.equals(r)) return BigInteger.ZERO.equals(i)?this.twice():this.curve.getInfinity(); const n=new BigInteger('3'); const s=this.x.toBigInteger(); const u=this.y.toBigInteger(); const o=(e.x.toBigInteger(), e.y.toBigInteger(), r.square()); const h=o.multiply(r); const l=s.multiply(o); const g=i.square().multiply(this.z); const p=g.subtract(l.shiftLeft(1)).multiply(e.z).subtract(h).multiply(r).mod(this.curve.q); const a=l.multiply(n).multiply(i).subtract(u.multiply(h)).subtract(g.multiply(i)).multiply(e.z).add(i.multiply(h)).mod(this.curve.q); const m=h.multiply(this.z).multiply(e.z).mod(this.curve.q); return new t.PointFp(this.curve, this.curve.fromBigInteger(p), this.curve.fromBigInteger(a), m);
  }, t.PointFp.prototype.twice=function() {
    if (this.isInfinity()) return this; if (0==this.y.toBigInteger().signum()) return this.curve.getInfinity(); const e=new BigInteger('3'); const i=this.x.toBigInteger(); const r=this.y.toBigInteger(); const n=r.multiply(this.z); const s=n.multiply(r).mod(this.curve.q); const u=this.curve.a.toBigInteger(); let o=i.square().multiply(e); BigInteger.ZERO.equals(u)||(o=o.add(this.z.square().multiply(u))); const h=(o=o.mod(this.curve.q)).square().subtract(i.shiftLeft(3).multiply(s)).shiftLeft(1).multiply(n).mod(this.curve.q); const l=o.multiply(e).multiply(i).subtract(s.shiftLeft(1)).shiftLeft(2).multiply(s).subtract(o.square().multiply(o)).mod(this.curve.q); const g=n.square().multiply(n).shiftLeft(3).mod(this.curve.q); return new t.PointFp(this.curve, this.curve.fromBigInteger(h), this.curve.fromBigInteger(l), g);
  }, t.PointFp.prototype.multiply=function(t) {
    if (this.isInfinity()) return this; if (0==t.signum()) return this.curve.getInfinity(); let e; const i=t; const r=i.multiply(new BigInteger('3')); const n=this.negate(); let s=this; for (e=r.bitLength()-2; e>0; --e) {
      s=s.twice(); const u=r.testBit(e); u!=i.testBit(e)&&(s=s.add(u?this:n));
    } return s;
  }, t.PointFp.prototype.multiplyTwo=function(t, e, i) {
    let r; r=t.bitLength()>i.bitLength()?t.bitLength()-1:i.bitLength()-1; for (var n=this.curve.getInfinity(), s=this.add(e); r>=0;)n=n.twice(), t.testBit(r)?n=i.testBit(r)?n.add(s):n.add(this):i.testBit(r)&&(n=n.add(e)), --r; return n;
  }, t.PointFp.prototype.getEncoded=function(e) {
    const i=this.getX().toBigInteger(); const r=this.getY().toBigInteger(); let n=t.integerToBytes(i, 32); return e?r.isEven()?n.unshift(2):n.unshift(3):(n.unshift(4), n=n.concat(t.integerToBytes(r, 32))), n;
  }, t.PointFp.decodeFrom=function(e, i) {
    i[0]; const r=i.length-1; const n=i.slice(1, 1+r/2); const s=i.slice(1+r/2, 1+r); n.unshift(0), s.unshift(0); const u=new BigInteger(n); const o=new BigInteger(s); return new t.PointFp(e, e.fromBigInteger(u), e.fromBigInteger(o));
  }, t.PointFp.prototype.add2D=function(e) {
    if (this.isInfinity()) return e; if (e.isInfinity()) return this; if (this.x.equals(e.x)) return this.y.equals(e.y)?this.twice():this.curve.getInfinity(); const i=e.x.subtract(this.x); const r=e.y.subtract(this.y).divide(i); const n=r.square().subtract(this.x).subtract(e.x); const s=r.multiply(this.x.subtract(n)).subtract(this.y); return new t.PointFp(this.curve, n, s);
  }, t.PointFp.prototype.twice2D=function() {
    if (this.isInfinity()) return this; if (0==this.y.toBigInteger().signum()) return this.curve.getInfinity(); const e=this.curve.fromBigInteger(BigInteger.valueOf(2)); const i=this.curve.fromBigInteger(BigInteger.valueOf(3)); const r=this.x.square().multiply(i).add(this.curve.a).divide(this.y.multiply(e)); const n=r.square().subtract(this.x.multiply(e)); const s=r.multiply(this.x.subtract(n)).subtract(this.y); return new t.PointFp(this.curve, n, s);
  }, t.PointFp.prototype.multiply2D=function(t) {
    if (this.isInfinity()) return this; if (0==t.signum()) return this.curve.getInfinity(); let e; const i=t; const r=i.multiply(new BigInteger('3')); const n=this.negate(); let s=this; for (e=r.bitLength()-2; e>0; --e) {
      s=s.twice(); const u=r.testBit(e); u!=i.testBit(e)&&(s=s.add2D(u?this:n));
    } return s;
  }, t.PointFp.prototype.isOnCurve=function() {
    const t=this.getX().toBigInteger(); const e=this.getY().toBigInteger(); const i=this.curve.getA().toBigInteger(); const r=this.curve.getB().toBigInteger(); const n=this.curve.getQ(); const s=e.multiply(e).mod(n); const u=t.multiply(t).multiply(t).add(i.multiply(t)).add(r).mod(n); return s.equals(u);
  }, t.PointFp.prototype.toString=function() {
    return '('+this.getX().toBigInteger().toString()+','+this.getY().toBigInteger().toString()+')';
  }, t.PointFp.prototype.validate=function() {
    const t=this.curve.getQ(); if (this.isInfinity()) throw new Error('Point is at infinity.'); const e=this.getX().toBigInteger(); const i=this.getY().toBigInteger(); if (e.compareTo(BigInteger.ONE)<0||e.compareTo(t.subtract(BigInteger.ONE))>0) throw new Error('x coordinate out of bounds'); if (i.compareTo(BigInteger.ONE)<0||i.compareTo(t.subtract(BigInteger.ONE))>0) throw new Error('y coordinate out of bounds'); if (!this.isOnCurve()) throw new Error('Point is not on the curve.'); if (this.multiply(t).isInfinity()) throw new Error('Point is not a scalar multiple of G.'); return !0;
  }, t.CurveFp=function(e, i, r) {
    this.q=e, this.a=this.fromBigInteger(i), this.b=this.fromBigInteger(r), this.infinity=new t.PointFp(this, null, null), this.reducer=new Barrett(this.q);
  }, t.CurveFp.prototype.getQ=function() {
    return this.q;
  }, t.CurveFp.prototype.getA=function() {
    return this.a;
  }, t.CurveFp.prototype.getB=function() {
    return this.b;
  }, t.CurveFp.prototype.equals=function(t) {
    return t==this||this.q.equals(t.q)&&this.a.equals(t.a)&&this.b.equals(t.b);
  }, t.CurveFp.prototype.getInfinity=function() {
    return this.infinity;
  }, t.CurveFp.prototype.fromBigInteger=function(e) {
    return new t.FieldElementFp(this.q, e);
  }, t.CurveFp.prototype.reduce=function(t) {
    this.reducer.reduce(t);
  }, t.CurveFp.prototype.decodePointHex=function(e) {
    const i=parseInt(e.substr(0, 2), 16); switch (i) {
      case 0: return this.infinity; case 2: case 3: var r=1&i; var n=e.substr(2, e.length-2); var s=new BigInteger(n, 16); return this.decompressPoint(r, s); case 4: case 6: case 7: var u=(e.length-2)/2; var o=(n=e.substr(2, u), e.substr(u+2, u)); return new t.PointFp(this, this.fromBigInteger(new BigInteger(n, 16)), this.fromBigInteger(new BigInteger(o, 16))); default: return null;
    }
  }, t.CurveFp.prototype.encodePointHex=function(t) {
    if (t.isInfinity()) return '00'; let e=t.getX().toBigInteger().toString(16); let i=t.getY().toBigInteger().toString(16); let r=this.getQ().toString(16).length; for (r%2!=0&&r++; e.length<r;)e='0'+e; for (;i.length<r;)i='0'+i; return '04'+e+i;
  }, t.CurveFp.prototype.decompressPoint=function(e, i) {
    const r=this.fromBigInteger(i); let n=r.multiply(r.square().add(this.getA())).add(this.getB()).sqrt(); if (null==n) throw new Error('Invalid point compression'); const s=n.toBigInteger(); return (s.testBit(0)?1:0)!=e&&(n=this.fromBigInteger(this.getQ().subtract(s))), new t.PointFp(this, r, n, null, !0);
  }, t.fromHex=function(t) {
    return new BigInteger(t, 16);
  }, t.integerToBytes=function(t, e) {
    let i=t.toByteArrayUnsigned(); if (e<i.length)i=i.slice(i.length-e); else for (;e>i.length;)i.unshift(0); return i;
  }, t.X9Parameters=function(t, e, i, r) {
    this.curve=t, this.g=e, this.n=i, this.h=r;
  }, t.X9Parameters.prototype.getCurve=function() {
    return this.curve;
  }, t.X9Parameters.prototype.getG=function() {
    return this.g;
  }, t.X9Parameters.prototype.getN=function() {
    return this.n;
  }, t.X9Parameters.prototype.getH=function() {
    return this.h;
  }, t.secNamedCurves={secp256k1: function() {
    const e=t.fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F'); const i=BigInteger.ZERO; const r=t.fromHex('7'); const n=t.fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141'); const s=BigInteger.ONE; const u=new t.CurveFp(e, i, r); const o=u.decodePointHex('0479BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8'); return new t.X9Parameters(u, o, n, s);
  }}, t.getSECCurveByName=function(e) {
    return void 0==t.secNamedCurves[e]?null:t.secNamedCurves[e]();
  };
}();

exports.util=window.Crypto.util;
exports.EllipticCurve=window.EllipticCurve;
exports.ripemd160=ripemd160;
exports.SHA256=window.Crypto.SHA256;
exports.HMAC=window.Crypto.HMAC;
