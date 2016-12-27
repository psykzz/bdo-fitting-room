;(function (window, document, $) {
    'use strict';

    var bdo = window.bdo || {};

    var emptyItem = `<option selected="selected" value="none">-- None --</option>`;

    bdo.equippedItems = {
        armor: {
            head: { name: null, img: null, ap: 0, dp: 0 },
            chest:  { name: null, img: null, ap: 0, dp: 0 },
            gloves:  { name: null, img: null, ap: 0, dp: 0 },
            neck:  { name: null, img: null, ap: 0, dp: 0 },
            waist:  { name: null, img: null, ap: 0, dp: 0 },
            shoes:  { name: null, img: null, ap: 0, dp: 0 },
        },
        weapons: {
            offhand:  { name: null, img: null, ap: 0, dp: 0 },
            awaken:  { name: null, img: null, ap: 0, dp: 0 },
            weapon:  { name: null, img: null, ap: 0, dp: 0 },
        },
        accessories: {
            ring1:  { name: null, img: null, ap: 0, dp: 0 },
            ring2:  { name: null, img: null, ap: 0, dp: 0 },
            earring1:  { name: null, img: null, ap: 0, dp: 0 },
            earring2:  { name: null, img: null, ap: 0, dp: 0 },
        }
    };

    /* internal functions */
    function calculateAP() {
        var armor_ap = Object.values(bdo.equippedItems.armor).reduce(function(a,b) {
            return a + b.ap;
        }, 0);
        var accessories_ap = Object.values(bdo.equippedItems.accessories).reduce(function(a,b) {
            return a + b.ap;
        }, 0);
        var weapon_ap = Object.values(bdo.equippedItems.weapons).reduce(function(a,b) {
            return a + b.dp;
        }, 0);
        return armor_ap + accessories_ap + weapon_ap;
    }

    function calculateAAP() {
        var armor_ap = Object.values(bdo.equippedItems.armor).reduce(function(a,b) {
            return a + b.ap;
        }, 0);
        var accessories_ap = Object.values(bdo.equippedItems.accessories).reduce(function(a,b) {
            return a + b.ap;
        }, 0);
        var weapon_ap = bdo.equippedItems.weapons.awaken.ap + bdo.equippedItems.weapons.offhand.ap;
        return armor_ap + accessories_ap + weapon_ap;
    }

    function calculateDP() {
        var armor_dp = Object.values(bdo.equippedItems.armor).reduce(function(a,b) {
            return a + b.dp;
        }, 0);
        var accessories_dp = Object.values(bdo.equippedItems.accessories).reduce(function(a,b) {
            return a + b.dp;
        }, 0);
        var weapon_dp = Object.values(bdo.equippedItems.weapons).reduce(function(a,b) {
            return a + b.dp;
        }, 0);
        return armor_dp + accessories_dp + weapon_dp;
    }

    /* public functions */
    bdo.loadItems = function loadItems() {
        // return some debug items
        console.log('hello?');
        $.when(
            $.getJSON('data/head.json'),
            $.getJSON('data/chest.json'),
            $.getJSON('data/gloves.json'),
            $.getJSON('data/shoes.json'),
            $.getJSON('data/rings.json'),
            $.getJSON('data/earrings.json'),
            $.getJSON('data/neck.json'),
            $.getJSON('data/waist.json'),
            $.getJSON('data/weapons.json'),
            $.getJSON('data/offhand.json'),
            $.getJSON('data/awakened.json')
        ).done(function(_head, _chest, _gloves, _shoes, _rings, _earrings,
            _neck, _waist, _weapon, _offhand, _awaken) {

            // if any of the json files are not valid this won't run and we wont get any warnings

            bdo.all_items = {
                head: _head[0],
                chest: _chest[0],
                gloves: _gloves[0],
                shoes: _shoes[0],
                ring1: _rings[0],
                ring2: _rings[0],
                earring1: _earrings[0],
                earring2: _earrings[0],
                neck: _neck[0],
                waist: _waist[0],
                weapon: _weapon[0],
                offhand: _offhand[0],
                awaken: _awaken[0],
            }
            bdo.updateItems(bdo.all_items);

        });
    };

    bdo.updateItems = function updateItems(items) {

        var slots = ['head', 'chest', 'ring1', 'ring2', 'waist', 'neck', 'offhand', 'awaken', 'weapon', 'gloves', 'earring1', 'earring2'];
        $.each(slots, function(i, slot) {
            $.each(Object.keys(items[slot]), function (i, item) {
                $(`select[name=${slot}]`).append($('<option>', {
                    value: item,
                    text : items[slot][item].name
                }));
            });
        });

    }

    bdo.updateStats = function updateStats() {
        var $ap = document.querySelector('.stat-ap span');
        var $aap = document.querySelector('.stat-awaken-ap span');
        var $dp = document.querySelector('.stat-dp span');

        $ap.textContent = calculateAP();
        $aap.textContent = calculateAAP();
        $dp.textContent = calculateDP();
    }

    bdo.equipItem = function equipItem(slot, name, level) {
        if(slot in bdo.equippedItems.armor) {
            bdo.equippedItems.armor[slot] = bdo.all_items[slot][name][`lvl${level}`];
        } else if (slot in bdo.equippedItems.weapons) {
            bdo.equippedItems.weapons[slot] = bdo.all_items[slot][name][`lvl${level}`];
        } else if (slot in bdo.equippedItems.accessories) {
            bdo.equippedItems.accessories[slot] = bdo.all_items[slot][name][`lvl${level}`];
        }
        console.log('Equipped item');
        bdo.updateStats();
    }

    bdo.loadFitting = function loadFitting() {
        var fittingHash = window.location.hash;
        console.log(`Fitting Hash: ${fittingHash}`);
    }

    /* Add event handlers */
    // selecting a slot
    $('.character-items .slot').on('click', function() {
        var itemType = $(this).attr("class").split(' ')[1];
        itemType = itemType.substring(5); // remove the "slot-" part
        $('.character-equipment').children().hide();
        $(`.character-equipment .${itemType}`).show();
    });

    // updating an item
    $('.character-equipment select').on('change', function() {
        var slot = $(this).parent().attr('class');
        var itemName = $(`.character-equipment select[name="${slot}"]`).find(":selected").val();
        var itemLevel = $(`.character-equipment select[name="${slot}-level"]`).find(":selected").val();
        console.log(slot, itemName, itemLevel);
        try {
            bdo.equipItem(slot, itemName, itemLevel);
        } catch(err) {
            setTimeout(function() { alert('Invalid selection, data might be missing'); }, 1);
        }
    });

    /* start init */
    bdo.loadItems();
    bdo.loadFitting();
    bdo.updateStats();
    window.bdo = bdo;

})(window, document, jQuery)