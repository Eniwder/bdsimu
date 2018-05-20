const Character = require('./Character');
const Status = require('./Status');
const Skill = require('./Skill');
const println = function(s) { console.log(s) }



const EliseStats = new Status(1250,6848,7.6,20,50,15);
const EliseS1 = Skill.invalidation(2,Skill.timing.beAtk,10);
const EliseS3 = Skill.absorb(2,24,50);
const EliseSkills = [EliseS1,EliseS3];
const Elise = new Character('エリーゼ',Character.types.magic,EliseStats,EliseSkills);

const YmirStats = new Status(844,15179,10,10,50,0);
const YmirS1 = Skill.threatBlow(20);
const YmirSkills = [YmirS1];
const Ymir = new Character('イミル',Character.types.def,YmirStats,YmirSkills);

const pt1 = [Elise];
const pt2 = [Ymir];

let battleTurn = 1;
battleInit(pt1,pt2);
while(liveCharacter(pt1) && liveCharacter(pt2)){
	println(`--- turn:${battleTurn} ---`);
	Elise.attack(Ymir);
	println('');
	Ymir.attack(Elise);
	println('');
	battleTurn++;
}

function liveCharacter(characters){
	return characters.some(c => c.isAlive());
}

function battleInit(pt1,pt2){
	const allCharacter = [...pt1,...pt2];
	allCharacter
	.forEach(c => c.skills.filter(s => s.timing === Skill.timing.init)
							.forEach(s => s.fire(c))
	)
}