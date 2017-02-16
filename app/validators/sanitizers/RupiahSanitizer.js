/**
 * Created by mac on 10/13/16.
 */
'use strict';

function RupiahSanitizer(nominal) {
    const clear = (nominalRp) => {
        if (!nominalRp) return null;
        return parseInt(nominalRp.replace(/,.*|\D/g, ''));
    };

    const make = (nominal) => {
        if (!nominal) return null;
        var rev = parseInt(nominal, 10).toString().split('').reverse().join('');
        var rev2 = '';
        for (var i = 0; i < rev.length; i++) {
            rev2 += rev[i];
            if ((i + 1) % 3 === 0 && i !== (rev.length - 1)) {
                rev2 += '.';
            }
        }
        return 'Rp. ' + rev2.split('').reverse().join('') + ',00';
    };

    return {
        clear: clear,
        make: make
    };

}

module.exports = RupiahSanitizer;
