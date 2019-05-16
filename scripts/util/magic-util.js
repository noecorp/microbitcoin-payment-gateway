// Wallet functions
function walletBalance() {
  $('.wallet-balance').text('Loading...');
  coinjs.addressBalance($('#wallet-address').html(), function(data) {
    data = JSON.parse(data);
    if (data.error == undefined) {
      globalData.balance = data.result.confirmed;
      $('.wallet-balance').text(amountFormat(globalData.balance) + ' ' + getApi()['ticker']);
    } else {
      showMessage('We couldn\'t load wallet balance');
      $('.wallet-balance').text('0.00 ' + getApi()['ticker']);
    }
  });
}

function setHomeTitle() {
  if (globalData.keys.address) {
    setTitle('Address ' + globalData.keys.address);
  } else {
    setTitle('Open Wallet');
  }
}

function checkBalanceLoop() {
  clearTimeout(walletTimer);
  walletTimer = setTimeout(function() {
    if ($('.wallet-balance').text() != 'Loading...') {
      walletBalance();
    }
    checkBalanceLoop();
  }, 45000);
}

function openWallet(keys, segwit = true) {
  globalData.address = keys.address;
  const wif = keys.wif;
  const pubkey = keys.pubkey;
  const sw = coinjs.segwitAddress(pubkey);
  globalData.segwit = segwit;

  if (segwit) {
    globalData.address = sw.address;
    $('#wallet-keys-script').removeClass('d-none');
    $('#address-type-btn').text('SegWit');
  } else {
    $('#wallet-keys-script').addClass('d-none');
    $('#address-type-btn').text('Legacy');
  }

  $('#wallet-keys-pubkey input').val(pubkey);
  $('#wallet-keys-privkey input').val(wif);
  $('#wallet-keys-script input').val(sw.redeemscript);

  $('#wallet-address').html(globalData.address);
  $('#open-block').addClass('d-none');
  $('#wallet-block').removeClass('d-none');
  $('#history-link').attr('href', '' + blockExplorer.address(globalData.address));
  $('#send-fee').attr('placeholder', 'Fee (recommended ' + globalData.rfee + ' ' + getApi()['ticker'] + ')');
  showQrAddress('microbitcoin:' + globalData.address);

  walletBalance();
  checkBalanceLoop();
  setHomeTitle();
}

function showConfirmation(amount) {
  $('#confirm-amount').text(amount + ' ' + getApi()['ticker']);
  $('#send-modal').modal('toggle');
  $('#send-title').text(messages.title['sure']);
  $('#send-cancel').removeClass('disabled');
  $('#send-confirm').removeClass('disabled');
  $('#confirm-screen').removeClass('d-none');
  $('#status-screen').addClass('d-none');
  $('#status-screen span').html('');

  $.each($('#send-outputs .send-outputs-item'), function(key, item) {
    globalData.tx.outputs.push({
      'address': $('[name=\'send-address\']', item).val().trim(),
      'amount': $('[name=\'send-ammount\']', item).val() * 1,
    });
  });

  globalData.tx.fee = amountFormat(($('#send-fee').val() != '') ? $('#send-fee').val() : globalData.rfee, true);
  globalData.tx.amount = amountFormat(amount, true);
}

function sendTx() {
  const tx = coinjs.transaction();
  const txFee = globalData.tx.fee;
  let script = false;
  const sequence = 0xffffffff - 2; // RBF
  const decimals = getApi()['decimals'];
  const outputs = globalData.tx.outputs;
  const amount = globalData.tx.amount;
  const address = globalData.address;

  $('#send-cancel').addClass('disabled');
  $('#send-confirm').addClass('disabled');
  $('#confirm-screen').addClass('d-none');
  $('#status-screen').removeClass('d-none');
  $('#send-title').text(messages.title['processing']);

  $('#status-screen span').html(messages.tx['generating']);
  if (globalData.segwit) {
    script = coinjs.segwitAddress(globalData.keys.pubkey)['redeemscript'];
  }
  for (let i = 0, size = outputs.length; i < size; i++) {
    tx.addoutput(outputs[i].address, outputs[i].amount);
  }

  tx.addUnspent(address, amount, function(data) {
    $('#status-screen span').html(messages.tx['loading-utxo']);
    const value = data.value;
    if (value >= amount) {
      const change = value - amount;
      if ((change * 1) > 0) {
        tx.addoutput(address, amountFormat(change));
      }

      // clone the transaction with out using coinjs.clone() function as it gives us trouble
      const txClone = coinjs.transaction();
      const txUnspent = txClone.deserialize(tx.serialize());

      // then sign
      const signed = txUnspent.sign(globalData.keys.wif);

      txClone.broadcast(signed).then(function(data) {
        if (!data.error) {
          $('#status-screen span').html(`
                <a href="` + blockExplorer.tx(data.data.txhash) + `" target="_blank">` + data.data.txhash + `</a>
              `);
          $('#send-title').text(messages.title['success']);
        } else {
          $('#status-screen span').html(messages.error['broadcast-failed']);
          $('#send-title').text(messages.title['failed']);
        }
        resetTxForm();
      });
    } else {
      showMessage(messages.error['not-enough-funds']);
    }
  }, script, script, sequence);
}

