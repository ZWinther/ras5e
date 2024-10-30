const moduleID = 'ras5e';
const modulePath = `modules/${moduleID}/`;
// Remind users to install/enable libwrapper
Hooks.once('ready', () => {
    if(!game.modules.get('lib-wrapper')?.active && game.user.isGM)
        ui.notifications.error("Rune & Steel 5E requires the 'libWrapper' module. Please install and activate it.");
});

// Handlebars helpers

// less than
Handlebars.registerHelper('lst', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a < b) ? next.fn(this) : next.inverse(this);
});
// greater than
Handlebars.registerHelper('grt', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a > b) ? next.fn(this) : next.inverse(this);
});
// equal than
Handlebars.registerHelper('eqt', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a == b) ? next.fn(this) : next.inverse(this);
});
Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});
Handlebars.registerHelper('if_comp', function (a, operator, b, options) {

    switch (operator) {
        case '==':
            return (a == b) ? options.fn(this) : options.inverse(this);
        case '===':
            return (a === b) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (a != b) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (a !== b) ? options.fn(this) : options.inverse(this);
        case '<':
            return (a < b) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (a <= b) ? options.fn(this) : options.inverse(this);
        case '>':
            return (a > b) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (a >= b) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (a && b) ? options.fn(this) : options.inverse(this);
        case '||':
            return (a || b) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

class SocialclassData extends dnd5e.dataModels.ItemDataModel.mixin(dnd5e.dataModels.item.ItemDescriptionTemplate) {

	static defineSchema() {
		return this.mergeSchema(super.defineSchema(), {
			identifier: new dnd5e.dataModels.fields.IdentifierField({required: true, label: "DND5E.Identifier"})
		});
	}

		static metadata = Object.freeze(foundry.utils.mergeObject(super.metadata, {
		singleton: true
		}, {inplace: false}));

		_onCreate(data, options, userId) {
		if ( (game.user.id !== userId) || this.parent.actor?.type !== "character" ) return;
		this.parent.actor.update({ "flags.ras5e.socialclass.id": this.parent.id, "flags.ras5e.socialclass.name": this.parent.name, "flags.ras5e.socialclass.img": this.parent.img });
		}
		async _preDelete(options, user) {
		if ( this.parent.actor?.type !== "character" ) return;
		await this.parent.actor.update({"flags.ras5e.socialclass": null});
		}
	}

	class SocialclassSheet extends dnd5e.applications.item.ItemSheet5e {
		get template() {
			return `modules/ras5e/templates/ras5e-socialclass-item.hbs`;
		}
		
		
		async getData(options={}) {
			const context = await super.getData(options);
			return context;
		}

	}

Hooks.on('init', async function () {
	Object.assign(CONFIG.Item.typeLabels, { socialclass: "TYPES.Item.socialclass" });
	Object.assign(CONFIG.Item.typeLabels, { socialclass: "TYPES.Item.path" });
	Object.assign(CONFIG.DND5E.featureTypes.race, {	subtypes: { birthfeat: "RAS5E.BirthTrait" }	});
	Object.assign(CONFIG.DND5E.featureTypes.class.subtypes, { attuned: "RAS5E.WeaponAttune" } );
	
	dnd5e.utils.preLocalize("featureTypes.race.subtypes");
	Object.assign(CONFIG.Item.dataModels, { "ras5e.socialclass": SocialclassData });
	Object.assign(CONFIG.Item.dataModels, { "ras5e.path": SocialclassData });
	Object.assign(CONFIG.DND5E.sourceBooks, { "R&S Core": "SOURCE.BOOK.RAS" });

	CONFIG.DND5E.armorIds = {
		buckler: "Compendium.ras5e.rands-items.Item.VMI8z8wjkIXT2r5z",
		roundShield: "Compendium.ras5e.rands-items.Item.PNOobUIpqTMUBC6k",
		shield: "Compendium.ras5e.rands-items.Item.ezSajsqIkYtLIFUu",
		towerShield: "Compendium.ras5e.rands-items.Item.87lR5mRQSj6vSXYI",
		boiledLeather: "Compendium.ras5e.rands-items.Item.aL64qASvvHBrmaWl",
		gambeson: "Compendium.ras5e.rands-items.Item.rJbrm5QG0xDyoTNB",
		hideArmor: "Compendium.ras5e.rands-items.Item.ebm1s2yliP5acorh",
		halfBanded: "Compendium.ras5e.rands-items.Item.0qk2HpU1QNVtmKH3",
		halfMail: "Compendium.ras5e.rands-items.Item.yrh5UztnORTmckQM",
		halfScale: "Compendium.ras5e.rands-items.Item.p8nBTlKZDi4xZHK0",
		coatofPlates: "Compendium.ras5e.rands-items.Item.SGRp0P7XQGW487xY",
		fullBanded: "Compendium.ras5e.rands-items.Item.U8pX1QaiG3bouwK4",
		fullMail: "Compendium.ras5e.rands-items.Item.nTQQaoM8N5sh6wSU",
		fullScale: "Compendium.ras5e.rands-items.Item.HoS2iJS0VtSaJb2H"
	}

	CONFIG.DND5E.weaponIds = {
		club: "Compendium.ras5e.rands-items.Item.O6MovKNmYbTuvVCB",
		dagger: "Compendium.ras5e.rands-items.Item.p6ApevsjybxOWnlt",
		handaxe: "Compendium.ras5e.rands-items.Item.YMg2JXbFmg7Yd7uF",
		javelin: "Compendium.ras5e.rands-items.Item.bedVfS99kECtxGRB",
		modifiedSmithsHammer: "Compendium.ras5e.rands-items.Item.Fcx4H9EYFVxvj53L",
		seax: "Compendium.ras5e.rands-items.Item.AFOxysjswRNiRGhz",
		shortspear: "Compendium.ras5e.rands-items.Item.Maup4s28ACF3b3oV",
		silveredDagger: "Compendium.ras5e.rands-items.Item.Puwu6NIsElR1Dltm",
		staff: "Compendium.ras5e.rands-items.Item.4NqZGKciGHqW3KBH",
		trident: "Compendium.ras5e.rands-items.Item.Oe9MSLC0GUihs9U2",
		truncheon: "Compendium.ras5e.rands-items.Item.sECwUIjJLKfo1acR",
		battleax: "Compendium.ras5e.rands-items.Item.v7Ga3I9pOyqiA35E",
		beardedAxe: "Compendium.ras5e.rands-items.Item.N9d1jDVpxigVuz0X",
		billhook: "Compendium.ras5e.rands-items.Item.fI662eL9vrjHvRPE",
		daneAxe: "Compendium.ras5e.rands-items.Item.8Cgz9ZpfHCyzOr6F",
		falx: "Compendium.ras5e.rands-items.Item.OsG5Ky8Sm3lnefwG",
		flail: "Compendium.ras5e.rands-items.Item.IVNHLkyMzgBIaxtT",
		gladius: "Compendium.ras5e.rands-items.Item.AYT6xPwsvuwGCwR1",
		glaive: "Compendium.ras5e.rands-items.Item.cnW7CSrodMScLRxt",
		greatClub: "Compendium.ras5e.rands-items.Item.gaNld6f3fkJ3Qkxp",
		greatSword: "Compendium.ras5e.rands-items.Item.CLYrhJjxb3lN1kNb",
		guisarme: "Compendium.ras5e.rands-items.Item.CxB9vKSNPl5CvC9Z",
		longspear: "Compendium.ras5e.rands-items.Item.OMg3kJNuiT7TrbAy",
		longsword: "Compendium.ras5e.rands-items.Item.PUhtV9CYdvGISSEF",
		mace: "Compendium.ras5e.rands-items.Item.aDROi6SdxtdayVdY",
		norseSword: "Compendium.ras5e.rands-items.Item.SJBvSjyITf0TjJE9",
		scimitar: "Compendium.ras5e.rands-items.Item.1qnbIr3TGjmtXNUP",
		shortspear: "Compendium.ras5e.rands-items.Item.xKSxUeQ9n4H8FzmN",
		warMaul: "Compendium.ras5e.rands-items.Item.IeyjsuwLJoBscyR1",
		warPick: "Compendium.ras5e.rands-items.Item.tgGpOfcdOcTGpE23",
		warStaff: "Compendium.ras5e.rands-items.Item.qj4F6BPDSJSMeTLe",
		warhammer: "Compendium.ras5e.rands-items.Item.4tuziDbTaxsLdb2R",
		heavyCrossbow: "Compendium.ras5e.rands-items.Item.aUBbQW3q3VI1cRgO",
		longbow: "Compendium.ras5e.rands-items.Item.veRC0aY14nAgcriH",
		net: "Compendium.ras5e.rands-items.Item.iXcM9lslcpTBEqu8",
		crossbowLight: "Compendium.ras5e.rands-items.Item.wyXFTZUUlanrMH91",
		huntingBow: "Compendium.ras5e.rands-items.Item.tDWWmBiKCszsz9eE",
		sling: "Compendium.ras5e.rands-items.Item.T7O3UjcvcHfvlclm"
	
	};
				
	Object.assign(CONFIG.DND5E.armorTypes, { helmet: "RAS5E.Helmet" });
	Object.assign(CONFIG.DND5E.itemProperties, {
		unw: { label: "RAS5E.Unwieldy" },
		cru: { label: "RAS5E.Crushing" },
		def: { label: "RAS5E.Defensive" },
		por: { label: "RAS5E.PoorDefense" },
		dm1: { label: "RAS5E.Damage1" },
		dm2: { label: "RAS5E.Damage2" },
		hpd: { label: "RAS5E.HalfProf" },
		fpd: { label: "RAS5E.FullProf" },
		lhv: { label: "RAS5E.LoadingHeavy" },
		ac1: { label: "RAS5E.Accurate1" },
		ac2: { label: "RAS5E.Accurate2" },
		tri: { label: "RAS5E.Trip" },
		dis: { label: "RAS5E.Disarm" },
		hvs: { label: "RAS5E.HeavyStr" },
		enh: { label: "RAS5E.Enhanced" },
		ref: { label: "RAS5E.Reinforced" }
	});
	Object.assign(CONFIG.DND5E.tools, {
		scribes: { ability: "int", id: "Compendium.ras5e.rands-items.Item.vHFO33zANRREfX2D" },
		farming: { ability: "int", id: "Compendium.ras5e.rands-items.Item.rzHNLWcw9NSt5c57" },
		stonecarver: { ability: "int", id: "Compendium.ras5e.rands-items.Item.47YCovSsldmW16Nr"}
	});
	Object.assign(CONFIG.DND5E.spellcastingTypes.leveled.progression, {	mystic: { label: "RAS5E.SpellProgMyst", divisor: 1, roundUp: true} });
	Object.assign(CONFIG.DND5E.spellProgression, { mystic: "RAS5E.SpellProgMyst" });
	const validWProperties = [ 'unw', 'cru', 'def', 'por', 'dm1', 'dm2', 'hpd', 'fpd', 'lhv', 'ac1', 'ac2', 'tri', 'dis', 'hvs' ];
	validWProperties.forEach(item => CONFIG.DND5E.validProperties.weapon.add(item));
	const validAProperties = [ 'enh', 'ref' ];
	validAProperties.forEach(item => CONFIG.DND5E.validProperties.equipment.add(item));
	
	DocumentSheetConfig.registerSheet(Item, "ras5e", SocialclassSheet, {
		types: ["ras5e.socialclass"],
		makeDefault: true
	});
	CONFIG.DND5E.currencies = {
		gp: {
			label: "RAS5E.CoinsGP",
			abbreviation: "RAS5E.CoinsAbbrGP",
			conversion: 1
		},
		sp: {
			label: "RAS5E.CoinsSP",
			abbreviation: "RAS5E.CoinsAbbrSP",
			conversion: 10
		},
		cp: {
			label: "RAS5E.CoinsHK",
			abbreviation: "RAS5E.CoinsAbbrHK",
			conversion: 100
		}
	};

	CONFIG.DND5E.skills = {
		acr: { label: "DND5E.SkillAcr", ability: "dex" },
		ani: { label: "DND5E.SkillAni", ability: "wis" },
		arc: { label: "DND5E.SkillArc", ability: "int" },
		ath: { label: "DND5E.SkillAth", ability: "str" },
		dec: { label: "DND5E.SkillDec", ability: "cha" },
		his: { label: "DND5E.SkillHis", ability: "int" },
		ins: { label: "DND5E.SkillIns", ability: "wis" },
		itm: { label: "DND5E.SkillItm", ability: "cha" },
		inv: { label: "DND5E.SkillInv", ability: "int" },
		med: { label: "DND5E.SkillMed", ability: "int" },
		nat: { label: "DND5E.SkillNat", ability: "int" },
		prc: { label: "DND5E.SkillPrc", ability: "wis" },
		prf: { label: "DND5E.SkillPrf", ability: "cha" },
		per: { label: "DND5E.SkillPer", ability: "cha" },
		rel: { label: "DND5E.SkillRel", ability: "int" },
		slt: { label: "DND5E.SkillSlt", ability: "dex" },
		ste: { label: "DND5E.SkillSte", ability: "dex" },
		sur: { label: "DND5E.SkillSur", ability: "wis" },
		anc: { label: "RAS5E.SkillAnc", ability: "wis" }
	};

	CONFIG.DND5E.languages = {
		common: "RAS5E.LanguagesCommon",
		norse: "RAS5E.LanguagesNorse",
		vaud: "RAS5E.LanguagesVaudic",
		runsieh: "RAS5E.LanguagesRunEldric",
		bregothi: "RAS5E.LanguagesBregothian",
		calydd: "RAS5E.LanguagesCalyddonian",
		arudain: "RAS5E.LanguagesArudaic",
		attican: "RAS5E.LanguagesAttican",
		elvish: "RAS5E.LanguagesElvish",
		giant: "RAS5E.LanguagesGiant",
		oldtongue: "RAS5E.LanguagesOldTongue",
		oghma: "RAS5E.LanguagesOghma",
		runic: "RAS5E.LanguagesRunic"
	};
	
	// Patch initiative roll to use 1d10 instead of 1d20
	libWrapper.register("ras5e", "game.dnd5e.documents.Actor5e.prototype.getInitiativeRoll", function patchedInitiativeRoll(wrapped, ...args) {
		
		const d20Roll = wrapped(...args);
		const re = new RegExp("(1d20)", "g");
		d20Roll.terms[0]._faces = 10;
		d20Roll._formula = d20Roll._formula.replace(re, "1d10");
		console.log(d20Roll);
		return d20Roll;
	
	}, "mixed")
});

Hooks.on('renderActivityChoiceDialog', (dialog, html) => {
			
	if (dialog.item.identifier === "concussive-blow" || dialog.item.identifier === "giant-feller") {
		dialog.classList.add('hide-dialog');
		// Retrieve the actor's equipped weapons
		const actor = dialog.item.parent;
		const equippedWeapons = actor.items._source.filter(item => item.type === 'weapon' && item.system.equipped && item.system.damage.base.types.includes("bludgeoning"));

		// Generate options for the select form
		const weaponOptions = equippedWeapons.map(weapon => {
			return `<option value="${weapon._id}">${weapon.name}</option>`;
		}).join('');

		console.log(actor);
		console.log(equippedWeapons);

	// Prompt the user for the number of items to use
	let prompt = new Dialog({
	title: "Choose a Weapon",
	content: `
		<form>
			<div class="form-group">
				<label>Which equipped weapon do you want to use?</label>
				<select name="weapon">
					${weaponOptions}
				</select>
			</div>
		</form>
	`,
	render: html => { 
		const closeBtn = html.find("control")
	},
	buttons: {
		use: {
			label: "Use",
			callback: async (html) => {
				const selectedWeaponId = html.find('[name="weapon"]').val();
				const selectedWeapon = actor.items.get(selectedWeaponId);
				console.log(`Selected Weapon: ${selectedWeapon.name}`);
				if (dialog.item.identifier === "concussive-blow") {
				const concussiveDamageNum = selectedWeapon.system.damage.base.number;
				const concussiveDamageDie = selectedWeapon.system.damage.base.denomination;
				const concussiveDamage = `${concussiveDamageNum}d${concussiveDamageDie}`;
				actor.setFlag('ras5e', 'concussiveDamage', { value: concussiveDamage });
				}
				if (dialog.item.identifier === "giant-feller") {
					const fellerDamageNum = selectedWeapon.system.damage.base.number;
					const fellerDamageDie = selectedWeapon.system.damage.base.denomination;
					const fellerDamage = `${fellerDamageNum}d${fellerDamageDie}`;
					actor.setFlag('ras5e', 'fellerDamage', { value: fellerDamage });
				}
				dialog.classList.remove('hide-dialog');
			}
		},
		cancel: {
			label: "Cancel",
			callback: async (html) => {
				dialog.close();
			}
		}
	},
	default: "use"
}, {
	classes: ["application", "dnd5e2", "activity-usage"]
});
prompt.render(true);
	}
});
Hooks.on('dnd5e.preRollAttackV2', (attack, dialog, options) => {
	if (attack.rolls[0].data.activity.attack.type.value === "ranged" && attack.subject.actor.getFlag('ras5e', 'watcherAccuracy') != undefined) {
		const critChance = attack.rolls[0].options.criticalSuccess;
		const watcherAccuracy = attack.rolls[0].data.flags.ras5e.watcherAccuracy.value
		attack.rolls[0].options.criticalSuccess = critChance - watcherAccuracy;
	}
});
Hooks.on('dnd5e.preRollDamageV2', (dialog, event, data) => {
	if (dialog.subject.parent.identifier === "concussive-blow") {
		const concussiveDamage = dialog.subject.actor.getFlag('ras5e', 'concussiveDamage').value;
		const concussiveDmgFormula = dialog.rolls[0].parts[0];
		const concussiveRoll = `${concussiveDmgFormula}+${concussiveDamage}`;
		dialog.rolls[0].parts[0] = concussiveRoll;
		
	}
	if (dialog.subject.parent.identifier === "giant-feller") {
		const fellerDamage = dialog.subject.actor.getFlag('ras5e', 'fellerDamage').value;
		const fellerDmgFormula = dialog.rolls[0].parts[0];
		const fellerRoll = `${fellerDmgFormula}+${fellerDamage}`;
		dialog.rolls[0].parts[0] = fellerRoll;
		
	}
});
Hooks.on('dnd5e.rollDamageV2', (dialog, event, data) => {
	if (event.subject.parent.identifier === "soul-release") {
		const soulsUsed = event.subject.actor.getFlag('ras5e', 'soulsUsed').value;
		const newQuantity = soulsUsed - soulsUsed;
		event.subject.actor.setFlag('ras5e', 'soulsUsed', { value: newQuantity });
		
	}
});
Hooks.on('dnd5e.preUseActivity', async (activity, event1, event2, event3) => {

	if (activity.name === "Capture Souls") {
		const currentSouls = activity.actor.getFlag('ras5e', 'damnedSouls').value;
		const maxSouls = activity.actor.getFlag('ras5e', 'damnedSouls').max;
		if (currentSouls >= maxSouls) {
			event3.create = false;
			ui.notifications.warn("You have reached the maximum number of souls you can capture.");
		}
		else {
		ui.notifications.info("Soul Captured.");
		const newSouls = currentSouls + 1;
		activity.actor.setFlag('ras5e', 'damnedSouls', { value: newSouls });
		}
	}
	if (activity.item.identifier === "soul-release") {
		const actor = activity.item.parent;
		const item = actor.getFlag('ras5e', 'damnedSouls');
		const itemQuantity = item.value;
		if (!item || itemQuantity === 0) {
			ui.notifications.error(`Character has no Captured Souls.`);
			return;
		}
		const options = Array.fromRange(itemQuantity).reduce((acc, e) => {
			return acc + `<option value="${e+1}">${e+1} Souls</option>`;
			}, "");
		let soulPrompt = new Dialog({
			title: "Use Souls",
			content: `
				<form>
				<div class="form-group">
					<label>How many Souls do you want to use?</label>
					<select>${options}</select>
				</div>
				</form>
			`,
			buttons: {
				use: {
				label: "Use",
				callback: async (html) => {
					const usedQuantity = parseInt(html.find('select').val());
					await consumeSouls(activity, item, usedQuantity, actor);
				}
				},
				cancel: {
				label: "Cancel"
				}
			},
			default: "use"
			});
		soulPrompt.render(true);
		
		async function consumeSouls(activity, item, usedQuantity, actor) {
				// Update the quantity
				const newQuantity = item.value - usedQuantity;
				actor.setFlag('ras5e', 'damnedSouls', { value: newQuantity });
				actor.setFlag('ras5e', 'soulsUsed', { value: usedQuantity });
				// Display a notification
				ui.notifications.info(`${usedQuantity} Soul(s) used.`);
		}
	}
});

// Function to consume items
async function consumeItems(item, quantity) {
	const actor = item.parent;
	// Use the item's ID to find it in the actor's inventory
	const itemID = "Compendium.ras5e.rands-classes.Item.3ls2otXV7NR77iC3";
	const targetItem = actor.sourcedItems.get(itemID);
	if (!targetItem) {
		ui.notifications.error(`Item not found on the actor.`);
	}
	const itemData = targetItem.system;
	// Check if the actor has enough items
	if (itemData.quantity >= quantity) {
		// Update the item quantity
		await targetItem.update({ 'system.quantity': itemData.quantity - quantity });
		actor.setFlag('ras5e', 'soulsUsed', { value: quantity });
		// Display the item card in the chat and fire a notification
		item.displayCard();
		ui.notifications.info(`${quantity} ${targetItem.name}(s) used.`);
	} else {
		ui.notifications.error(`Not enough ${targetItem.name}(s) to use.`);
	}
}

function i18n(key) {
	return game.i18n.localize(key);
}
function formatText(value) {
	return new Handlebars.SafeString(value?.replaceAll("\n", "<br>") ?? "");
}
Hooks.on('preCreateActor', async function (actor, data, options) {
	// Set the actor's fate dice and wyrd flags
	await actor.updateSource({
		flags: {
			['ras5e']: {
				fatedice: {
					label: "RAS5E.FateDice",
					value: 0,
					max: 0
				},
				wyrd: {
					label: "RAS5E.Wyrd",
					value: 0,
					max: 20,
					pct: 0.00
				}
			}
		}
	});
});
Hooks.on('preUpdateActor', async function (actor5e) {
	const actor = actor5e;
	// If the fate dice flag is doesn't exist, add it and set its value and max to 0
	const fateFlag = actor.getFlag('ras5e', 'fatedice');
	if (fateFlag == undefined) {
			this.setFlag('ras5e', 'fatedice', {
				label: "RAS5E.FateDice",
				value: 0,
				max: 0
			});
	}
});
Hooks.on('renderActorSheet5eCharacter2', async function (app, html, data) {
	const actor = data.actor;
	const sheet5e = app.options.classes;
	if (sheet5e.includes("dnd5e2", "character")) {
		const fateFlag = actor.getFlag('ras5e', 'fatedice');
		const wyrdpct = Math.clamp((actor.flags.ras5e.wyrd.value / actor.flags.ras5e.wyrd.max) * 100, 0, 100).toFixed(2);
		actor.setFlag('ras5e', 'wyrd', {
			pct: wyrdpct
		});
		// Make sure the actor's max fate dice is always equal to their proficiency bonus
		const prof = actor.system.attributes.prof;
		if (fateFlag.max < prof || fateFlag.max > prof) {
			actor.setFlag('ras5e', 'fatedice', {
				max: prof
			});
		}
		// If the actor sets their fate dice to a higher number than their max, set the current dice to the max value
		if (fateFlag.value > fateFlag.max) {
			actor.setFlag('ras5e', 'fatedice', {
				value: prof
			});
		}
		const fateBox = "/modules/ras5e/templates/ras5e-fate.hbs"
		const fateHtml = await renderTemplate(fateBox, data);
		var fateDiv = $(html).find('.sheet-header .left')[0];
		$(fateHtml).insertAfter(fateDiv);

		let diceBox = $(html).find('.ras-fatebox .meter .label')[0];
		let dice = parseInt(fateFlag.max);
		let currentDice = fateFlag.value;
		// Add fateDice buttons equal to the actor's max fate dice
		for (var i = 0; i < dice; i++) {
			let maxDice = `<button class="fateDice" name="fateDice-${1+i}"></button>`;
			$(diceBox).before(maxDice);
		}
		// Select all fateDice buttons
		const fateDiceButtons = $(html).find('.fateDice').toArray();

		// Iterate over the buttons and add the "active" class when dice number is less than or equal to the actor's current fate dice
		fateDiceButtons.forEach(button => {
			const name = button.name;
			const match = name.match(/^fateDice-(\d+)$/);
			if (match) {
				const number = parseInt(match[1]);
				if (number <= currentDice) {
						button.classList.add('active');
				}
			}
		});



			const wyrdBox = "/modules/ras5e/templates/ras5e-wyrd.hbs"
			const wyrdHtml = await renderTemplate(wyrdBox, data);
			var wyrdDiv = $(html).find(".sidebar .card .stats").children().last();
			$(wyrdHtml).insertAfter(wyrdDiv);

			const socialBox = "/modules/ras5e/templates/ras5e-socialclass.hbs"
			const socialHtml = await renderTemplate(socialBox, data);
			var socialDiv = $(html).find('.top .pills-lg').children().last();
			$(socialHtml).insertAfter(socialDiv);

			const mainClass = actor._classes[Object.keys(actor._classes)[0]]?.identifier;
			const subclass = actor._classes[Object.keys(actor._classes)[0]]?.subclass?.identifier;
			if (mainClass === "seidr" ) {
				if (subclass === "damned-path") {
					const damnedFlag = actor.getFlag('ras5e', 'damnedSouls');
					if (damnedFlag == undefined || damnedFlag.value == null) {
						const halfIntMinOne = Math.max(actor.system.abilities.int.mod / 2, 1);
						actor.setFlag('ras5e', 'damnedSouls', {
							label: "RAS5E.DamnedSouls",
							value: 0,
							max: halfIntMinOne
						});
					}
				}
				else if (subclass === "fenrir") {
					const furyFlag = actor.getFlag('ras5e', 'fenrirFury');
					if (furyFlag == undefined || furyFlag.value == null) {
						const seidrLevel = actor.system.scale.fenrir.fury.value;
						actor.setFlag('ras5e', 'fenrirFury', {
							label: "RAS5E.fenrirFury",
							value: 0,
							max: seidrLevel
						});
					}
				
				}
			}
			if (mainClass === "furysworn" ) {
					const damnedFlag = actor.getFlag('ras5e', 'frenzies');
					if (damnedFlag == undefined || damnedFlag.value == null) {
						actor.setFlag('ras5e', 'frenzies', {
							label: "RAS5E.Frenzies",
							value: actor.system.scale.furysworn.frenzies.value
						});
				}
			}
			if ( ['damned-path', 'fenrir'].includes(subclass) || ['furysworn'].includes(mainClass) ) {
					const classBox = "/modules/ras5e/templates/ras5e-class-elements.hbs";
					const classHtml = await renderTemplate(classBox, data);
					var classDiv = $(html).find(".sidebar .card .stats").children().last();
					$(classHtml).insertAfter(classDiv);
			}

			html[0].querySelector(".socialclass-box").addEventListener("click", async ev => {
				var socialclassDiv = $(html).find('.socialclass-box .pill-lg');
				if (socialclassDiv.hasClass("empty")) {
					const target = ev.currentTarget;
					_onFindItem(target.dataset.itemType);
				}
				if (socialclassDiv.hasClass("socialclass")) {
					const target = ev.currentTarget.children[0];
					const itemId = target.closest("[data-item-id]")?.dataset.itemId;
					const item = await actor.items.get(itemId)
					item.sheet.render(true);
				}
			});

			$(html).find(".class-adjustment-button").on( "mouseup", async ev => {
			
				ev.preventDefault();
				const action = ev.currentTarget.dataset.action;
				const input = ev.currentTarget.closest(".label").querySelector("input");
				if ( action === "decrease" && input.value != 0) input.valueAsNumber -= 1;
				else if ( action === "increase" && input.value != input.max ) input.valueAsNumber += 1;
				app.submit();
			});
			$(html).find(".fateDice").on( "mouseup", async ev => {
				const target = ev.currentTarget;
				const name = target.name;
				const match = name.match(/^fateDice-(\d+)$/);
				if (match) {
				const targetNumber = parseInt(match[1]);
				const fateDiceButtons = $(html).find('.fateDice').toArray();
				// Iterate over the buttons and add the "active" class conditionally
				fateDiceButtons.forEach(button => {
					const buttonName = button.name;
					const buttonMatch = buttonName.match(/^fateDice-(\d+)$/);
					if (match) {
						const buttonNumber = parseInt(buttonMatch[1]);
						if (buttonNumber == targetNumber && buttonNumber == currentDice && button.classList.contains('active')) {
								actor.setFlag('ras5e', 'fatedice', { value: targetNumber - 1 });
						} else if (buttonNumber == targetNumber && targetNumber < currentDice && button.classList.contains('active')) {
								actor.setFlag('ras5e', 'fatedice', { value: targetNumber });
						} else if (buttonNumber == targetNumber && !button.classList.contains('active')) {
								actor.setFlag('ras5e', 'fatedice', { value: targetNumber });
						}
					}
				});
				}
			});

			async function _onFindItem(type) {
				new dnd5e.applications.CompendiumBrowser({ filters: { locked: { types: new Set(["ras5e.socialclass"]) } } }).render(true);
			}

			};
});
