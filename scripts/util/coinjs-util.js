/*
* from https://github.com/MicroBitcoinOrg/microbitcoinorg.github.io/blob/master/wallet/index.html

Copyright (c) 2005  Tom Wu
			// All Rights Reserved.
			// Basic JavaScript BN library - subset useful for RSA encryption.
			// Bits per digit
*/
const bigintUtil = require('./bigint-util.js');
const mbcUtil = require('./mbc-util.js');
const Crypto = require('./cryptojs-util.js');

const BigInteger = bigintUtil.BigInteger;
const EllipticCurve = Crypto.EllipticCurve;
const window = {};

//
const compressed = true;

const networksConfigs = {
  'MBC': {
    'name': 'Main Network (MBC)',
    'api': 'https://api.mbc.wiki/',
    'ticker': 'MBC',
    'decimals': 4,
    'fee': 0.01,
    'params': {
      'satoshis': 10000,
      'decimals': 4,
      'pub': 0x1A,
      'multisig': 0x33,
      'priv': 0x80,
      'forkid': 0x60,
    },
  },
  'TMBC': {
    'name': 'Test Network (TMBC)',
    'api': 'https://api.mbc.wiki/test/',
    'ticker': 'TMBC',
    'decimals': 4,
    'fee': 0.01,
    'params': {
      'satoshis': 10000,
      'decimals': 4,
      'pub': 0x47,
      'multisig': 0x49,
      'priv': 0x80,
      'forkid': 0x60,
    },
  },
};

const pub = networksConfigs.MBC.params.pub;

//
const getKeys = (wif) => {
  const privkey = wif2privkey(wif)['privkey'];
  const pubkey = newPubkey(privkey);
  return {
    'privkey': privkey,
    'pubkey': pubkey,
    'address': pubkey2address(pubkey),
    'wif': wif,
    'compressed': this.compressed,
  };
};

const wif2privkey = (wif) => {
  let compressed = false;
  const decode = base58decode(wif);
  let key = decode.slice(0, decode.length - 4);
  key = key.slice(1, key.length);
  if (key.length >= 33 && key[key.length - 1] == 0x01) {
    key = key.slice(0, key.length - 1);
    compressed = true;
  }
  return {
    'privkey': Crypto.util.bytesToHex(key),
    'compressed': compressed,
  };
};

const base58decode = (buffer) => {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const base = BigInteger.valueOf(58);
  const validRegex = /^[1-9A-HJ-NP-Za-km-z]+$/;

  let bi = BigInteger.valueOf(0);
  let leadingZerosNum = 0;
  for (let i = buffer.length - 1; i >= 0; i--) {
    const alphaIndex = alphabet.indexOf(buffer[i]);
    if (alphaIndex < 0) {
      throw 'Invalid character';
    }
    bi = bi.add(BigInteger.valueOf(alphaIndex).multiply(base.pow(buffer.length - 1 - i)));

    if (buffer[i] == '1') leadingZerosNum++;
    else leadingZerosNum = 0;
  }

  const bytes = bi.toByteArrayUnsigned();
  while (leadingZerosNum-- > 0) bytes.unshift(0);
  return bytes;
};

const base58encode = (buffer) => {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const base = BigInteger.valueOf(58);

  let bi = BigInteger.fromByteArrayUnsigned(buffer);
  const chars = [];

  while (bi.compareTo(base) >= 0) {
    const mod = bi.mod(base);
    chars.unshift(alphabet[mod.intValue()]);
    bi = bi.subtract(mod).divide(base);
  }

  chars.unshift(alphabet[bi.intValue()]);
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] == 0x00) {
      chars.unshift(alphabet[0]);
    } else break;
  }
  return chars.join('');
};
/* generate a public key from a private key */
const newPubkey = (hash) => {
  const privateKeyBigInt = BigInteger.fromByteArrayUnsigned(Crypto.util.hexToBytes(hash));
  const curve = EllipticCurve.getSECCurveByName('secp256k1');

  const curvePt = curve.getG().multiply(privateKeyBigInt);
  const x = curvePt.getX().toBigInteger();
  const y = curvePt.getY().toBigInteger();

  let publicKeyBytes = EllipticCurve.integerToBytes(x, 32);
  publicKeyBytes = publicKeyBytes.concat(EllipticCurve.integerToBytes(y, 32));
  publicKeyBytes.unshift(0x04);

  if (compressed == true) {
    const publicKeyBytesCompressed = EllipticCurve.integerToBytes(x, 32);
    if (y.isEven()) {
      publicKeyBytesCompressed.unshift(0x02);
    } else {
      publicKeyBytesCompressed.unshift(0x03);
    }
    return Crypto.util.bytesToHex(publicKeyBytesCompressed);
  } else {
    return Crypto.util.bytesToHex(publicKeyBytes);
  }
};

const pubkey2address = (h, byte) => {
  const r = Crypto.ripemd160(Crypto.SHA256(Crypto.util.hexToBytes(h), {
    asBytes: true,
  }));
  r.unshift(byte || pub);
  const hash = Crypto.SHA256(Crypto.SHA256(r, {
    asBytes: true,
  }), {
    asBytes: true,
  });
  const checksum = hash.slice(0, 4);
  return base58encode(r.concat(checksum));
};

/*
			 Coinjs 0.01 beta by OutCast3k{at}gmail.com
			 A bitcoin framework.

			 http://github.com/OutCast3k/coinjs or http://coinb.in/coinjs
			*/

