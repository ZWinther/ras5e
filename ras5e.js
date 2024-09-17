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
		// "flags.ras5e.socialclass.id": this.parent.id,
		// "flags.ras5e.socialclass.name": this.parent.name,
		// "flags.ras5e.socialclass.img": this.parent.img
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
	
	// const flag = this.getFlag('ras5e', 'fatedice');
	// 	if (flag == undefined) {
	// 		this.setFlag('ras5e', 'fatedice', {
	// 			label: "RAS5E.FateDice",
	// 			value: 0,
	// 			max: 0
	// 		});
	// 	};

	// 	const wyrdFlag = this.getFlag('ras5e', 'wyrd');
	// 	if (wyrdFlag == undefined) {
	// 		this.setFlag('ras5e', 'wyrd', {
	// 			label: "RAS5E.Wyrd",
	// 			value: 0,
	// 			max: 20,
	// 			pct: 0.00
	// 		});
	// 	};


	

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
		oghma: "RAS5E.LanguagesOghma"
	};

	CONFIG.DND5E.newSkills = [
		{
			skl: "anc",
			ability: "wis"
		},
	];


	// Remove PP and EP from showing up on character sheet displays since we don't use them in LOTR5E	
	libWrapper.register("ras5e", "game.dnd5e.applications.actor.ActorSheet5eCharacter.prototype.getData", async function patchedActorSheet5eCharacter(wrapped, ...args) {

		const data = await wrapped(...args);
		delete data.system.currency.pp;
		delete data.system.currency.ep;

		// Return data to the sheet
		return data

	}, "WRAPPER");

	// Remove PP and EP from showing up on vehicle sheet displays since we don't use them in LOTR5E	
	libWrapper.register("ras5e", "game.dnd5e.applications.actor.ActorSheet5eVehicle.prototype.getData", async function patchedActorSheet5eCharacter(wrapped, ...args) {

		const data = await wrapped(...args);
		delete data.system.currency.pp;
		delete data.system.currency.ep;

		// Return data to the sheet
		return data
	}, "WRAPPER");

	libWrapper.register("ras5e", "CONFIG.Actor.documentClass.prototype.prepareDerivedData", function patchedPrepareDerivedData(wrapped, ...args) {
    wrapped(...args);

	// console.log(this.flags.ras5e)

	// if (this.flags.ras5e.fatedice == undefined) {
	// 	console.log("undefined!")
	// }

	// 	const wyrdFlag = this.getFlag('ras5e', 'wyrd');
	// 	if (wyrdFlag == undefined) {
	// 		this.setFlag('ras5e', 'wyrd', {
	// 			label: "RAS5E.Wyrd",
	// 			value: 0,
	// 			max: 20,
	// 			pct: 0.00
	// 		});
	// 	};

		    //FIX CUSTOM SKILL ABILITIES
		const source = this._source.system;
		const newSkills = CONFIG.DND5E.newSkills;
		const skillData = this.system.skills;
		const skillSource = source.skills;
		
		if ( this.type != "vehicle" && this.type != "group" ) {
		newSkills.forEach(e => {
			let sklName = e["skl"];
			let sklAbility = e["ability"];
			if (typeof (skillData[sklName]) == "undefined") {
				skillData[sklName] = new Object();
				skillData[sklName].value = 0;
				skillData[sklName].ability = sklAbility;
			}
			if (typeof (skillData[sklName].ability) == "undefined") {
				skillData[sklName].ability = [sklAbility];
			}
		});
		newSkills.forEach(e => {
		let sklName = e["skl"];
		let sklAbility = e["ability"];
		if (typeof (skillSource[sklName]) == "undefined") {
			skillSource[sklName] = new Object();
			skillSource[sklName].value = 0;
			skillSource[sklName].ability = sklAbility;
		}
		if (typeof (skillSource[sklName].ability) == "undefined") {
			skillSource[sklName].ability = [sklAbility];
	}
	});
	};

}, "WRAPPER");
});
Hooks.on('renderActivityChoiceDialog', (dialog, html) => {
	if (dialog.item.identifier === "concussive-blow") {
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
		console.log(closeBtn);
	},
	buttons: {
		use: {
			label: "Use",
			callback: async (html) => {
				const selectedWeaponId = html.find('[name="weapon"]').val();
				const selectedWeapon = actor.items.get(selectedWeaponId);
				console.log(`Selected Weapon: ${selectedWeapon.name}`);
				const concussiveDamageNum = selectedWeapon.system.damage.base.number;
				const concussiveDamageDie = selectedWeapon.system.damage.base.denomination;
				const concussiveDamage = `${concussiveDamageNum}d${concussiveDamageDie}`;
				actor.setFlag('ras5e', 'concussiveDamage', { value: concussiveDamage });
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
Hooks.on('dnd5e.preRollDamageV2', (dialog, html, data) => {
	if (dialog.subject.parent.identifier === "concussive-blow") {
		const concussiveDamage = dialog.subject.actor.getFlag('ras5e', 'concussiveDamage').value;
		const dmgFormula = dialog.rolls[0].parts[0];
		const concussiveRoll = `${dmgFormula}+${concussiveDamage}`;
		dialog.rolls[0].parts[0] = concussiveRoll;
		
	}
});
// Hooks.on('dnd5e.postUseActivity', async (activity, event1, event2) => {
// 	const surgeID = "soul-surge";
// 	const releaseID = "soul-release";
// 	const furyID = "fenrir-fury";
// 	const concussiveID = "concussive-blow";

// 	console.log(activity);
// 	console.log(event1);
// 	console.log(event2);
	
// 		// Check if the used item matches the specific UUID
// 		if (activity.parent.identifier === concussiveID) {
// 			const concussiveDamage = activity.actor.getFlag('ras5e', 'concussiveDamage').value;
// 			const dmgFormula = activity.damage.parts[0].custom.formula;
// 			console.log(concussiveDamage);
// 			console.log(activity.damage.parts);
// 			activity.damage.parts[0]._source.custom.formula = `${dmgFormula}+${concussiveDamage}`;
// 			activity.damage.parts[0].custom.formula = `${dmgFormula}+${concussiveDamage}`;
// 		}
// 	});
// Function to listen for item usage
Hooks.on('dnd5e.preUseActivity', async (activity, event1, event2) => {
	const surgeID = "soul-surge";
	const releaseID = "soul-release";
	const furyID = "fenrir-fury";
	const concussiveID = "concussive-blow";

	// console.log(activity);
	// console.log(event1);
	// console.log(event2);
	
		// // Check if the used item matches the specific UUID
		// if (activity.parent.identifier === concussiveID) {
		// 	const concussiveDamage = activity.actor.getFlag('ras5e', 'concussiveDamage').value;
		// 	const dmgFormula = activity.damage.parts[0].custom.formula;
		// 	console.log(concussiveDamage);
		// 	console.log(activity.damage.parts);
		// 	activity.damage.parts[0]._source.custom.formula = `${dmgFormula}+${concussiveDamage}`;
		// 	activity.damage.parts[0].custom.formula = `${dmgFormula}+${concussiveDamage}`;
		// }
	// // Check if the used item matches the specific UUID
	// if (activity.parent.identifier === surgeID) {
	// 	// Hooks.on("renderChatMessage", (message, html, data) => {
	// 	// 	console.log(message);
	// 	// 	console.log(data);
	// 	// });
		
	// 	// Prevent the default popup
	// 	event2.event.preventDefault();
	// 	event2.event.stopPropagation();
	// 	event2.configureDialog = false;
	// 	event2.createMessage = false;
	// 	event2.flags.dnd5e.use.consumedResource = false;
	// 	// Prompt the user for the number of items to use
	// 	let dialog = new Dialog({
	// 	title: "Use Items",
	// 	content: `
	// 		<form>
	// 		<div class="form-group">
	// 			<label>How many items do you want to use?</label>
	// 			<input type="number" name="quantity" min="1" value="1"/>
	// 		</div>
	// 		</form>
	// 	`,
	// 	buttons: {
	// 		use: {
	// 		label: "Use",
	// 		callback: async (html) => {
	// 			const quantity = parseInt(html.find('[name="quantity"]').val());
	// 			await consumeItems(item5e, quantity);
	// 		}
	// 		},
	// 		cancel: {
	// 		label: "Cancel"
	// 		}
	// 	},
	// 	default: "use"
	// 	});
	// 	dialog.render(true);
	// }
	// if (activity.parent.identifier === releaseID) {
	// 	// Hooks.on("renderChatMessage", (message, html, data) => {
	// 	// 	console.log(message);
	// 	// 	console.log(data);
	// 	// });
		
	// 	// Prevent the default popup
	// 	event1.createMeasuredTemplate = false;
	// 	event2.event.preventDefault();
	// 	event2.event.stopPropagation();
	// 	event2.configureDialog = false;
	// 	event2.createMessage = false;
	// 	event2.flags.dnd5e.use.consumedResource = false;
	// 	// Prompt the user for the number of items to use
	// 	let dialog = new Dialog({
	// 	title: "Use Items",
	// 	content: `
	// 		<form>
	// 		<div class="form-group">
	// 			<label>How many items do you want to use?</label>
	// 			<input type="number" name="quantity" min="1" value="1"/>
	// 		</div>
	// 		</form>
	// 	`,
	// 	buttons: {
	// 		use: {
	// 		label: "Use",
	// 		callback: async (html) => {
	// 			const quantity = parseInt(html.find('[name="quantity"]').val());
	// 			await consumeItems(item5e, quantity);
	// 		}
	// 		},
	// 		cancel: {
	// 		label: "Cancel"
	// 		}
	// 	},
	// 	default: "use"
	// 	});
	// 	dialog.render(true);
	// }
	// if (activity.parent.identifier === furyID) {
		
	// 	// Hooks.on("renderChatMessage", (message, html, data) => {
	// 	// 	console.log(message);
	// 	// 	console.log(data);
	// 	// });
		
	// 	// Prevent the default popup
	// 	// event1.consumeUsage = false;
	// 	// event2.flags.dnd5e.use.consumedUsage = false;
	// 	event2.configureDialog = false;
	// 	// event2.createMessage = false;

	// 	const item = item5e;
	// 	const actor = item.parent;
	// 	const options = Array.fromRange(item.system.uses.value).reduce((acc, e) => {
	// 	return acc + `<option value="${e+1}">${e+1} charges</option>`;
	// 	}, "");
	// 	const content = `
	// 	<form> <div class="form-group">
	// 	<label>Charges:</label>
	// 	<div class="form-fields">
	// 	<select>${options}</select>
	// 	</div></div></form>`;
	// 	if (item.system.uses.value != 0) {
	// 		const num = await Dialog.prompt({
	// 		title: "Consume Charges",
	// 		content,
	// 		rejectClose: false,
	// 		callback: (html) => html[0].querySelector("select").value
	// 		});
	// 		if(!num) return;
	// 		const value = Number(num);
	// 		await item.update({ "system.uses.value": item.system.uses.value - value });
	// 		actor.setFlag('ras5e', 'furyUsed', { value: value });
	// 		ui.notifications.info(`${value} ${item.name}(s) used.`);
	// 	}
	

	// 	// // Prompt the user for the number of items to use
	// 	// let dialog = new Dialog({
	// 	// title: "Use Fury Charges",
	// 	// content: `
	// 	// 	<form>
	// 	// 	<div class="form-group">
	// 	// 		<label>How many stacks do you want to use?</label>
	// 	// 		<input type="number" name="uses" min="1" value="1"/>
	// 	// 	</div>
	// 	// 	</form>
	// 	// `,
	// 	// buttons: {
	// 	// 	use: {
	// 	// 	label: "Use",
	// 	// 	callback: async (html) => {
	// 	// 		const charges = parseInt(html.find('[name="uses"]').val());
	// 	// 		await consumeFury(item5e, charges);
	// 	// 	}
	// 	// 	},
	// 	// 	cancel: {
	// 	// 	label: "Cancel"
	// 	// 	}
	// 	// },
	// 	// default: "use"
	// 	// });
	// 	// dialog.render(true);
	// }
});
// var preFury = null;
// var afterFury = null;
// Hooks.on('dnd5e.preRollAttack', (Item5e, roll) => {
// 	const item = Item5e;
// 	const actor = item.parent;
// 	const furyFlag = actor.getFlag('ras5e', 'furyUsed')
	
// 	if (furyFlag.value > 0 ) {
// 		preFury = furyFlag.value;
// 		item.setFlag('ras5e', 'itemFury', {
// 			val: preFury
// 		});
// 		furyMod = setAfterFury().onCall(async (roll) => {
// 		roll.parts.push([furyMod]);
		
// 		console.log(roll.parts);
// 	}
// });

// Hooks.on('renderDialog', (dialog, html) => {
// 	if (dialog.data.title.includes("Attack Roll") && preFury > 0) {
// 		const options = Array.fromRange(preFury).reduce((acc, e) => {
// 			return acc + `<option value="${e+1}">${e+1} charges</option>`;
// 		}, "");

// 		let dropdown = `
// 		<form> <div class="form-group">
// 		<label>Charges:</label>
// 		<div class="form-fields">
// 		<select id="fury-charges">${options}</select>
// 		</div></div></form>`;

// 		html.find('.dialog-content form div:last-child').after(dropdown);

// 		// Add event listeners to dialog buttons
//             $('.dialog-button').on('click', () => {
				
//                 const selectedCharges = parseInt(html.find('#fury-charges').val());
// 				setAfterFury(selectedCharges)
// 				console.log(selectedCharges);
//             });
// 	}
// });
// async function setAfterFury(selectedCharges) {
// 	afterFury = selectedCharges;
// }
// Hooks.on('dnd5e.rollAttack', (Item5e, roll) => {
// 	if (afterFury > 0) {
// 		roll.data.mod = `${roll.data.mod} + ${afterFury}`;
// 		console.log(roll)
// 	}
// });
// Function to consume items
async function consumeItems(item, quantity) {
	const actor = item.parent;
	const itemID = "Compendium.ras5e.rands-classes.Item.3ls2otXV7NR77iC3"; // Use the item's ID to find it in the actor's inventory
	// Find the item in the actor's inventory
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
	// actor.setFlag('ras5e', 'fatedice', {
	// 	label: "RAS5E.FateDice",
	// 	value: 0,
	// 	max: 0
	// })
});



// });
Hooks.on('renderActorSheet5eCharacter2', async function (app, html, data) {
	
	const actor = data.actor;
	const sheet5e = app.options.classes;
	if (sheet5e.includes("dnd5e2", "character")) {
		// const fateFlag = actor.getFlag('ras5e', 'fatedice');

		// const wyrdpct = Math.clamp((actor.flags.ras5e.wyrd.value / actor.flags.ras5e.wyrd.max) * 100, 0, 100).toFixed(2);
		// actor.setFlag('ras5e', 'wyrd', {
		// 	pct: wyrdpct
		// });
		// if (fateFlag.value > fateFlag.max) {
		// 	actor.setFlag('ras5e', 'fatedice', {
		// 		value: actor.system.attributes.prof
		// 	});
		// }
			// const bio2 = "/modules/ras5e/templates/lotr-summary2.hbs"
			// const bioHtml2 = await renderTemplate(bio2, data);
			// var bioDiv2 = $(html).find('ul.characteristics li').last();
			// bioDiv2.after(bioHtml2);

			const fateBox = "/modules/ras5e/templates/ras5e-fate.hbs"
			const fateHtml = await renderTemplate(fateBox, data);
			var fateDiv = $(html).find('.sheet-header .left')[0];
			$(fateHtml).insertAfter(fateDiv);

			const wyrdBox = "/modules/ras5e/templates/ras5e-wyrd.hbs"
			const wyrdHtml = await renderTemplate(wyrdBox, data);
			var wyrdDiv = $(html).find(".sidebar .card .stats").children().last();
			$(wyrdHtml).insertAfter(wyrdDiv);

			const socialBox = "/modules/ras5e/templates/ras5e-socialclass.hbs"
			const socialHtml = await renderTemplate(socialBox, data);
			var socialDiv = $(html).find('.top .pills-lg').children().last();
			$(socialHtml).insertAfter(socialDiv);

			// console.log(data);
			// console.log(html);
			// console.log(app);
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
				// You Event Delegation for buttons within your selector that are clicked.
				
			

			async function _onFindItem(type) {
				new dnd5e.applications.CompendiumBrowser({ filters: { locked: { types: new Set(["ras5e.socialclass"]) } } }).render(true);
			}
			//app.activateListeners(html);

			};
			
	// if (sheet5e.includes("dnd5e", "character")) {

	// 	// const SumBox = "/modules/ras5e/templates/lotr-summary.hbs"
    //     // const SumHtml = await renderTemplate(SumBox, actor);
    //     // var summary = $(html).find('.summary')[0];
    //     // // summary = SumHtml;
	// 	// $(SumHtml).insertAfter(summary);

    //     $(html).find(".dnd5e.sheet.actor.character").css("min-height", "823px");
    // }
    });
