const coinjsUtil = require('./coinjs-util.js');

const fakeDb = {};
fakeDb.accounts = {};

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
    response.accountSecret = accountSecret;
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
  if (request.action !== 'register') {
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
  const response = {};
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

exports.register = register;
exports.verify = verify;
exports.requestPayment = requestPayment;
exports.listPaymentRequests = listPaymentRequests;
exports.paymentResponse = paymentResponse;
exports.paymentCancel = paymentCancel;
exports.listPaymentResponse = listPaymentResponse;
