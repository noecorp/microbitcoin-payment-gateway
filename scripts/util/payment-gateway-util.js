const coinjsUtil = require('./coinjs-util.js');

const crypto = require('crypto');

const fakeDb = new Map();

const init = () => {
  deleteDB();
};

const deactivate = () => {
  deleteDB();
};

const getRandomHex32 = () => {
  return crypto.randomBytes(32).toString('hex');
};

// const fromHexString = (hexString) => {
// return new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
// };

// const toHexString = (bytes) => {
//   return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
// };

const register = (request) => {
  if (request === undefined) {
    throw new Error('request is required.');
  }
  if (request.action === undefined) {
    throw new Error('request.action is required.');
  }
  if (request.action !== 'register') {
    throw new Error('request.action is required to be \'register\'.');
  }
  if (request.account === undefined) {
    throw new Error('request.account is required.');
  }

  const account = request.account;
  const response = {};
  if (account.length == 0) {
    response.valid = 'false';
    response.message = 'failure, account must have more than zero characters';
  } else {
    const accountSecret = getRandomHex32();
    const accountRecord = {};
    accountRecord.account = account;
    accountRecord.accountSecret = accountSecret;
    fakeDb.accounts[account] = accountRecord;

    response.valid = 'true';
    response.message = 'success';
    response['account-secret'] = accountSecret;
  }
  return response;
};

const verify = (request) => {
  if (request === undefined) {
    throw new Error('request is required.');
  }
  if (request.action === undefined) {
    throw new Error('request.action is required.');
  }
  if (request.action !== 'verify') {
    throw new Error('request.action is required to be \'verify\'.');
  }
  if (request.account === undefined) {
    throw new Error('request.account is required.');
  }
  if (request['account-secret'] === undefined) {
    throw new Error('request[\'account-secret\'] is required.');
  }
  if (request.signature === undefined) {
    throw new Error('request.signature is required.');
  }

  const response = {};

  const hash = request['account-secret'];
  const publicKey = request.account;
  const signature = request.signature;
  const valid = coinjsUtil.verifySignature(hash, signature, publicKey);

  response.valid = valid;
  if (valid) {
    response.message = 'success';
  } else {
    response.message = 'signature verify failed';
  }

  return response;
};

const requestPayment = (request) => {
  if (request === undefined) {
    throw new Error('request is required.');
  }
  if (request.action === undefined) {
    throw new Error('request.action is required.');
  }
  if (request.action !== 'request-payment') {
    throw new Error('request.action is required to be \'request-payment\'.');
  }
  const fromAccount = request['from-account'];
  if (fromAccount === undefined) {
    throw new Error('request[\'from-account\'] is required.');
  }
  const toAccount = request['to-account'];
  if (toAccount === undefined) {
    throw new Error('request[\'to-account\'] is required.');
  }
  const toAccountNonce = request['to-account-nonce'];
  if (toAccountNonce === undefined) {
    throw new Error('request[\'to-account-nonce\'] is required.');
  }
  const amount = request['amount'];
  if (amount === undefined) {
    throw new Error('request[\'amount\'] is required.');
  }
  const timeout = request['timeout'];
  if (timeout === undefined) {
    throw new Error('request[\'timeout\'] is required.');
  }
  const toAccountSecret = request['to-account-secret'];
  if (toAccountSecret === undefined) {
    throw new Error('request[\'to-account-secret\'] is required.');
  }

  if (fakeDb.accounts[toAccount] == undefined) {
    const response = {};
    response.valid = false;
    response.message = 'to-account not registered.';
    return response;
  }
  if (fakeDb.accounts[fromAccount] == undefined) {
    const response = {};
    response.valid = 'false';
    response.message = 'from-account not registered.';
    return response;
  }

  const fromAccountRecord = fakeDb.accounts[fromAccount];
  const toAccountRecord = fakeDb.accounts[toAccount];

  if (toAccountRecord.accountSecret !== toAccountSecret) {
    const response = {};
    response.valid = 'false';
    response.message = `incorrect to-account-secret '${toAccountSecret}'`+
        ` for to-account '${toAccount}'`;
    return response;
  }

  const paymentRecord = {};
  paymentRecord['from-account'] = fromAccount;
  paymentRecord['to-account'] = toAccount;
  paymentRecord['to-account-nonce'] = toAccountNonce;
  paymentRecord['amount'] = amount;
  paymentRecord['timeout'] = timeout;

  fakeDb.payments[toAccountNonce] = paymentRecord;

  const response = {};

  response.valid = 'true';
  response.message = 'success';
  response['to-account-nonce'] = toAccountNonce;

  return response;
};

const listPaymentRequests = (request) => {
  const response = {};
  return response;
};

const paymentCancel = (request) => {
  const response = {};
  return response;
};

const paymentResponse = (request) => {
  const response = {};
  return response;
};

const listPaymentResponse = (request) => {
  const response = {};
  return response;
};

const deleteDB = () => {
  fakeDb.clear();
  fakeDb.accounts = new Map();
  fakeDb.payments = new Map();
};

exports.getRandomHex32 = getRandomHex32;
exports.init = init;
exports.deactivate = deactivate;
exports.register = register;
exports.verify = verify;
exports.requestPayment = requestPayment;
exports.listPaymentRequests = listPaymentRequests;
exports.paymentResponse = paymentResponse;
exports.paymentCancel = paymentCancel;
exports.listPaymentResponse = listPaymentResponse;
