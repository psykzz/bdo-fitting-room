;(function (window, document) {
    'use strict';

    var bdo = window.bdo || {};

    bdo.equippedItems = {
        armor: {
            head: { name: null, img: null, ap: 0, dp: 0 },
            chset:  { name: null, img: null, ap: 0, dp: 0 },
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
    function loadJSON(url, callback) {
        var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
        xobj.open('GET', url, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
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
            head: {grunil: { lvl1: {ap:0, dp:10}}},
            armor: {grunil: { lvl1: {ap:0, dp:10}}},
            gloves: {grunil: { lvl1: {ap:0, dp:10}}},
            shoes: {grunil: { lvl1: {ap:0, dp:10}}},
            ring1: {grunil: { lvl1: {ap:0, dp:10}}},
            ring2: {grunil: { lvl1: {ap:0, dp:10}}},
            earring1: {grunil: { lvl1: {ap:0, dp:10}}},
            earring2: {grunil: { lvl1: {ap:0, dp:10}}},
            neck: {grunil: { lvl1: {ap:0, dp:10}}},
            waist: {grunil: { lvl1: {ap:0, dp:10}}},
        }

        return {
            head: loadJSON('data/head.json'),
            head: loadJSON('data/head.json'),
            head: loadJSON('data/head.json'),
            head: loadJSON('data/head.json'),
            head: loadJSON('data/head.json'),
            head: loadJSON('data/head.json')
        }
    };

    bdo.updateStats = function updateStats() {
        var $ap = document.querySelector('.stat-ap span');
        var $aap = document.querySelector('.stat-awaken-ap span');
        var $dp = document.querySelector('.stat-dp span');

        $ap.textContent = calculateAP();
        $aap.textContent = calculateAAP();
        $dp.textContent = calculateDP();
    }

    bdo.equipItem = function equipItem(slot, name, level) {

    }

    bdo.loadFitting = function loadFitting() {
        var fittingHash = window.location.hash;
        console.log(`Fitting Hash: ${fittingHash}`);
    }

    var all_items = bdo.loadItems();

    bdo.loadFitting();
    bdo.updateStats();
    window.bdo = bdo;

})(window, document)