function coinjsInit() {
  const coinjs = window.coinjs = function() {};

  config = mbcUtil.getApi();
  coinjs.pub = config.params.pub;
  coinjs.multisig = config.params.multisig;
  coinjs.priv = config.params.priv;
  coinjs.forkid = config.params.forkid;
  coinjs.host = config.api;

  coinjs.hdkey = {
    'prv': 0x0488ade4,
    'pub': 0x0488b21e,
  };
  coinjs.bech32 = {
    'charset': 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
    'version': 0,
    'hrp': 'bc',
  };
  coinjs.compressed = true;

  /* start of address functions */

  /* generate a private and public keypair, with address and WIF address */
  coinjs.newKeys = function(input) {
    const privkey = (input) ? Crypto.SHA256(input) : this.newPrivkey();
    const pubkey = this.newPubkey(privkey);
    return {
      'privkey': privkey,
      'pubkey': pubkey,
      'address': this.pubkey2address(pubkey),
      'wif': this.privkey2wif(privkey),
      'compressed': this.compressed,
    };
  };

  /* Get key pair */
  coinjs.getKeys = function(wif) {
    const privkey = this.wif2privkey(wif)['privkey'];
    const pubkey = this.newPubkey(privkey);
    return {
      'privkey': privkey,
      'pubkey': pubkey,
      'address': this.pubkey2address(pubkey),
      'wif': wif,
      'compressed': this.compressed,
    };
  };

  /* generate a new random private key */
  coinjs.newPrivkey = function() {
    let x = window.location;
    x += (window.screen.height * window.screen.width * window.screen.colorDepth);
    x += coinjs.random(64);
    x += (window.screen.availHeight * window.screen.availWidth * window.screen.pixelDepth);
    x += navigator.language;
    x += window.history.length;
    x += coinjs.random(64);
    x += navigator.userAgent;
    x += 'volbil:3';
    x += (Crypto.util.randomBytes(64)).join('');
    x += x.length;
    const dateObj = new Date();
    x += dateObj.getTimezoneOffset();
    x += coinjs.random(64);
    x += (document.getElementById('entropybucket')) ? document.getElementById('entropybucket').innerHTML : '';
    x += x + '' + x;
    let r = x;
    for (i = 0; i < (x).length / 25; i++) {
      r = Crypto.SHA256(r.concat(x));
    }
    let checkrBigInt = new BigInteger(r);
    const orderBigInt = new BigInteger('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');
    while (checkrBigInt.compareTo(orderBigInt) >= 0 || checkrBigInt.equals(BigInteger.ZERO) || checkrBigInt.equals(BigInteger.ONE)) {
      r = Crypto.SHA256(r.concat(x));
      checkrBigInt = new BigInteger(r);
    }
    return r;
  };

  /* generate a public key from a private key */
  coinjs.newPubkey = function(hash) {
    const privateKeyBigInt = BigInteger.fromByteArrayUnsigned(Crypto.util.hexToBytes(hash));
    const curve = EllipticCurve.getSECCurveByName('secp256k1');

    const curvePt = curve.getG().multiply(privateKeyBigInt);
    const x = curvePt.getX().toBigInteger();
    const y = curvePt.getY().toBigInteger();

    let publicKeyBytes = EllipticCurve.integerToBytes(x, 32);
    publicKeyBytes = publicKeyBytes.concat(EllipticCurve.integerToBytes(y, 32));
    publicKeyBytes.unshift(0x04);

    if (coinjs.compressed == true) {
      const publicKeyBytesCompressed = EllipticCurve.integerToBytes(x, 32);
      if (y.isEven()) {
        publicKeyBytesCompressed.unshift(0x02);
      } else {
        publicKeyBytesCompressed.unshift(0x03);
      }
      return Crypto.util.bytesToHex(publicKeyBytesCompressed);
    } else {
      return Crypto.util.bytesToHex(publicKeyBytes);
    }
  };

  /* provide a public key and return address */
  coinjs.pubkey2address = function(h, byte) {
    const r = ripemd160(Crypto.SHA256(Crypto.util.hexToBytes(h), {
      asBytes: true,
    }));
    r.unshift(byte || coinjs.pub);
    const hash = Crypto.SHA256(Crypto.SHA256(r, {
      asBytes: true,
    }), {
      asBytes: true,
    });
    const checksum = hash.slice(0, 4);
    return coinjs.base58encode(r.concat(checksum));
  };

  /* provide a scripthash and return address */
  coinjs.scripthash2address = function(h) {
    const x = Crypto.util.hexToBytes(h);
    x.unshift(coinjs.pub);
    let r = x;
    r = Crypto.SHA256(Crypto.SHA256(r, {
      asBytes: true,
    }), {
      asBytes: true,
    });
    const checksum = r.slice(0, 4);
    return coinjs.base58encode(x.concat(checksum));
  };

  /* new multisig address, provide the pubkeys AND required signatures to release the funds */
  coinjs.pubkeys2MultisigAddress = function(pubkeys, required) {
    const s = coinjs.script();
    s.writeOp(81 + (required * 1) - 1); // OP_1
    for (let i = 0; i < pubkeys.length; ++i) {
      s.writeBytes(Crypto.util.hexToBytes(pubkeys[i]));
    }
    s.writeOp(81 + pubkeys.length - 1); // OP_1
    s.writeOp(174); // OP_CHECKMULTISIG
    const x = ripemd160(Crypto.SHA256(s.buffer, {
      asBytes: true,
    }), {
      asBytes: true,
    });
    x.unshift(coinjs.multisig);
    let r = x;
    r = Crypto.SHA256(Crypto.SHA256(r, {
      asBytes: true,
    }), {
      asBytes: true,
    });
    const checksum = r.slice(0, 4);
    let redeemScript = Crypto.util.bytesToHex(s.buffer);
    let address = coinjs.base58encode(x.concat(checksum));

    if (s.buffer.length > 520) { // too large
      address = 'invalid';
      redeemScript = 'invalid';
    }

    return {
      'address': address,
      'redeemScript': redeemScript,
      'size': s.buffer.length,
    };
  };

  /* new time locked address, provide the pubkey and time necessary to unlock the funds.
        when time is greater than 500000000, it should be a unix timestamp (seconds since epoch),
         otherwise it should be the block height required before this transaction can be released.

         may throw a string on failure!
      */
  coinjs.simpleHodlAddress = function(pubkey, checklocktimeverify) {
    if (checklocktimeverify < 0) {
      throw 'Parameter for OP_CHECKLOCKTIMEVERIFY is negative.';
    }

    const s = coinjs.script();
    s.writeBytes(coinjs.numToByteArray(checklocktimeverify));
    s.writeOp(177); // OP_CHECKLOCKTIMEVERIFY
    s.writeOp(117); // OP_DROP
    s.writeBytes(Crypto.util.hexToBytes(pubkey));
    s.writeOp(172); // OP_CHECKSIG

    const x = ripemd160(Crypto.SHA256(s.buffer, {
      asBytes: true,
    }), {
      asBytes: true,
    });
    x.unshift(coinjs.multisig);
    let r = x;
    r = Crypto.SHA256(Crypto.SHA256(r, {
      asBytes: true,
    }), {
      asBytes: true,
    });
    const checksum = r.slice(0, 4);
    const redeemScript = Crypto.util.bytesToHex(s.buffer);
    const address = coinjs.base58encode(x.concat(checksum));

    return {
      'address': address,
      'redeemScript': redeemScript,
    };
  };

  /* create a new segwit address */
  coinjs.segwitAddress = function(pubkey) {
    const keyhash = [0x00, 0x14].concat(ripemd160(Crypto.SHA256(Crypto.util.hexToBytes(pubkey), {
      asBytes: true,
    }), {
      asBytes: true,
    }));
    const x = ripemd160(Crypto.SHA256(keyhash, {
      asBytes: true,
    }), {
      asBytes: true,
    });
    x.unshift(coinjs.multisig);
    let r = x;
    r = Crypto.SHA256(Crypto.SHA256(r, {
      asBytes: true,
    }), {
      asBytes: true,
    });
    const checksum = r.slice(0, 4);
    const address = coinjs.base58encode(x.concat(checksum));

    return {
      'address': address,
      'type': 'segwit',
      'redeemscript': Crypto.util.bytesToHex(keyhash),
    };
  };

  /* create a new segwit bech32 encoded address */
  coinjs.bech32Address = function(pubkey) {
    const program = ripemd160(Crypto.SHA256(Crypto.util.hexToBytes(pubkey), {
      asBytes: true,
    }), {
      asBytes: true,
    });
    const address = coinjs.bech32_encode(coinjs.bech32.hrp, [coinjs.bech32.version].concat(coinjs.bech32_convert(program, 8, 5, true)));
    return {
      'address': address,
      'type': 'bech32',
      'redeemscript': Crypto.util.bytesToHex(program),
    };
  };

  /* extract the redeemscript from a bech32 address */
  coinjs.bech32redeemscript = function(address) {
    const r = false;
    const decode = coinjs.bech32_decode(address);
    if (decode) {
      decode.data.shift();
      return Crypto.util.bytesToHex(coinjs.bech32_convert(decode.data, 5, 8, true));
    }
    return r;
  };

  /* provide a privkey and return an WIF */
  coinjs.privkey2wif = function(h) {
    const r = Crypto.util.hexToBytes(h);

    if (coinjs.compressed == true) {
      r.push(0x01);
    }

    r.unshift(coinjs.priv);
    const hash = Crypto.SHA256(Crypto.SHA256(r, {
      asBytes: true,
    }), {
      asBytes: true,
    });
    const checksum = hash.slice(0, 4);

    return coinjs.base58encode(r.concat(checksum));
  };

  /* convert a wif key back to a private key */
  coinjs.wif2privkey = function(wif) {
    let compressed = false;
    const decode = coinjs.base58decode(wif);
    let key = decode.slice(0, decode.length - 4);
    key = key.slice(1, key.length);
    if (key.length >= 33 && key[key.length - 1] == 0x01) {
      key = key.slice(0, key.length - 1);
      compressed = true;
    }
    return {
      'privkey': Crypto.util.bytesToHex(key),
      'compressed': compressed,
    };
  };

  /* convert a wif to a pubkey */
  coinjs.wif2pubkey = function(wif) {
    const compressed = coinjs.compressed;
    const r = coinjs.wif2privkey(wif);
    coinjs.compressed = r['compressed'];
    const pubkey = coinjs.newPubkey(r['privkey']);
    coinjs.compressed = compressed;
    return {
      'pubkey': pubkey,
      'compressed': r['compressed'],
    };
  };

  /* convert a wif to a address */
  coinjs.wif2address = function(wif) {
    const r = coinjs.wif2pubkey(wif);
    return {
      'address': coinjs.pubkey2address(r['pubkey']),
      'compressed': r['compressed'],
    };
  };

  /* decode or validate an address and return the hash */
  coinjs.addressDecode = function(addr) {
    try {
      const bytes = coinjs.base58decode(addr);
      const front = bytes.slice(0, bytes.length - 4);
      const back = bytes.slice(bytes.length - 4);
      const checksum = Crypto.SHA256(Crypto.SHA256(front, {
        asBytes: true,
      }), {
        asBytes: true,
      }).slice(0, 4);
      if (checksum + '' == back + '') {
        const o = {};
        o.bytes = front.slice(1);
        o.version = front[0];

        if (o.version == coinjs.pub) { // standard address
          o.type = 'standard';
        } else if (o.version == coinjs.multisig) { // multisig address
          o.type = 'multisig';
        } else if (o.version == coinjs.priv) { // wifkey
          o.type = 'wifkey';
        } else if (o.version == 42) { // stealth address
          o.type = 'stealth';

          o.option = front[1];
          if (o.option != 0) {
            alert('Stealth Address option other than 0 is currently not supported!');
            return false;
          };

          o.scankey = Crypto.util.bytesToHex(front.slice(2, 35));
          o.n = front[35];

          if (o.n > 1) {
            alert('Stealth Multisig is currently not supported!');
            return false;
          };

          o.spendkey = Crypto.util.bytesToHex(front.slice(36, 69));
          o.m = front[69];
          o.prefixlen = front[70];

          if (o.prefixlen > 0) {
            alert('Stealth Address Prefixes are currently not supported!');
            return false;
          };
          o.prefix = front.slice(71);
        } else { // everything else
          o.type = 'other'; // address is still valid but unknown version
        }

        return o;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  /* retreive the balance from a given address */
  coinjs.addressBalance = function(address, callback) {
    coinjs.ajax(
        coinjs.host + '?method=blockchain.address.balance&params[]=' + address,
        callback,
        'GET'
    );
  };

  /* decompress an compressed public key */
  coinjs.pubkeydecompress = function(pubkey) {
    if ((typeof(pubkey) == 'string') && pubkey.match(/^[a-f0-9]+$/i)) {
      const curve = EllipticCurve.getSECCurveByName('secp256k1');
      try {
        const pt = curve.curve.decodePointHex(pubkey);
        const x = pt.getX().toBigInteger();
        const y = pt.getY().toBigInteger();

        let publicKeyBytes = EllipticCurve.integerToBytes(x, 32);
        publicKeyBytes = publicKeyBytes.concat(EllipticCurve.integerToBytes(y, 32));
        publicKeyBytes.unshift(0x04);
        return Crypto.util.bytesToHex(publicKeyBytes);
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  coinjs.bech32_polymod = function(values) {
    let chk = 1;
    const BECH32_GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
    for (let p = 0; p < values.length; ++p) {
      const top = chk >> 25;
      chk = (chk & 0x1ffffff) << 5 ^ values[p];
      for (let i = 0; i < 5; ++i) {
        if ((top >> i) & 1) {
          chk ^= BECH32_GENERATOR[i];
        }
      }
    }
    return chk;
  };

  coinjs.bech32_hrpExpand = function(hrp) {
    const ret = [];
    let p;
    for (p = 0; p < hrp.length; ++p) {
      ret.push(hrp.charCodeAt(p) >> 5);
    }
    ret.push(0);
    for (p = 0; p < hrp.length; ++p) {
      ret.push(hrp.charCodeAt(p) & 31);
    }
    return ret;
  };

  coinjs.bech32_verifyChecksum = function(hrp, data) {
    return coinjs.bech32_polymod(coinjs.bech32_hrpExpand(hrp).concat(data)) === 1;
  };

  coinjs.bech32_createChecksum = function(hrp, data) {
    const values = coinjs.bech32_hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
    const mod = coinjs.bech32_polymod(values) ^ 1;
    const ret = [];
    for (let p = 0; p < 6; ++p) {
      ret.push((mod >> 5 * (5 - p)) & 31);
    }
    return ret;
  };

  coinjs.bech32_encode = function(hrp, data) {
    const combined = data.concat(coinjs.bech32_createChecksum(hrp, data));
    let ret = hrp + '1';
    for (let p = 0; p < combined.length; ++p) {
      ret += coinjs.bech32.charset.charAt(combined[p]);
    }
    return ret;
  };

  coinjs.bech32_decode = function(bechString) {
    let p;
    let has_lower = false;
    let has_upper = false;
    for (p = 0; p < bechString.length; ++p) {
      if (bechString.charCodeAt(p) < 33 || bechString.charCodeAt(p) > 126) {
        return null;
      }
      if (bechString.charCodeAt(p) >= 97 && bechString.charCodeAt(p) <= 122) {
        has_lower = true;
      }
      if (bechString.charCodeAt(p) >= 65 && bechString.charCodeAt(p) <= 90) {
        has_upper = true;
      }
    }
    if (has_lower && has_upper) {
      return null;
    }
    bechString = bechString.toLowerCase();
    const pos = bechString.lastIndexOf('1');
    if (pos < 1 || pos + 7 > bechString.length || bechString.length > 90) {
      return null;
    }
    const hrp = bechString.substring(0, pos);
    const data = [];
    for (p = pos + 1; p < bechString.length; ++p) {
      const d = coinjs.bech32.charset.indexOf(bechString.charAt(p));
      if (d === -1) {
        return null;
      }
      data.push(d);
    }
    if (!coinjs.bech32_verifyChecksum(hrp, data)) {
      return null;
    }
    return {
      hrp: hrp,
      data: data.slice(0, data.length - 6),
    };
  };

  coinjs.bech32_convert = function(data, inBits, outBits, pad) {
    let value = 0;
    let bits = 0;
    const maxV = (1 << outBits) - 1;

    const result = [];
    for (let i = 0; i < data.length; ++i) {
      value = (value << inBits) | data[i];
      bits += inBits;

      while (bits >= outBits) {
        bits -= outBits;
        result.push((value >> bits) & maxV);
      }
    }

    if (pad) {
      if (bits > 0) {
        result.push((value << (outBits - bits)) & maxV);
      }
    } else {
      if (bits >= inBits) throw new Error('Excess padding');
      if ((value << (outBits - bits)) & maxV) throw new Error('Non-zero padding');
    }

    return result;
  };

  coinjs.testdeterministicK = function() {
    // https://github.com/bitpay/bitcore/blob/9a5193d8e94b0bd5b8e7f00038e7c0b935405a03/test/crypto/ecdsa.js
    // Line 21 and 22 specify digest hash and privkey for the first 2 test vectors.
    // Line 96-117 tells expected result.

    const tx = coinjs.transaction();

    const test_vectors = [{
      'message': 'test data',
      'privkey': 'fee0a1f7afebf9d2a5a80c0c98a31c709681cce195cbcd06342b517970c0be1e',
      'k_bad00': 'fcce1de7a9bcd6b2d3defade6afa1913fb9229e3b7ddf4749b55c4848b2a196e',
      'k_bad01': '727fbcb59eb48b1d7d46f95a04991fc512eb9dbf9105628e3aec87428df28fd8',
      'k_bad15': '398f0e2c9f79728f7b3d84d447ac3a86d8b2083c8f234a0ffa9c4043d68bd258',
    },
    {
      'message': 'Everything should be made as simple as possible, but not simpler.',
      'privkey': '0000000000000000000000000000000000000000000000000000000000000001',
      'k_bad00': 'ec633bd56a5774a0940cb97e27a9e4e51dc94af737596a0c5cbb3d30332d92a5',
      'k_bad01': 'df55b6d1b5c48184622b0ead41a0e02bfa5ac3ebdb4c34701454e80aabf36f56',
      'k_bad15': 'def007a9a3c2f7c769c75da9d47f2af84075af95cadd1407393dc1e26086ef87',
    },
    {
      'message': 'Satoshi Nakamoto',
      'privkey': '0000000000000000000000000000000000000000000000000000000000000002',
      'k_bad00': 'd3edc1b8224e953f6ee05c8bbf7ae228f461030e47caf97cde91430b4607405e',
      'k_bad01': 'f86d8e43c09a6a83953f0ab6d0af59fb7446b4660119902e9967067596b58374',
      'k_bad15': '241d1f57d6cfd2f73b1ada7907b199951f95ef5ad362b13aed84009656e0254a',
    },
    {
      'message': 'Diffie Hellman',
      'privkey': '7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f',
      'k_bad00': 'c378a41cb17dce12340788dd3503635f54f894c306d52f6e9bc4b8f18d27afcc',
      'k_bad01': '90756c96fef41152ac9abe08819c4e95f16da2af472880192c69a2b7bac29114',
      'k_bad15': '7b3f53300ab0ccd0f698f4d67db87c44cf3e9e513d9df61137256652b2e94e7c',
    },
    {
      'message': 'Japan',
      'privkey': '8080808080808080808080808080808080808080808080808080808080808080',
      'k_bad00': 'f471e61b51d2d8db78f3dae19d973616f57cdc54caaa81c269394b8c34edcf59',
      'k_bad01': '6819d85b9730acc876fdf59e162bf309e9f63dd35550edf20869d23c2f3e6d17',
      'k_bad15': 'd8e8bae3ee330a198d1f5e00ad7c5f9ed7c24c357c0a004322abca5d9cd17847',
    },
    {
      'message': 'Bitcoin',
      'privkey': 'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140',
      'k_bad00': '36c848ffb2cbecc5422c33a994955b807665317c1ce2a0f59c689321aaa631cc',
      'k_bad01': '4ed8de1ec952a4f5b3bd79d1ff96446bcd45cabb00fc6ca127183e14671bcb85',
      'k_bad15': '56b6f47babc1662c011d3b1f93aa51a6e9b5f6512e9f2e16821a238d450a31f8',
    },
    {
      'message': 'i2FLPP8WEus5WPjpoHwheXOMSobUJVaZM1JPMQZq',
      'privkey': 'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140',
      'k_bad00': '6e9b434fcc6bbb081a0463c094356b47d62d7efae7da9c518ed7bac23f4e2ed6',
      'k_bad01': 'ae5323ae338d6117ce8520a43b92eacd2ea1312ae514d53d8e34010154c593bb',
      'k_bad15': '3eaa1b61d1b8ab2f1ca71219c399f2b8b3defa624719f1e96fe3957628c2c4ea',
    },
    {
      'message': 'lEE55EJNP7aLrMtjkeJKKux4Yg0E8E1SAJnWTCEh',
      'privkey': '3881e5286abc580bb6139fe8e83d7c8271c6fe5e5c2d640c1f0ed0e1ee37edc9',
      'k_bad00': '5b606665a16da29cc1c5411d744ab554640479dd8abd3c04ff23bd6b302e7034',
      'k_bad01': 'f8b25263152c042807c992eacd2ac2cc5790d1e9957c394f77ea368e3d9923bd',
      'k_bad15': 'ea624578f7e7964ac1d84adb5b5087dd14f0ee78b49072aa19051cc15dab6f33',
    },
    {
      'message': '2SaVPvhxkAPrayIVKcsoQO5DKA8Uv5X/esZFlf+y',
      'privkey': '7259dff07922de7f9c4c5720d68c9745e230b32508c497dd24cb95ef18856631',
      'k_bad00': '3ab6c19ab5d3aea6aa0c6da37516b1d6e28e3985019b3adb388714e8f536686b',
      'k_bad01': '19af21b05004b0ce9cdca82458a371a9d2cf0dc35a813108c557b551c08eb52e',
      'k_bad15': '117a32665fca1b7137a91c4739ac5719fec0cf2e146f40f8e7c21b45a07ebc6a',
    },
    {
      'message': '00A0OwO2THi7j5Z/jp0FmN6nn7N/DQd6eBnCS+/b',
      'privkey': '0d6ea45d62b334777d6995052965c795a4f8506044b4fd7dc59c15656a28f7aa',
      'k_bad00': '79487de0c8799158294d94c0eb92ee4b567e4dc7ca18addc86e49d31ce1d2db6',
      'k_bad01': '9561d2401164a48a8f600882753b3105ebdd35e2358f4f808c4f549c91490009',
      'k_bad15': 'b0d273634129ff4dbdf0df317d4062a1dbc58818f88878ffdb4ec511c77976c0',
    },
    ];

    let result_txt = '\n----------------------\nResults\n----------------------\n\n';

    for (i = 0; i < test_vectors.length; i++) {
      const hash = Crypto.SHA256(test_vectors[i]['message'].split('').map(function(c) {
        return c.charCodeAt(0);
      }), {
        asBytes: true,
      });
      const wif = coinjs.privkey2wif(test_vectors[i]['privkey']);

      const KBigInt = tx.deterministicK(wif, hash);
      const KBigInt0 = tx.deterministicK(wif, hash, 0);
      const KBigInt1 = tx.deterministicK(wif, hash, 1);
      const KBigInt15 = tx.deterministicK(wif, hash, 15);

      const K = Crypto.util.bytesToHex(KBigInt.toByteArrayUnsigned());
      const K0 = Crypto.util.bytesToHex(KBigInt0.toByteArrayUnsigned());
      const K1 = Crypto.util.bytesToHex(KBigInt1.toByteArrayUnsigned());
      const K15 = Crypto.util.bytesToHex(KBigInt15.toByteArrayUnsigned());

      if (K != test_vectors[i]['k_bad00']) {
        result_txt += 'Failed Test #' + (i + 1) + '\n	   K = ' + K + '\nExpected = ' + test_vectors[i]['k_bad00'] + '\n\n';
      } else if (K0 != test_vectors[i]['k_bad00']) {
        result_txt += 'Failed Test #' + (i + 1) + '\n	  K0 = ' + K0 + '\nExpected = ' + test_vectors[i]['k_bad00'] + '\n\n';
      } else if (K1 != test_vectors[i]['k_bad01']) {
        result_txt += 'Failed Test #' + (i + 1) + '\n	  K1 = ' + K1 + '\nExpected = ' + test_vectors[i]['k_bad01'] + '\n\n';
      } else if (K15 != test_vectors[i]['k_bad15']) {
        result_txt += 'Failed Test #' + (i + 1) + '\n	 K15 = ' + K15 + '\nExpected = ' + test_vectors[i]['k_bad15'] + '\n\n';
      };
    };

    if (result_txt.length < 60) {
      result_txt = 'All Tests OK!';
    };

    return result_txt;
  };

  /* start of hd functions, thanks bip32.org */
  coinjs.hd = function(data) {
    const r = {};

    /* some hd value parsing */
    r.parse = function() {
      let bytes = [];

      // some quick validation
      if (typeof(data) == 'string') {
        const decoded = coinjs.base58decode(data);
        if (decoded.length == 82) {
          const checksum = decoded.slice(78, 82);
          const hash = Crypto.SHA256(Crypto.SHA256(decoded.slice(0, 78), {
            asBytes: true,
          }), {
            asBytes: true,
          });
          if (checksum[0] == hash[0] && checksum[1] == hash[1] && checksum[2] == hash[2] && checksum[3] == hash[3]) {
            bytes = decoded.slice(0, 78);
          }
        }
      }

      // actual parsing code
      if (bytes && bytes.length > 0) {
        r.version = coinjs.uint(bytes.slice(0, 4), 4);
        r.depth = coinjs.uint(bytes.slice(4, 5), 1);
        r.parent_fingerprint = bytes.slice(5, 9);
        r.child_index = coinjs.uint(bytes.slice(9, 13), 4);
        r.chain_code = bytes.slice(13, 45);
        r.key_bytes = bytes.slice(45, 78);

        const c = coinjs.compressed; // get current default
        coinjs.compressed = true;

        if (r.key_bytes[0] == 0x00) {
          r.type = 'private';
          const privkey = (r.key_bytes).slice(1, 33);
          const privkeyHex = Crypto.util.bytesToHex(privkey);
          const pubkey = coinjs.newPubkey(privkeyHex);

          r.keys = {
            'privkey': privkeyHex,
            'pubkey': pubkey,
            'address': coinjs.pubkey2address(pubkey),
            'wif': coinjs.privkey2wif(privkeyHex),
          };
        } else if (r.key_bytes[0] == 0x02 || r.key_bytes[0] == 0x03) {
          r.type = 'public';
          const pubkeyHex = Crypto.util.bytesToHex(r.key_bytes);

          r.keys = {
            'pubkey': pubkeyHex,
            'address': coinjs.pubkey2address(pubkeyHex),
          };
        } else {
          r.type = 'invalid';
        }

        r.keys_extended = r.extend();

        coinjs.compressed = c; // reset to default
      }
    };

    // extend prv/pub key
    r.extend = function() {
      const hd = coinjs.hd();
      return hd.make({
        'depth': (this.depth * 1) + 1,
        'parent_fingerprint': this.parent_fingerprint,
        'child_index': this.child_index,
        'chain_code': this.chain_code,
        'privkey': this.keys.privkey,
        'pubkey': this.keys.pubkey,
      });
    };

    // derive key from index
    r.derive = function(i) {
      i = (i) ? i : 0;
      const blob = (Crypto.util.hexToBytes(this.keys.pubkey)).concat(coinjs.numToBytes(i, 4).reverse());

      const j = new jsSHA(Crypto.util.bytesToHex(blob), 'HEX');
      const hash = j.getHMAC(Crypto.util.bytesToHex(r.chain_code), 'HEX', 'SHA-512', 'HEX');

      const il = new BigInteger(hash.slice(0, 64), 16);
      const ir = Crypto.util.hexToBytes(hash.slice(64, 128));

      const ecparams = EllipticCurve.getSECCurveByName('secp256k1');
      const curve = ecparams.getCurve();

      let k; let key; let pubkey; let o;

      o = coinjs.clone(this);
      o.chain_code = ir;
      o.child_index = i;

      if (this.type == 'private') {
        // derive key pair from from a xprv key
        k = il.add(new BigInteger([0].concat(Crypto.util.hexToBytes(this.keys.privkey)))).mod(ecparams.getN());
        key = Crypto.util.bytesToHex(k.toByteArrayUnsigned());

        pubkey = coinjs.newPubkey(key);

        o.keys = {
          'privkey': key,
          'pubkey': pubkey,
          'wif': coinjs.privkey2wif(key),
          'address': coinjs.pubkey2address(pubkey),
        };
      } else if (this.type == 'public') {
        // derive xpub key from an xpub key
        q = ecparams.curve.decodePointHex(this.keys.pubkey);
        const curvePt = ecparams.getG().multiply(il).add(q);

        const x = curvePt.getX().toBigInteger();
        const y = curvePt.getY().toBigInteger();

        const publicKeyBytesCompressed = EllipticCurve.integerToBytes(x, 32);
        if (y.isEven()) {
          publicKeyBytesCompressed.unshift(0x02);
        } else {
          publicKeyBytesCompressed.unshift(0x03);
        }
        pubkey = Crypto.util.bytesToHex(publicKeyBytesCompressed);

        o.keys = {
          'pubkey': pubkey,
          'address': coinjs.pubkey2address(pubkey),
        };
      } else {
        // fail
      }

      o.parent_fingerprint = (ripemd160(Crypto.SHA256(Crypto.util.hexToBytes(r.keys.pubkey), {
        asBytes: true,
      }), {
        asBytes: true,
      })).slice(0, 4);
      o.keys_extended = o.extend();

      return o;
    };

    // make a master hd xprv/xpub
    r.master = function(pass) {
      const seed = (pass) ? Crypto.SHA256(pass) : coinjs.newPrivkey();
      const hasher = new jsSHA(seed, 'HEX');
      const I = hasher.getHMAC('Bitcoin seed', 'TEXT', 'SHA-512', 'HEX');

      const privkey = Crypto.util.hexToBytes(I.slice(0, 64));
      const chain = Crypto.util.hexToBytes(I.slice(64, 128));

      const hd = coinjs.hd();
      return hd.make({
        'depth': 0,
        'parent_fingerprint': [0, 0, 0, 0],
        'child_index': 0,
        'chain_code': chain,
        'privkey': I.slice(0, 64),
        'pubkey': coinjs.newPubkey(I.slice(0, 64)),
      });
    };

    // encode data to a base58 string
    r.make = function(data) { // { (int) depth, (array) parent_fingerprint, (int) child_index, (byte array) chain_code, (hex str) privkey, (hex str) pubkey}
      let k = [];

      // depth
      k.push(data.depth * 1);

      // parent fingerprint
      k = k.concat(data.parent_fingerprint);

      // child index
      k = k.concat((coinjs.numToBytes(data.child_index, 4)).reverse());

      // Chain code
      k = k.concat(data.chain_code);

      const o = {}; // results

      // encode xprv key
      if (data.privkey) {
        let prv = (coinjs.numToBytes(coinjs.hdkey.prv, 4)).reverse();
        prv = prv.concat(k);
        prv.push(0x00);
        prv = prv.concat(Crypto.util.hexToBytes(data.privkey));
        var hash = Crypto.SHA256(Crypto.SHA256(prv, {
          asBytes: true,
        }), {
          asBytes: true,
        });
        var checksum = hash.slice(0, 4);
        var ret = prv.concat(checksum);
        o.privkey = coinjs.base58encode(ret);
      }

      // encode xpub key
      if (data.pubkey) {
        let pub = (coinjs.numToBytes(coinjs.hdkey.pub, 4)).reverse();
        pub = pub.concat(k);
        pub = pub.concat(Crypto.util.hexToBytes(data.pubkey));
        var hash = Crypto.SHA256(Crypto.SHA256(pub, {
          asBytes: true,
        }), {
          asBytes: true,
        });
        var checksum = hash.slice(0, 4);
        var ret = pub.concat(checksum);
        o.pubkey = coinjs.base58encode(ret);
      }
      return o;
    };

    r.parse();
    return r;
  };


  /* start of script functions */
  coinjs.script = function(data) {
    const r = {};

    if (!data) {
      r.buffer = [];
    } else if ('string' == typeof data) {
      r.buffer = Crypto.util.hexToBytes(data);
    } else if (coinjs.isArray(data)) {
      r.buffer = data;
    } else if (data instanceof coinjs.script) {
      r.buffer = data.buffer;
    } else {
      r.buffer = data;
    }

    /* parse buffer array */
    r.parse = function() {
      const self = this;
      r.chunks = [];
      let i = 0;

      function readChunk(n) {
        self.chunks.push(self.buffer.slice(i, i + n));
        i += n;
      };

      while (i < this.buffer.length) {
        let opcode = this.buffer[i++];
        if (opcode >= 0xF0) {
          opcode = (opcode << 8) | this.buffer[i++];
        }

        var len;
        if (opcode > 0 && opcode < 76) { // OP_PUSHDATA1
          readChunk(opcode);
        } else if (opcode == 76) { // OP_PUSHDATA1
          len = this.buffer[i++];
          readChunk(len);
        } else if (opcode == 77) { // OP_PUSHDATA2
          len = (this.buffer[i++] << 8) | this.buffer[i++];
          readChunk(len);
        } else if (opcode == 78) { // OP_PUSHDATA4
          len = (this.buffer[i++] << 24) | (this.buffer[i++] << 16) | (this.buffer[i++] << 8) | this.buffer[i++];
          readChunk(len);
        } else {
          this.chunks.push(opcode);
        }

        if (i < 0x00) {
          break;
        }
      }

      return true;
    };

    /* decode the redeemscript of a multisignature transaction */
    r.decodeRedeemScript = function(script) {
      let r = false;
      try {
        const s = coinjs.script(Crypto.util.hexToBytes(script));
        if ((s.chunks.length >= 3) && s.chunks[s.chunks.length - 1] == 174) { // OP_CHECKMULTISIG
          r = {};
          r.signaturesRequired = s.chunks[0] - 80;
          const pubkeys = [];
          for (let i = 1; i < s.chunks.length - 2; i++) {
            pubkeys.push(Crypto.util.bytesToHex(s.chunks[i]));
          }
          r.pubkeys = pubkeys;
          const multi = coinjs.pubkeys2MultisigAddress(pubkeys, r.signaturesRequired);
          r.address = multi['address'];
          r.type = 'multisig__'; // using __ for now to differentiat from the other object .type == "multisig"
        } else if ((s.chunks.length == 2) && (s.buffer[0] == 0 && s.buffer[1] == 20)) { // SEGWIT
          r = {};
          r.type = 'segwit__';
          const rs = Crypto.util.bytesToHex(s.buffer);
          r.address = coinjs.pubkey2address(rs, coinjs.multisig);
          r.redeemscript = rs;
        } else if (s.chunks.length == 5 && s.chunks[1] == 177 && s.chunks[2] == 117 && s.chunks[4] == 172) {
          // ^ <unlocktime> OP_CHECKLOCKTIMEVERIFY OP_DROP <pubkey> OP_CHECKSIG ^
          r = {};
          r.pubkey = Crypto.util.bytesToHex(s.chunks[3]);
          r.checklocktimeverify = coinjs.bytesToNum(s.chunks[0].slice());
          r.address = coinjs.simpleHodlAddress(r.pubkey, r.checklocktimeverify).address;
          r.type = 'hodl__';
        }
      } catch (e) {
        r = false;
      }
      return r;
    };

    /* create output script to spend */
    r.spendToScript = function(address) {
      const addr = coinjs.addressDecode(address);
      const s = coinjs.script();
      if (addr.type == 'bech32') {
        s.writeOp(0);
        s.writeBytes(Crypto.util.hexToBytes(addr.redeemscript));
      } else if (addr.version == coinjs.multisig) { // multisig address
        s.writeOp(169); // OP_HASH160
        s.writeBytes(addr.bytes);
        s.writeOp(135); // OP_EQUAL
      } else { // regular address
        s.writeOp(118); // OP_DUP
        s.writeOp(169); // OP_HASH160
        s.writeBytes(addr.bytes);
        s.writeOp(136); // OP_EQUALVERIFY
        s.writeOp(172); // OP_CHECKSIG
      }
      return s;
    };

    /* geneate a (script) pubkey hash of the address - used for when signing */
    r.pubkeyHash = function(address) {
      const addr = coinjs.addressDecode(address);
      const s = coinjs.script();
      s.writeOp(118); // OP_DUP
      s.writeOp(169); // OP_HASH160
      s.writeBytes(addr.bytes);
      s.writeOp(136); // OP_EQUALVERIFY
      s.writeOp(172); // OP_CHECKSIG
      return s;
    };

    /* write to buffer */
    r.writeOp = function(op) {
      this.buffer.push(op);
      this.chunks.push(op);
      return true;
    };

    /* write bytes to buffer */
    r.writeBytes = function(data) {
      if (data.length < 76) { // OP_PUSHDATA1
        this.buffer.push(data.length);
      } else if (data.length <= 0xff) {
        this.buffer.push(76); // OP_PUSHDATA1
        this.buffer.push(data.length);
      } else if (data.length <= 0xffff) {
        this.buffer.push(77); // OP_PUSHDATA2
        this.buffer.push(data.length & 0xff);
        this.buffer.push((data.length >>> 8) & 0xff);
      } else {
        this.buffer.push(78); // OP_PUSHDATA4
        this.buffer.push(data.length & 0xff);
        this.buffer.push((data.length >>> 8) & 0xff);
        this.buffer.push((data.length >>> 16) & 0xff);
        this.buffer.push((data.length >>> 24) & 0xff);
      }
      this.buffer = this.buffer.concat(data);
      this.chunks.push(data);
      return true;
    };

    r.parse();
    return r;
  };

  /* start of transaction functions */

  /* create a new transaction object */
  coinjs.transaction = function() {
    const r = {};
    r.version = 1;
    r.lock_time = 0;
    r.ins = [];
    r.outs = [];
    r.witness = false;
    r.timestamp = null;
    r.block = null;

    /* add an input to a transaction */
    r.addinput = function(txid, index, script, sequence) {
      const o = {};
      o.outpoint = {
        'hash': txid,
        'index': index,
      };
      o.script = coinjs.script(script || []);
      o.sequence = sequence || ((r.lock_time == 0) ? 4294967295 : 0);
      return this.ins.push(o);
    };

    /* add an output to a transaction */
    r.addoutput = function(address, value) {
      const o = {};
      o.value = new BigInteger('' + amountFormat(value, true), 10);
      const s = coinjs.script();
      o.script = s.spendToScript(address);

      return this.outs.push(o);
    };

    /* add two outputs for stealth addresses to a transaction */
    r.addstealth = function(stealth, value) {
      const ephemeralKeyBigInt = BigInteger.fromByteArrayUnsigned(Crypto.util.hexToBytes(coinjs.newPrivkey()));
      const curve = EllipticCurve.getSECCurveByName('secp256k1');

      const p = EllipticCurve.fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F');
      const a = BigInteger.ZERO;
      const b = EllipticCurve.fromHex('7');
      const calccurve = new EllipticCurve.CurveFp(p, a, b);

      const ephemeralPt = curve.getG().multiply(ephemeralKeyBigInt);
      const scanPt = calccurve.decodePointHex(stealth.scankey);
      const sharedPt = scanPt.multiply(ephemeralKeyBigInt);
      const stealthindexKeyBigInt = BigInteger.fromByteArrayUnsigned(Crypto.SHA256(sharedPt.getEncoded(true), {
        asBytes: true,
      }));

      const stealthindexPt = curve.getG().multiply(stealthindexKeyBigInt);
      const spendPt = calccurve.decodePointHex(stealth.spendkey);
      const addressPt = spendPt.add(stealthindexPt);

      const sendaddress = coinjs.pubkey2address(Crypto.util.bytesToHex(addressPt.getEncoded(true)));


      const OPRETBytes = [6].concat(Crypto.util.randomBytes(4)).concat(ephemeralPt.getEncoded(true)); // ephemkey data
      const q = coinjs.script();
      q.writeOp(106); // OP_RETURN
      q.writeBytes(OPRETBytes);
      v = {};
      v.value = 0;
      v.script = q;

      this.outs.push(v);

      const o = {};
      o.value = new BigInteger('' + Math.round((value * 1) * 1e4), 10);
      const s = coinjs.script();
      o.script = s.spendToScript(sendaddress);

      return this.outs.push(o);
    };

    /* add data to a transaction */
    r.adddata = function(data) {
      const r = false;
      if (((data.match(/^[a-f0-9]+$/gi)) && data.length < 160) && (data.length % 2) == 0) {
        const s = coinjs.script();
        s.writeOp(106); // OP_RETURN
        s.writeBytes(Crypto.util.hexToBytes(data));
        o = {};
        o.value = 0;
        o.script = s;
        return this.outs.push(o);
      }
      return r;
    };

    /* list unspent transactions */
    r.listUnspent = function(address, amount, callback) {
      coinjs.ajax(
          coinjs.host + '?method=blockchain.address.utxo&params[]=' + address + '&params[]=' + amount,
          callback,
          'GET'
      );
    };

    /* add unspent to transaction */
    r.addUnspent = function(address, amount, callback, script, segwit, sequence) {
      const self = this;
      this.listUnspent(address, amount, function(data) {
        let s = coinjs.script();
        let value = 0;
        let total = 0;
        const x = {};

        data = JSON.parse(data);
        const unspent = data.result;

        for (i = 0; i < unspent.length; i++) {
          const utxo = unspent[i];

          const txhash = utxo.tx_hash;
          const n = utxo.tx_pos;
          let scr = script || utxo.script;

          if (segwit) {
            /* this is a small hack to include the value with the redeemscript to make the signing procedure smoother.
                It is not standard and removed during the signing procedure. */

            s = coinjs.script();
            s.writeBytes(Crypto.util.hexToBytes(script));
            s.writeOp(0);
            s.writeBytes(coinjs.numToBytes(utxo.value * 1, 8));
            scr = Crypto.util.bytesToHex(s.buffer);
          }

          const seq = sequence || false;
          self.addinput(txhash, n, scr, seq);
          value += utxo.value * 1;
          total++;
        }

        x.unspent = unspent;
        x.value = value;
        x.total = total;
        return callback(x);
      });
    };

    /* add unspent and sign */
    r.addUnspentAndSign = function(wif, amount, callback) {
      const self = this;
      const address = coinjs.wif2address(wif);
      self.addUnspent(address['address'], amount, function(data) {
        self.sign(wif);
        return callback(data);
      });
    };

    /* broadcast a transaction */
    r.broadcast = function(txhex) {
      const tx = txhex || this.serialize();
      return txBroadcast(tx);
    };

    /* generate the transaction hash to sign from a transaction input */
    r.transactionHash = function(index, sigHashType) {
      const clone = coinjs.clone(this);
      const shType = sigHashType || 1;

      /* black out all other ins, except this one */
      for (var i = 0; i < clone.ins.length; i++) {
        if (index != i) {
          clone.ins[i].script = coinjs.script();
        }
      }

      const extract = this.extractScriptKey(index);
      clone.ins[index].script = coinjs.script(extract['script']);

      if ((clone.ins) && clone.ins[index]) {
        /* SIGHASH : For more info on sig hashs see https://en.bitcoin.it/wiki/OP_CHECKSIG
            	and https://bitcoin.org/en/developer-guide#signature-hash-type */

        if (shType == 1) {
          // SIGHASH_ALL 0x01

        } else if (shType == 2) {
          // SIGHASH_NONE 0x02
          clone.outs = [];
          for (var i = 0; i < clone.ins.length; i++) {
            if (index != i) {
              clone.ins[i].sequence = 0;
            }
          }
        } else if (shType == 3) {
          // SIGHASH_SINGLE 0x03
          clone.outs.length = index + 1;

          for (var i = 0; i < index; i++) {
            clone.outs[i].value = -1;
            clone.outs[i].script.buffer = [];
          }

          for (var i = 0; i < clone.ins.length; i++) {
            if (index != i) {
              clone.ins[i].sequence = 0;
            }
          }
        } else if (shType >= 128) {
          // SIGHASH_ANYONECANPAY 0x80
          clone.ins = [clone.ins[index]];

          if (shType == 129) {
            // SIGHASH_ALL + SIGHASH_ANYONECANPAY

          } else if (shType == 130) {
            // SIGHASH_NONE + SIGHASH_ANYONECANPAY
            clone.outs = [];
          } else if (shType == 131) {
            // SIGHASH_SINGLE + SIGHASH_ANYONECANPAY
            clone.outs.length = index + 1;
            for (var i = 0; i < index; i++) {
              clone.outs[i].value = -1;
              clone.outs[i].script.buffer = [];
            }
          }
        }

        let buffer = Crypto.util.hexToBytes(clone.serialize());
        buffer = buffer.concat(coinjs.numToBytes(parseInt(shType), 4));
        const hash = Crypto.SHA256(buffer, {
          asBytes: true,
        });
        const r = Crypto.util.bytesToHex(Crypto.SHA256(hash, {
          asBytes: true,
        }));
        return r;
      } else {
        return false;
      }
    };

    /* generate a segwit transaction hash to sign from a transaction input */
    r.transactionHashSegWitV0 = function(index, sigHashType) {
      /*
             Notice: coinb.in by default, deals with segwit transactions in a non-standard way.
             Segwit transactions require that input values are included in the transaction hash.
             To save wasting resources and potentially slowing down this service, we include the amount with the
             redeem script to generate the transaction hash and remove it after its signed.
          */

      // start redeem script check
      const extract = this.extractScriptKey(index);
      if (extract['type'] != 'segwit') {
        return {
          'result': 0,
          'fail': 'redeemscript',
          'response': 'redeemscript missing or not valid for segwit',
        };
      }

      if (extract['value'] == -1) {
        return {
          'result': 0,
          'fail': 'value',
          'response': 'unable to generate a valid segwit hash without a value',
        };
      }

      let scriptcode = Crypto.util.hexToBytes(extract['script']);

      // end of redeem script check

      /* P2WPKH */
      if (scriptcode.length == 20) {
        scriptcode = [0x00, 0x14].concat(scriptcode);
      }

      if (scriptcode.length == 22) {
        scriptcode = scriptcode.slice(1);
        scriptcode.unshift(25, 118, 169);
        scriptcode.push(136, 172);
      }

      const value = coinjs.numToBytes(extract['value'], 8);

      // start

      const zero = coinjs.numToBytes(0, 32);
      const version = coinjs.numToBytes(parseInt(this.version), 4);

      var bufferTmp = [];
      if (!(sigHashType >= 80)) { // not sighash anyonecanpay
        for (var i = 0; i < this.ins.length; i++) {
          bufferTmp = bufferTmp.concat(Crypto.util.hexToBytes(this.ins[i].outpoint.hash).reverse());
          bufferTmp = bufferTmp.concat(coinjs.numToBytes(this.ins[i].outpoint.index, 4));
        }
      }
      const hashPrevouts = bufferTmp.length >= 1 ? Crypto.SHA256(Crypto.SHA256(bufferTmp, {
        asBytes: true,
      }), {
        asBytes: true,
      }) : zero;

      var bufferTmp = [];
      if (!(sigHashType >= 80) && sigHashType != 2 && sigHashType != 3) { // not sighash anyonecanpay & single & none
        for (var i = 0; i < this.ins.length; i++) {
          bufferTmp = bufferTmp.concat(coinjs.numToBytes(this.ins[i].sequence, 4));
        }
      }
      const hashSequence = bufferTmp.length >= 1 ? Crypto.SHA256(Crypto.SHA256(bufferTmp, {
        asBytes: true,
      }), {
        asBytes: true,
      }) : zero;

      let outpoint = Crypto.util.hexToBytes(this.ins[index].outpoint.hash).reverse();
      outpoint = outpoint.concat(coinjs.numToBytes(this.ins[index].outpoint.index, 4));

      const nsequence = coinjs.numToBytes(this.ins[index].sequence, 4);
      let hashOutputs = zero;
      var bufferTmp = [];
      if (sigHashType != 2 && sigHashType != 3) { // not sighash single & none
        for (var i = 0; i < this.outs.length; i++) {
          bufferTmp = bufferTmp.concat(coinjs.numToBytes(this.outs[i].value, 8));
          bufferTmp = bufferTmp.concat(coinjs.numToVarInt(this.outs[i].script.buffer.length));
          bufferTmp = bufferTmp.concat(this.outs[i].script.buffer);
        }
        hashOutputs = Crypto.SHA256(Crypto.SHA256(bufferTmp, {
          asBytes: true,
        }), {
          asBytes: true,
        });
      } else if ((sigHashType == 2) && index < this.outs.length) { // is sighash single
        bufferTmp = bufferTmp.concat(coinjs.numToBytes(this.outs[index].value, 8));
        bufferTmp = bufferTmp.concat(coinjs.numToVarInt(this.outs[i].script.buffer.length));
        bufferTmp = bufferTmp.concat(this.outs[index].script.buffer);
        hashOutputs = Crypto.SHA256(Crypto.SHA256(bufferTmp, {
          asBytes: true,
        }), {
          asBytes: true,
        });
      }

      const locktime = coinjs.numToBytes(this.lock_time, 4);

      sigHashType |= coinjs.forkid;
      const sighash = coinjs.numToBytes(sigHashType, 4);

      let buffer = [];
      buffer = buffer.concat(version);
      buffer = buffer.concat(hashPrevouts);
      buffer = buffer.concat(hashSequence);
      buffer = buffer.concat(outpoint);
      buffer = buffer.concat(scriptcode);
      buffer = buffer.concat(value);
      buffer = buffer.concat(nsequence);
      buffer = buffer.concat(hashOutputs);
      buffer = buffer.concat(locktime);
      buffer = buffer.concat(sighash);

      const hash = Crypto.SHA256(buffer, {
        asBytes: true,
      });
      return {
        'result': 1,
        'hash': Crypto.util.bytesToHex(Crypto.SHA256(hash, {
          asBytes: true,
        })),
        'response': 'hash generated',
      };
    };

    /* extract the scriptSig, used in the transactionHash() function */
    r.extractScriptKey = function(index) {
      if (this.ins[index]) {
        if ((this.ins[index].script.chunks.length == 5) && this.ins[index].script.chunks[4] == 172 && coinjs.isArray(this.ins[index].script.chunks[2])) { // OP_CHECKSIG
          // regular scriptPubkey (not signed)
          return {
            'type': 'scriptpubkey',
            'signed': 'false',
            'signatures': 0,
            'script': Crypto.util.bytesToHex(this.ins[index].script.buffer),
          };
        } else if ((this.ins[index].script.chunks.length == 2) && this.ins[index].script.chunks[0][0] == 48 && this.ins[index].script.chunks[1].length == 5 && this.ins[index].script.chunks[1][1] == 177) { // OP_CHECKLOCKTIMEVERIFY
          // hodl script (signed)
          return {
            'type': 'hodl',
            'signed': 'true',
            'signatures': 1,
            'script': Crypto.util.bytesToHex(this.ins[index].script.buffer),
          };
        } else if ((this.ins[index].script.chunks.length == 2) && this.ins[index].script.chunks[0][0] == 48) {
          // regular scriptPubkey (probably signed)
          return {
            'type': 'scriptpubkey',
            'signed': 'true',
            'signatures': 1,
            'script': Crypto.util.bytesToHex(this.ins[index].script.buffer),
          };
        } else if (this.ins[index].script.chunks.length == 5 && this.ins[index].script.chunks[1] == 177) { // OP_CHECKLOCKTIMEVERIFY
          // hodl script (not signed)
          return {
            'type': 'hodl',
            'signed': 'false',
            'signatures': 0,
            'script': Crypto.util.bytesToHex(this.ins[index].script.buffer),
          };
        } else if ((this.ins[index].script.chunks.length <= 3 && this.ins[index].script.chunks.length > 0) && ((this.ins[index].script.chunks[0].length == 22 && this.ins[index].script.chunks[0][0] == 0) || (this.ins[index].script.chunks[0].length ==
                20 && this.ins[index].script.chunks[1] == 0))) {
          const signed = ((this.witness[index]) && this.witness[index].length == 2) ? 'true' : 'false';
          const sigs = (signed == 'true') ? 1 : 0;
          let value = -1; // no value found
          if ((this.ins[index].script.chunks[2]) && this.ins[index].script.chunks[2].length == 8) {
            value = coinjs.bytesToNum(this.ins[index].script.chunks[2]); // value found encoded in transaction (THIS IS NON STANDARD)
          }
          return {
            'type': 'segwit',
            'signed': signed,
            'signatures': sigs,
            'script': Crypto.util.bytesToHex(this.ins[index].script.chunks[0]),
            'value': value,
          };
        } else if (this.ins[index].script.chunks[0] == 0 && this.ins[index].script.chunks[this.ins[index].script.chunks.length - 1][this.ins[index].script.chunks[this.ins[index].script.chunks.length - 1].length - 1] == 174) { // OP_CHECKMULTISIG
          // multisig script, with signature(s) included
          return {
            'type': 'multisig',
            'signed': 'true',
            'signatures': this.ins[index].script.chunks.length - 2,
            'script': Crypto.util.bytesToHex(this.ins[index].script.chunks[this.ins[index].script.chunks.length - 1]),
          };
        } else if (this.ins[index].script.chunks[0] >= 80 && this.ins[index].script.chunks[this.ins[index].script.chunks.length - 1] == 174) { // OP_CHECKMULTISIG
          // multisig script, without signature!
          return {
            'type': 'multisig',
            'signed': 'false',
            'signatures': 0,
            'script': Crypto.util.bytesToHex(this.ins[index].script.buffer),
          };
        } else if (this.ins[index].script.chunks.length == 0) {
          // empty
          return {
            'type': 'empty',
            'signed': 'false',
            'signatures': 0,
            'script': '',
          };
        } else {
          // something else
          return {
            'type': 'unknown',
            'signed': 'false',
            'signatures': 0,
            'script': Crypto.util.bytesToHex(this.ins[index].script.buffer),
          };
        }
      } else {
        return false;
      }
    };

    /* generate a signature from a transaction hash */
    r.transactionSig = function(index, wif, sigHashType, txhash) {
      console.log('transactionSig.index', index);
      console.log('transactionSig.wif', wif);
      console.log('transactionSig.sigHashType', sigHashType);
      console.log('transactionSig.txhash', txhash);
      function serializeSig(r, s) {
        const rBa = r.toByteArraySigned();
        const sBa = s.toByteArraySigned();

        let sequence = [];
        sequence.push(0x02); // INTEGER
        sequence.push(rBa.length);
        sequence = sequence.concat(rBa);

        sequence.push(0x02); // INTEGER
        sequence.push(sBa.length);
        sequence = sequence.concat(sBa);

        sequence.unshift(sequence.length);
        sequence.unshift(0x30); // SEQUENCE

        return sequence;
      }

      let shType = sigHashType || 1;
      shType |= coinjs.forkid;

      const hash = txhash || Crypto.util.hexToBytes(this.transactionHash(index, shType));

      if (hash) {
        const curve = EllipticCurve.getSECCurveByName('secp256k1');
        const key = coinjs.wif2privkey(wif);
        const priv = BigInteger.fromByteArrayUnsigned(Crypto.util.hexToBytes(key['privkey']));
        const n = curve.getN();
        const e = BigInteger.fromByteArrayUnsigned(hash);
        let badrs = 0;
        do {
          const k = this.deterministicK(wif, hash, badrs);
          const G = curve.getG();
          const Q = G.multiply(k);
          var r = Q.getX().toBigInteger().mod(n);
          var s = k.modInverse(n).multiply(e.add(priv.multiply(r))).mod(n);
          badrs++;
        } while (r.compareTo(BigInteger.ZERO) <= 0 || s.compareTo(BigInteger.ZERO) <= 0);

        // Force lower s values per BIP62
        const halfn = n.shiftRight(1);
        if (s.compareTo(halfn) > 0) {
          s = n.subtract(s);
        };

        const sig = serializeSig(r, s);
        sig.push(parseInt(shType, 10));

        return Crypto.util.bytesToHex(sig);
      } else {
        return false;
      }
    };

    // https://tools.ietf.org/html/rfc6979#section-3.2
    r.deterministicK = function(wif, hash, badrs) {
      // if r or s were invalid when this function was used in signing,
      // we do not want to actually compute r, s here for efficiency, so,
      // we can increment badrs. explained at end of RFC 6979 section 3.2

      // wif is b58check encoded wif privkey.
      // hash is byte array of transaction digest.
      // badrs is used only if the k resulted in bad r or s.

      // some necessary things out of the way for clarity.
      badrs = badrs || 0;
      const key = coinjs.wif2privkey(wif);
      const x = Crypto.util.hexToBytes(key['privkey']);
      const curve = EllipticCurve.getSECCurveByName('secp256k1');
      const N = curve.getN();

      // Step: a
      // hash is a byteArray of the message digest. so h1 == hash in our case

      // Step: b
      let v = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

      // Step: c
      let k = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      // Step: d
      k = Crypto.HMAC(Crypto.SHA256, v.concat([0]).concat(x).concat(hash), k, {
        asBytes: true,
      });

      // Step: e
      v = Crypto.HMAC(Crypto.SHA256, v, k, {
        asBytes: true,
      });

      // Step: f
      k = Crypto.HMAC(Crypto.SHA256, v.concat([1]).concat(x).concat(hash), k, {
        asBytes: true,
      });

      // Step: g
      v = Crypto.HMAC(Crypto.SHA256, v, k, {
        asBytes: true,
      });

      // Step: h1
      let T = [];

      // Step: h2 (since we know tlen = qlen, just copy v to T.)
      v = Crypto.HMAC(Crypto.SHA256, v, k, {
        asBytes: true,
      });
      T = v;

      // Step: h3
      let KBigInt = BigInteger.fromByteArrayUnsigned(T);

      // loop if KBigInt is not in the range of [1, N-1] or if badrs needs incrementing.
      let i = 0;
      while (KBigInt.compareTo(N) >= 0 || KBigInt.compareTo(BigInteger.ZERO) <= 0 || i < badrs) {
        k = Crypto.HMAC(Crypto.SHA256, v.concat([0]), k, {
          asBytes: true,
        });
        v = Crypto.HMAC(Crypto.SHA256, v, k, {
          asBytes: true,
        });
        v = Crypto.HMAC(Crypto.SHA256, v, k, {
          asBytes: true,
        });
        T = v;
        KBigInt = BigInteger.fromByteArrayUnsigned(T);
        i++;
      };

      return KBigInt;
    };

    /* sign a "standard" input */
    r.signinput = function(index, wif, sigHashType) {
      const key = coinjs.wif2pubkey(wif);
      const shType = sigHashType || 1;
      const signature = this.transactionSig(index, wif, shType);
      const s = coinjs.script();
      s.writeBytes(Crypto.util.hexToBytes(signature));
      s.writeBytes(Crypto.util.hexToBytes(key['pubkey']));
      this.ins[index].script = s;
      return true;
    };

    /* signs a time locked / hodl input */
    r.signhodl = function(index, wif, sigHashType) {
      const shType = sigHashType || 1;
      const signature = this.transactionSig(index, wif, shType);
      const redeemScript = this.ins[index].script.buffer;
      const s = coinjs.script();
      s.writeBytes(Crypto.util.hexToBytes(signature));
      s.writeBytes(redeemScript);
      this.ins[index].script = s;
      return true;
    };

    /* sign a multisig input */
    r.signmultisig = function(index, wif, sigHashType) {
      function scriptListPubkey(redeemScript) {
        const r = {};
        for (let i = 1; i < redeemScript.chunks.length - 2; i++) {
          r[i] = Crypto.util.hexToBytes(coinjs.pubkeydecompress(Crypto.util.bytesToHex(redeemScript.chunks[i])));
        }
        return r;
      }

      function scriptListSigs(scriptSig) {
        const r = {};
        let c = 0;
        if (scriptSig.chunks[0] == 0 && scriptSig.chunks[scriptSig.chunks.length - 1][scriptSig.chunks[scriptSig.chunks.length - 1].length - 1] == 174) {
          for (let i = 1; i < scriptSig.chunks.length - 1; i++) {
            if (scriptSig.chunks[i] != 0) {
              c++;
              r[c] = scriptSig.chunks[i];
            }
          }
        }
        return r;
      }

      const redeemScript = (this.ins[index].script.chunks[this.ins[index].script.chunks.length - 1] == 174) ? this.ins[index].script.buffer : this.ins[index].script.chunks[this.ins[index].script.chunks.length - 1];

      const pubkeyList = scriptListPubkey(coinjs.script(redeemScript));
      const sigsList = scriptListSigs(this.ins[index].script);

      const shType = sigHashType || 1;
      let sighash = Crypto.util.hexToBytes(this.transactionHash(index, shType));
      const signature = Crypto.util.hexToBytes(this.transactionSig(index, wif, shType));

      sigsList[coinjs.countObject(sigsList) + 1] = signature;

      const s = coinjs.script();

      s.writeOp(0);

      for (x in pubkeyList) {
        for (y in sigsList) {
          this.ins[index].script.buffer = redeemScript;
          sighash = Crypto.util.hexToBytes(this.transactionHash(index, sigsList[y].slice(-1)[0] * 1));
          if (coinjs.verifySignature(sighash, sigsList[y], pubkeyList[x])) {
            s.writeBytes(sigsList[y]);
          }
        }
      }

      s.writeBytes(redeemScript);
      this.ins[index].script = s;
      return true;
    };

    /* sign segwit input */
    r.signsegwit = function(index, wif, sigHashType) {
      const shType = sigHashType || 1;

      const wif2 = coinjs.wif2pubkey(wif);
      const segwit = coinjs.segwitAddress(wif2['pubkey']);
      const bech32 = coinjs.bech32Address(wif2['pubkey']);

      if ((segwit['redeemscript'] == Crypto.util.bytesToHex(this.ins[index].script.chunks[0])) || (bech32['redeemscript'] == Crypto.util.bytesToHex(this.ins[index].script.chunks[0]))) {
        const txhash = this.transactionHashSegWitV0(index, shType);

        if (txhash.result == 1) {
          const segwitHash = Crypto.util.hexToBytes(txhash.hash);
          const signature = this.transactionSig(index, wif, shType, segwitHash);

          // remove any non standard data we store, i.e. input value
          const script = coinjs.script();
          script.writeBytes(this.ins[index].script.chunks[0]);
          this.ins[index].script = script;

          if (!coinjs.isArray(this.witness)) {
            this.witness = [];
          }

          this.witness.push([signature, wif2['pubkey']]);

          /* attempt to reorder witness data as best as we can.
                 data can't be easily validated at this stage as
                 we dont have access to the inputs value and
                 making a web call will be too slow. */

          const witness_order = [];
          const witness_used = [];
          for (let i = 0; i < this.ins.length; i++) {
            for (let y = 0; y < this.witness.length; y++) {
              if (!witness_used.includes(y)) {
                const sw = coinjs.segwitAddress(this.witness[y][1]);
                const b32 = coinjs.bech32Address(this.witness[y][1]);
                let rs = '';

                if (this.ins[i].script.chunks.length >= 1) {
                  rs = Crypto.util.bytesToHex(this.ins[i].script.chunks[0]);
                } else if (this.ins[i].script.chunks.length == 0) {
                  rs = b32['redeemscript'];
                }

                if ((sw['redeemscript'] == rs) || (b32['redeemscript'] == rs)) {
                  witness_order.push(this.witness[y]);
                  witness_used.push(y);

                  // bech32, empty redeemscript
                  if (b32['redeemscript'] == rs) {
                    this.ins[index].script = coinjs.script();
                  }
                  break;
                }
              }
            }
          }

          this.witness = witness_order;
        }
      }
      return true;
    };

    /* sign inputs */
    r.sign = function(wif, sigHashType) {
      const shType = sigHashType || 1;
      for (let i = 0; i < this.ins.length; i++) {
        const d = this.extractScriptKey(i);

        const w2a = coinjs.wif2address(wif);
        const script = coinjs.script();
        const pubkeyHash = script.pubkeyHash(w2a['address']);

        if (((d['type'] == 'scriptpubkey' && d['script'] == Crypto.util.bytesToHex(pubkeyHash.buffer)) || d['type'] == 'empty') && d['signed'] == 'false') {
          this.signinput(i, wif, shType);
        } else if (d['type'] == 'hodl' && d['signed'] == 'false') {
          this.signhodl(i, wif, shType);
        } else if (d['type'] == 'multisig') {
          this.signmultisig(i, wif, shType);
        } else if (d['type'] == 'segwit') {
          this.signsegwit(i, wif, shType);
        } else {
          // could not sign
        }
      }
      return this.serialize();
    };

    /* serialize a transaction */
    r.serialize = function() {
      let buffer = [];
      buffer = buffer.concat(coinjs.numToBytes(parseInt(this.version), 4));

      if (coinjs.isArray(this.witness)) {
        buffer = buffer.concat([0x00, 0x01]);
      }

      buffer = buffer.concat(coinjs.numToVarInt(this.ins.length));
      for (var i = 0; i < this.ins.length; i++) {
        const txin = this.ins[i];
        buffer = buffer.concat(Crypto.util.hexToBytes(txin.outpoint.hash).reverse());
        buffer = buffer.concat(coinjs.numToBytes(parseInt(txin.outpoint.index), 4));
        var scriptBytes = txin.script.buffer;
        buffer = buffer.concat(coinjs.numToVarInt(scriptBytes.length));
        buffer = buffer.concat(scriptBytes);
        buffer = buffer.concat(coinjs.numToBytes(parseInt(txin.sequence), 4));
      }
      buffer = buffer.concat(coinjs.numToVarInt(this.outs.length));

      for (var i = 0; i < this.outs.length; i++) {
        const txout = this.outs[i];
        buffer = buffer.concat(coinjs.numToBytes(txout.value, 8));
        var scriptBytes = txout.script.buffer;
        buffer = buffer.concat(coinjs.numToVarInt(scriptBytes.length));
        buffer = buffer.concat(scriptBytes);
      }

      if ((coinjs.isArray(this.witness)) && this.witness.length >= 1) {
        for (var i = 0; i < this.witness.length; i++) {
          buffer = buffer.concat(coinjs.numToVarInt(this.witness[i].length));
          for (let x = 0; x < this.witness[i].length; x++) {
            buffer = buffer.concat(coinjs.numToVarInt(Crypto.util.hexToBytes(this.witness[i][x]).length));
            buffer = buffer.concat(Crypto.util.hexToBytes(this.witness[i][x]));
          }
        }
      }

      buffer = buffer.concat(coinjs.numToBytes(parseInt(this.lock_time), 4));
      return Crypto.util.bytesToHex(buffer);
    };

    /* deserialize a transaction */
    r.deserialize = function(buffer) {
      if (typeof buffer == 'string') {
        buffer = Crypto.util.hexToBytes(buffer);
      }

      let pos = 0;
      let witness = false;

      var readAsInt = function(bytes) {
        if (bytes == 0) return 0;
        pos++;
        return buffer[pos - 1] + readAsInt(bytes - 1) * 256;
      };

      const readVarInt = function() {
        pos++;
        if (buffer[pos - 1] < 253) {
          return buffer[pos - 1];
        }
        return readAsInt(buffer[pos - 1] - 251);
      };

      const readBytes = function(bytes) {
        pos += bytes;
        return buffer.slice(pos - bytes, pos);
      };

      const readVarString = function() {
        const size = readVarInt();
        return readBytes(size);
      };

      const obj = new coinjs.transaction();
      obj.version = readAsInt(4);

      if (buffer[pos] == 0x00 && buffer[pos + 1] == 0x01) {
        // segwit transaction
        witness = true;
        obj.witness = [];
        pos += 2;
      }

      const ins = readVarInt();
      for (var i = 0; i < ins; i++) {
        obj.ins.push({
          outpoint: {
            hash: Crypto.util.bytesToHex(readBytes(32).reverse()),
            index: readAsInt(4),
          },
          script: coinjs.script(readVarString()),
          sequence: readAsInt(4),
        });
      }

      const outs = readVarInt();
      for (var i = 0; i < outs; i++) {
        obj.outs.push({
          value: coinjs.bytesToNum(readBytes(8)),
          script: coinjs.script(readVarString()),
        });
      }

      if (witness == true) {
        for (i = 0; i < ins; ++i) {
          const count = readVarInt();
          const vector = [];
          for (let y = 0; y < count; y++) {
            const slice = readVarInt();
            pos += slice;
            if (!coinjs.isArray(obj.witness[i])) {
              obj.witness[i] = [];
            }
            obj.witness[i].push(Crypto.util.bytesToHex(buffer.slice(pos - slice, pos)));
          }
        }
      }

      obj.lock_time = readAsInt(4);
      return obj;
    };

    r.size = function() {
      return ((this.serialize()).length / 2).toFixed(0);
    };

    return r;
  };

  /* start of signature vertification functions */

  coinjs.verifySignature = function(hash, sig, pubkey) {
    function parseSig(sig) {
      let cursor;
      if (sig[0] != 0x30) {
        throw new Error('Signature not a valid DERSequence');
      }

      cursor = 2;
      if (sig[cursor] != 0x02) {
        throw new Error('First element in signature must be a DERInteger');
      } ;

      const rBa = sig.slice(cursor + 2, cursor + 2 + sig[cursor + 1]);

      cursor += 2 + sig[cursor + 1];
      if (sig[cursor] != 0x02) {
        throw new Error('Second element in signature must be a DERInteger');
      }

      const sBa = sig.slice(cursor + 2, cursor + 2 + sig[cursor + 1]);

      cursor += 2 + sig[cursor + 1];

      const r = BigInteger.fromByteArrayUnsigned(rBa);
      const s = BigInteger.fromByteArrayUnsigned(sBa);

      return {
        r: r,
        s: s,
      };
    }

    let r; let s;

    if (coinjs.isArray(sig)) {
      const obj = parseSig(sig);
      r = obj.r;
      s = obj.s;
    } else if ('object' === typeof sig && sig.r && sig.s) {
      r = sig.r;
      s = sig.s;
    } else {
      throw new Error(`Invalid value for signature: '${sig}'`);
    }

    let Q;
    if (coinjs.isArray(pubkey)) {
      const ecparams = EllipticCurve.getSECCurveByName('secp256k1');
      Q = EllipticCurve.PointFp.decodeFrom(ecparams.getCurve(), pubkey);
    } else {
      throw 'Invalid format for pubkey value, must be byte array';
    }
    const e = BigInteger.fromByteArrayUnsigned(hash);

    return coinjs.verifySignatureRaw(e, r, s, Q);
  };

  coinjs.verifySignatureRaw = function(e, r, s, Q) {
    const ecparams = EllipticCurve.getSECCurveByName('secp256k1');
    const n = ecparams.getN();
    const G = ecparams.getG();

    if (r.compareTo(BigInteger.ONE) < 0 || r.compareTo(n) >= 0) {
      return false;
    }

    if (s.compareTo(BigInteger.ONE) < 0 || s.compareTo(n) >= 0) {
      return false;
    }

    const c = s.modInverse(n);

    const u1 = e.multiply(c).mod(n);
    const u2 = r.multiply(c).mod(n);

    const point = G.multiply(u1).add(Q.multiply(u2));

    const v = point.getX().toBigInteger().mod(n);

    return v.equals(r);
  };

  /* start of privates functions */

  /* base58 encode function */
  coinjs.base58encode = function(buffer) {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const base = BigInteger.valueOf(58);

    let bi = BigInteger.fromByteArrayUnsigned(buffer);
    const chars = [];

    while (bi.compareTo(base) >= 0) {
      const mod = bi.mod(base);
      chars.unshift(alphabet[mod.intValue()]);
      bi = bi.subtract(mod).divide(base);
    }

    chars.unshift(alphabet[bi.intValue()]);
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] == 0x00) {
        chars.unshift(alphabet[0]);
      } else break;
    }
    return chars.join('');
  };

  /* base58 decode function */
  coinjs.base58decode = function(buffer) {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const base = BigInteger.valueOf(58);
    const validRegex = /^[1-9A-HJ-NP-Za-km-z]+$/;

    let bi = BigInteger.valueOf(0);
    let leadingZerosNum = 0;
    for (let i = buffer.length - 1; i >= 0; i--) {
      const alphaIndex = alphabet.indexOf(buffer[i]);
      if (alphaIndex < 0) {
        throw 'Invalid character';
      }
      bi = bi.add(BigInteger.valueOf(alphaIndex).multiply(base.pow(buffer.length - 1 - i)));

      if (buffer[i] == '1') leadingZerosNum++;
      else leadingZerosNum = 0;
    }

    const bytes = bi.toByteArrayUnsigned();
    while (leadingZerosNum-- > 0) bytes.unshift(0);
    return bytes;
  };

  /* raw ajax function to avoid needing bigger frame works like jquery, mootools etc */
  coinjs.ajax = function(u, f, m, a) {
    let x = false;
    try {
      x = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
      try {
        x = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {
        x = new XMLHttpRequest();
      }
    }

    if (x == false) {
      return false;
    }

    x.open(m, u, true);
    x.onreadystatechange = function() {
      if ((x.readyState == 4) && f) {
        f(x.responseText);
      }
    };

    if (m == 'POST') {
      x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    x.send(a);
  };

  /* clone an object */
  coinjs.clone = function(obj) {
    if (obj == null || typeof(obj) != 'object') return obj;
    const temp = new obj.constructor();

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        temp[key] = coinjs.clone(obj[key]);
      }
    }
    return temp;
  };

  coinjs.numToBytes = function(num, bytes) {
    if (typeof bytes === 'undefined') bytes = 8;
    if (bytes == 0) {
      return [];
    } else if (num == -1) {
      return Crypto.util.hexToBytes('ffffffffffffffff');
    } else {
      return [num % 256].concat(coinjs.numToBytes(Math.floor(num / 256), bytes - 1));
    }
  };

  coinjs.numToByteArray = function(num) {
    if (num <= 256) {
      return [num];
    } else {
      return [num % 256].concat(coinjs.numToByteArray(Math.floor(num / 256)));
    }
  };

  coinjs.numToVarInt = function(num) {
    if (num < 253) {
      return [num];
    } else if (num < 65536) {
      return [253].concat(coinjs.numToBytes(num, 2));
    } else if (num < 4294967296) {
      return [254].concat(coinjs.numToBytes(num, 4));
    } else {
      return [255].concat(coinjs.numToBytes(num, 8));
    }
  };

  coinjs.bytesToNum = function(bytes) {
    if (bytes.length == 0) return 0;
    else return bytes[0] + 256 * coinjs.bytesToNum(bytes.slice(1));
  };

  coinjs.uint = function(f, size) {
    if (f.length < size) {
      throw new Error('not enough data');
    }
    let n = 0;
    for (let i = 0; i < size; i++) {
      n *= 256;
      n += f[i];
    }
    return n;
  };

  coinjs.isArray = function(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  };

  coinjs.countObject = function(obj) {
    let count = 0;
    let i;
    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        count++;
      }
    }
    return count;
  };

  coinjs.random = function(length) {
    let r = '';
    const l = length || 25;
    const chars = '!$%^&*()_+{}:@~?><|\./;\'#][=-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    for (x = 0; x < l; x++) {
      r += chars.charAt(Math.floor(Math.random() * 62));
    }
    return r;
  };
}

coinjsInit();

// console.log('window.coinjs', Object.keys(window.coinjs));
// console.log('window.coinjs.transaction', Object.keys(window.coinjs.transaction()));

const sign = (wif, message) => {
  if (wif === undefined) {
    throw new Error('wif is required.');
  }
  if (message === undefined) {
    throw new Error('message is required.');
  }
  const signature = window.coinjs.transaction().transactionSig(undefined, wif, undefined, message);
  return signature;
};

const verifySignature = (hash, sig, pubkey) => {
  if (hash === undefined) {
    throw new Error('hash is required.');
  }
  if (sig === undefined) {
    throw new Error('sig is required.');
  }
  if (pubkey === undefined) {
    throw new Error('pubkey is required.');
  }
  console.log('verifySignature.hash', hash);
  console.log('verifySignature.sig', sig);
  console.log('verifySignature.pubkey', pubkey);
  const hashBa = Crypto.util.hexToBytes(hash);
  const sigBa = Crypto.util.hexToBytes(sig);
  const pubkeyBa = Crypto.util.hexToBytes(pubkey);
  return window.coinjs.verifySignature(hashBa, sigBa, pubkeyBa);
};

exports.sign = sign;
exports.verifySignature = verifySignature;
exports.getKeys=getKeys;