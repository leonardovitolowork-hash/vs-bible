/* GRIMOIRE DIAGRAM DATA */
const GR=[
["Whip",["Hollow Heart"],"Bloody Tear"],
["Magic Wand",["Empty Tome"],"Holy Wand"],
["Knife",["Bracer"],"Thousand Edge"],
["Axe",["Candelabrador"],"Death Spiral"],
["Cross",["Clover"],"Heaven Sword"],
["King Bible",["Spellbinder"],"Unholy Vespers"],
["Fire Wand",["Spinach"],"Hellfire"],
["Garlic",["Pummarola"],"Soul Eater"],
["Santa Water",["Attractorb"],"La Borra"],
["Runetracer",["Armor"],"NO FUTURE"],
["Lightning Ring",["Duplicator"],"Thunder Loop"],
["Pentagram",["Crown"],"Gorgeous Moon"],
["Gatti Amari",["Stone Mask"],"Vicious Hunger"],
["Song of Mana",["Skull O'Maniac"],"Mannajja"],
["Shadow Pinion",["Wings"],"Valkyrie Turner"],
["Clock Lancet",["Silver Ring","Gold Ring"],"Infinite Corridor"],
["Laurel",["Metaglio Left","Metaglio Right"],"Crimson Shroud"],
["Peachone + Ebony Wings",[],"Vandalier",1],
["Phiera Der Tuphello + Eight The Sparrow",["Tirajisú"],"Phieraggi",1],
["Vento Sacro + Bloody Tear",[],"Fuwalafuwaloo",1],
["Bracelet",[],"Bi-Bracelet"],
["Bi-Bracelet",[],"Tri-Bracelet"],
["Candybox",[],"Super Candybox II Turbo"],
["Bone",[],"Anima of Mortaccio"],
["Cherry Bomb",[],"Yatta Daikarin"],
["Carréllo",[],"Carrozza!"],
["Celestial Dusting",[],"Profusione D'Amore"],
["Pako Battiliar",["Hollow Heart"],"Mazo Familiar"],
["Flames of Misspell",["Torrona's Box"],"Ashes of Muspell"],
["Glass Fandango",["Wings"],"Celestial Voulge"],
["Santa Javelin",[],"Seraphic Cry"],
["Gaze of Gaea",[],"Embrace of Gaea"],
["Magi-Stone",[],"Kyra-Stones"],
["Phas3r",[],"Photonstorm"],
["Chaos Rune",[],"Wicked Ruler"],
["Victory Sword",["Torrona's Box"],"Sole Solution (gift: sword stays)"]
];
GR.forEach(r=>{
 const union=r[3];
 const recipe=r[0]+(r[1].length?" + "+r[1].join(" + "):"");
 A("Grimoire",r[2],recipe,[["Recipe",recipe],["Type",union?"Union":"Evolution"],["How",union?"All listed weapons must be max level; open an eligible chest.":"Max the weapon and required passive(s), then open an eligible chest."]]);
});
