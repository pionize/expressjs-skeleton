'use strict';

var DEFAULT_COUNTRY_CODE = '+62';

function PhoneNumberSanitizer(phone) {
  if (!phone) return null;
  //phone = String(phone).replace(/^[0-9\+\(\)]/, '');
  if (phone.substr(0, 1) != '+') {
    phone = DEFAULT_COUNTRY_CODE + phone.substr(1);
  }
  return phone;
}

module.exports = PhoneNumberSanitizer;