// Close wallet
function closeWallet() {
  $('#open-block').removeClass('d-none');
  $('#wallet-block').addClass('d-none');
  globalData.clear();
  setHomeTitle();
}

$('#footer-create').click(function() {
  const coin = coinjs.newKeys(null);
  $('#create-keys-address input').val(coin.address);
  $('#create-keys-pubkey input').val(coin.pubkey);
  $('#create-keys-privkey input').val(coin.wif);
});

$('#footer-broadcast').click(function() {
  const rawtx = $('#transaction-broadcast-raw');
  txBroadcast(rawtx.val()).then(function(data) {
    if (!data.error) {
      showMessage(`
            ${messages.tx['success']}<a href="` + blockExplorer.tx(data.data.txhash) + `" target="_blank">` + data.data.txhash + `</a>
          `);
    } else {
      showMessage(messages.error['broadcast-failed']);
    }
  });
  rawtx.val('');
});

function resetTxForm() {
  $('.send-additional-output').remove();
  $('#wallet-send input').val('');
  globalData.resetTx();
}

// All starts here
$(document).ready(function() {
  displayNetworks();
  routePage();

  $('.tab-link').click(function(e) {
    const tabFamily = $(this).data('tab-family');
    const tabName = $(this).data('tab-name');

    $('#' + tabFamily + ' .tab-item').addClass('d-none');
    $('#' + tabFamily + ' .card-header .card-header-tabs .nav-link').removeClass('active');

    $('#' + tabFamily + ' [data-tab=' + tabName + ']').removeClass('d-none');
    $(this).addClass('active');

    e.preventDefault();
  });

  $(window).on('hashchange', routePage);
  if (window.location.hash) {
    $(window).trigger('hashchange');
  }

  $('#send-tx').click(function() {
    let error = false;
    const txFee = ($('#send-fee').val() != '') ? $('#send-fee').val() : globalData.rfee;
    let total = 0;

    if ((isNaN(txFee)) || txFee <= 0) {
      showMessage(messages.error['not-valid-fee']);
      error = true;
    } else {
      if (txFee < getApi()['fee']) {
        showMessage(messages.error.toSmallFee(getApi()['fee'], getApi()['ticker']));
        error = true;
      }
    }


    $.each($('#send-outputs .send-outputs-item'), function(key, item) {
      const address = $('[name=\'send-address\']', item).val().trim();
      const amount = $('[name=\'send-ammount\']', item).val();

      if ((isNaN(amount)) || amount <= 0) {
        showMessage(messages.error['not-valid-amount']);
        error = true;
      }

      if (coinjs.addressDecode(address) == false) {
        showMessage(messages.error['not-valid-address']);
        error = true;
      }

      total += amount * 1;
    });

    total += txFee * 1;
    total = parseFloat(total.toFixed(getApi()['decimals']));

    if (!error) {
      if (total <= amountFormat(globalData.balance)) {
        showConfirmation(total);
      } else {
        showMessage(messages.error['not-enough-funds']);
      }
    }
  });

  $('#open-key-form').submit(function(e) {
    const wif = $('#passphrase').val().trim();
    const wifLength = wif.length;
    if (coinjs.wif2privkey(wif).privkey != '') {
      if (wifLength == 51 || wifLength == 52) {
        globalData.keys = coinjs.getKeys(wif);
        $('#passphrase').val('');
        openWallet(globalData.keys, false);
      } else {
        showMessage(messages.error['bad-priv-key']);
      }
    } else {
      showMessage(messages.error['bad-priv-key']);
    }

    e.preventDefault();
  });

  $('#open-regular-form').submit(function(e) {
    const email = $('#open-email').val().toLowerCase();
    var pass = $('#open-password').val();
    const passConfirm = $('#open-password-confirm').val();
    if (email.match(/[\s\w\d]+@[\s\w\d]+/g)) {
      if (pass.length >= 10) {
        if (pass == passConfirm) {
          var pass = pass;
          let s = email;
          s += '|' + pass + '|';
          s += s.length + '|!@' + ((pass.length * 7) + email.length) * 7;
          const regchars = (pass.match(/[a-z]+/g)) ? pass.match(/[a-z]+/g).length : 1;
          const regupchars = (pass.match(/[A-Z]+/g)) ? pass.match(/[A-Z]+/g).length : 1;
          const regnums = (pass.match(/[0-9]+/g)) ? pass.match(/[0-9]+/g).length : 1;
          s += ((regnums + regchars) + regupchars) * pass.length + '3571';
          s += (s + '' + s);

          for (i = 0; i <= 50; i++) {
            s = Crypto.SHA256(s);
          }

          $('#open-email').val('');
          $('#open-password').val('');
          $('#open-password-confirm').val('');

          globalData.keys = coinjs.newKeys(s);
          openWallet(globalData.keys);
        } else {
          showMessage(messages.error['pass-not-match']);
        }
      } else {
        showMessage(messages.error['pass-too-short']);
      }
    } else {
      showMessage(messages.error['bad-email']);
    }

    e.preventDefault();
  });

  $('.wallet-balance').click(function(e) {
    walletBalance();
    e.preventDefault();
  });

  $('#send-confirm').click(function(e) {
    sendTx();
    e.preventDefault();
  });

  $('.toggle-priv-key').click(function() {
    if ($(this).text() == 'Show') {
      $(this).parent().parent().find('.keys-privkey').attr('type', 'text');
      $(this).text('Hide');
    } else {
      $(this).parent().parent().find('.keys-privkey').attr('type', 'password');
      $(this).text('Show');
    }
  });

  $('#add-output').click(function(e) {
    $('#send-outputs').append(
        `
          <div class="send-additional-output send-outputs-item input-group mb-2">
            <input name="send-address" class="form-control" placeholder="Enter address" type="text">
            <input name="send-ammount" class="form-control" placeholder="Amount" type="text">
            <div class="input-group-append">
              <button class="btn btn-danger remove-additional-output" type="submit">
                <span class="entypo minus"></span>
              </button>
            </div>
          </div>
        `
    );
    $('.remove-additional-output').click(function(e) {
      $(this).closest('.send-additional-output').remove();
      e.preventDefault();
    });
    e.preventDefault();
  });

  $('#send-reset').click(function(e) {
    resetTxForm();
    e.preventDefault();
  });

  $('#footer-close').click(function(e) {
    closeWallet();
    e.preventDefault();
  });

  $('.address-type-switch').click(function(e) {
    openWallet(globalData.keys, $(this).data('address-type') == 'segwit');
    e.preventDefault();
  });

  estimateFee().then(function(data) {
    if (data.error == false) {
      globalData.rfee = amountFormat(data.data.feerate);
    } else {
      globalData.rfee = getApi()['fee'];
    }
  });

  /* capture mouse movement to add entropy */
  const IE = document.all ? true : false; // Boolean, is browser IE?
  if (!IE) document.captureEvents(Event.MOUSEMOVE);
  document.onmousemove = getMouseXY;

  function getMouseXY(e) {
    let tempX = 0;
    let tempY = 0;
    if (IE) { // If browser is IE
      tempX = event.clientX + document.body.scrollLeft;
      tempY = event.clientY + document.body.scrollTop;
    } else {
      tempX = e.pageX;
      tempY = e.pageY;
    };

    if (tempX < 0) {
      tempX = 0;
    };
    if (tempY < 0) {
      tempY = 0;
    };
    const xEnt = Crypto.util.bytesToHex([tempX]).slice(-2);
    const yEnt = Crypto.util.bytesToHex([tempY]).slice(-2);
    const addEnt = xEnt.concat(yEnt);

    if ($('#entropybucket').html().indexOf(xEnt) == -1 && $('#entropybucket').html().indexOf(yEnt) == -1) {
      $('#entropybucket').html(addEnt + $('#entropybucket').html());
    };

    if ($('#entropybucket').html().length > 128) {
      $('#entropybucket').html($('#entropybucket').html().slice(0, 128));
    };

    return true;
  }
});
