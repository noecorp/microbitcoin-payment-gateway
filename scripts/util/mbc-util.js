
// Config
const document = {};
document.cookie = '';

const walletTimer = false;
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

// Explorer links
const blockExplorer = {
  'address': function(address) {
    return 'https://microbitcoinorg.github.io/explorer/#/address/' + address + '/' + getApi()['ticker'];
  },
  'tx': function(tx) {
    return 'https://microbitcoinorg.github.io/explorer/#/tx/' + tx + '/' + getApi()['ticker'];
  },
};

const globalData = {
  'keys': {},
  'address': '',
  'segwit': true,
  'balance': 0,
  'rfee': 0,
  'tx': {
    'amount': 0,
    'outputs': [],
    'fee': 0,
  },
  'resetTx': function() {
    this.tx = {
      'amount': 0,
      'outputs': [],
      'fee': 0,
    };
  },
  'clear': function() {
    this.keys = {};
    this.address = '';
    this.balance = 0;
    this.resetTx();
  },
};

// Messages
const messages = {
  'error': {
    'not-enough-funds': 'You don\'t have enough funds for this transaction!',
    'not-valid-address': 'You must specify valid address!',
    'not-valid-amount': 'You must specify valid amount!',
    'not-valid-fee': 'You must specify valid fee!',
    'bad-priv-key': 'Bad private key!',
    'not-enough-utxo': 'Not enough utxo :(',
    'broadcast-failed': 'Transaction broadcast failed :(',
    'pass-not-match': 'Your passwords do not match!',
    'pass-too-short': 'Your password must be at least 10 chars long!',
    'bad-email': 'Your email address doesn\'t appear to be valid!',
    'toSmallFee': function(fee, ticker) {
      return 'You should specify fee not less than ' + fee + ' ' + ticker + '!';
    },
  },
  'tx': {
    'loading-utxo': 'Loading UTXOs...',
    'generating': 'Generating transaction...',
    'success': 'Transaction successfully broadcasted: ',
  },
  'title': {
    'sure': 'Are you sure?',
    'processing': 'Processing...',
    'success': 'Success',
    'failed': 'Failed',
  },
};

// Get current network config
function getApi() {
  let network = readCookie('network');
  if (network == null || networksConfigs[network] == undefined) {
    setCookie('network', Object.keys(networksConfigs)[0], 60);
    network = readCookie('network');
  }

  return networksConfigs[network];
}

// Switch network
function swithcApi(network, page = '') {
  network = network.toUpperCase();
  if (networksConfigs[network] != undefined & networksConfigs[network] != getApi()) {
    setCookie('network', network, 60);
    closeWallet();
    displayNetworks();
  }
  switchPage(page);
}

// Display networks list
function displayNetworks() {
  coinjsInit();
  network = getApi();
  $('#network-versions').text(network['name']);
  $('#network-list .dropdown-menu').empty();

  for (const key in networksConfigs) {
    $('#network-list .dropdown-menu').append(`<a class="dropdown-item ${networksConfigs[key]['name'] == network['name'] ? 'active' : ''}" href="#/network/${key}">${networksConfigs[key]['name']}</a>`);
  }
}

// Set cookie
function setCookie(name, value, days) {
  let expires;

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toGMTString();
  } else {
    expires = '';
  }
  document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + expires + '; path=/';
}

// Read cookie
function readCookie(name) {
  const nameEQ = encodeURIComponent(name) + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

// SPA router function
function routePage() {
  const urlParams = readParams();
  if (window.location.hash == '') {
    window.location.hash = '#/';
  }

  if (urlParams[0] == '#') {
    const pageName = urlParams[1] != '' ? urlParams[1] : 'homepage';
    const templateName = '#' + pageName;

    $('.router-link').removeClass('active');
    $('.router-link[data-route=' + pageName + ']').addClass('active');
    if ($('.router-page:visible').attr('id') != urlParams[1]) {
      $('div.router-page').hide();
      if ($(templateName).length) {
        $(templateName).show();
      }
    }

    switch (pageName) {
      // Home page ¯\_(ツ)_/¯
      case 'homepage':
        setHomeTitle();
        break;

      case 'create':
        setTitle('Create wallet');
        break;

      case 'broadcast':
        setTitle('Broadcast transaction');
        break;

        // Swith network
      case 'network':
        network = urlParams[2];
        if (network != undefined) {
          swithcApi(network);
        }

        break;

      default:
        switchPage();

        break;
    }
  }
}

// Switch router page
function switchPage(url = '', params = []) {
  params = params.length > 0 ? '/' + params.join('/') : '';
  window.location.hash = '#' + '/' + url + params;
}

// Read URL params
function readParams() {
  return window.location.hash.split('/');
}

// Set window title
function setTitle(title) {
  document.title = title + ' | MBC Wallet';
}

// Broadcast tx
function txBroadcast(rawtx) {
  return makeRequest({
    method: 'blockchain.transaction.send',
    params: [rawtx],
  }, 'POST');
}

// Estimate fee
function estimateFee() {
  return makeRequest({
    method: 'blockchain.estimatesmartfee',
    params: ['30'],
  }, 'POST');
}

// Make request :D
function makeRequest(data, method = 'GET', error_check = true) {
  return Promise.resolve($.ajax({
    'method': method,
    'url': getApi()['api'],
    'data': data,
  })).then(function(data) {
    if (error_check) {
      result = {
        'error': 'error' in data,
        'data': [],
      };

      if (!result['error']) {
        result['data'] = data.result;
      }
    } else {
      result = data;
    }

    return result;
  });
}

// Convert satoshis to readable amount
function amountFormat(amount, invert = false) {
  const decimals = getApi()['decimals'];
  if (!invert) {
    return parseFloat((amount / Math.pow(10, decimals)).toFixed(decimals));
  } else {
    return parseInt(amount * Math.pow(10, decimals));
  }
}

// Show big error message at the top of the page :D
function showMessage(message) {
  $('#error-message').html(message);
  $('#error-message').removeClass('d-none');
  setTimeout(function() {
    $('#error-message').addClass('d-none');
  }, 3400);
}

function showQrAddress(text) {
  $('#qr-code-addres').empty();
  $('#qr-code-addres').qrcode(text);
}

exports.getApi = getApi;
