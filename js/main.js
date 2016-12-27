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
            main:  { name: null, img: null, ap: 0, dp: 0 },
        },
        accessories: {
            ring1:  { name: null, img: null, ap: 0, dp: 0 },
            ring2:  { name: null, img: null, ap: 0, dp: 0 },
            earring1:  { name: null, img: null, ap: 0, dp: 0 },
            earring2:  { name: null, img: null, ap: 0, dp: 0 },
        }
    };

    /* internal functions */
    String.prototype.capitalize = String.prototype.capitalize || function capitalize() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

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
        return {
            head: {grunil: { lvl1: {name: null, img: null, ap:0, dp:10}}},
            chest: {grunil: { lvl1: {name: 'grunil', img: null, ap:0, dp:10}}},
            gloves: {grunil: { lvl1: {name: null, img: null, ap:0, dp:10}}},
            shoes: {grunil: { lvl1: {name: null, img: null, ap:0, dp:10}}},
            ring1: {grunil: { lvl1: {name: null, img: null, ap:0, dp:10}}},
            ring2: {grunil: { lvl1: {name: null, img: null, ap:0, dp:10}}},
            earring1: {grunil: { lvl1: {name: null, img: null, ap:0, dp:10}}},
            earring2: {grunil: { lvl1: {name: null, img: null, ap:0, dp:10}}},
            neck: {grunil: { lvl1: {name: null, img: null, ap:0, dp:10}}},
            waist: {grunil: { lvl1: {name: null, img: null, ap:0, dp:10}}},
            weapon: {liverto: { lvl1: {name: null, img: null, ap:10, dp:0}}},
            offhand: {yuria: { lvl1: {name: null, img: null, ap:4, dp:0}}},
            awaken: {default: { lvl1: {name: null, img: null, ap:10, dp:0}}},
        }

        return {
            head: $.getJSON('data/head.json'),
            head: $.getJSON('data/head.json'),
            head: $.getJSON('data/head.json'),
            head: $.getJSON('data/head.json'),
            head: $.getJSON('data/head.json'),
            head: $.getJSON('data/head.json')
        }
    };

    bdo.updateItems = function updateItems(items) {

        var slots = ['head', 'chest'];
        $.each(slots, function(i, slot) {
            $.each(Object.keys(items[slot]), function (i, item) {
                $(`select[name=${slot}]`).append($('<option>', {
                    value: item,
                    text : item.capitalize()
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
        itemType = itemType.substring(5)
        $('.character-equipment').children().hide();
        $(`.character-equipment .${itemType}`).show();
    });
    // updating an item name
    $('.character-equipment select').on('change', function() {
        var slot = $(this).parent().attr('class');
        var itemName = $(`.character-equipment select[name="${slot}"]`).find(":selected").val();
        var itemLevel = $(`.character-equipment select[name="${slot}-level"]`).find(":selected").val();
        console.log(slot, itemName, itemLevel);
        bdo.equipItem(slot, itemName, itemLevel);
    });
    //updating an item level

    bdo.all_items = bdo.loadItems();
    bdo.updateItems(bdo.all_items);
    bdo.loadFitting();
    bdo.updateStats();
    window.bdo = bdo;

})(window, document, jQuery)