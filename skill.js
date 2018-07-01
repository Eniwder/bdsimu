const Buff = require('./Buff');
const level2Str = ['','I','II','III','IV','V'];

class Skill {
	constructor(name,timing,effect,effTurn){
		this.name = name;
		this.timing = timing;
		this.effect = effect;
		this.effTurn = effTurn;
	}
	fire(self,trg){
		console.log(`${self.name} の ${this.name} 発動`);
		this.effect(self,trg);
	}
}

Skill.timing = {
	init : '戦闘開始時',
	beAtk : '基本攻撃前',
	inAtk : '基本攻撃後',
	afAtk : '攻撃後',
	beDef : '基本被撃前',
	afDef : '基本被撃後',
	death : 'キャラ死亡時'
}

Skill.invalidation = (level,timing,effTurn) => {
	const name = `無効化${level2Str[level]}`;
	const effect = (self,trg) => {
		const invalidationEff = trg => trg.state.buff = [];
		const debuff = new Buff(name,Buff.timing.init,invalidationEff,0,self);
		trg.debuff(debuff);
		if(level === 1) return;
		Skill.sealBuff(self,timing,effTurn).fire(self,trg);
	}
	return new Skill(name,timing,effect,effTurn);
}

Skill.sealBuff = (timing,effTurn) => {
	const name = 'バフ封印';
	const effect = (self,trg) => {
		const debuff = new Buff(name,Buff.timing.init,Buff.mark.seal,effTurn,self);
		trg.debuff(debuff);
	}
	return new Skill(name,timing,effect,effTurn);
} 

Skill.charm = (effTurn) => {
	const name = '誘惑';
	const effect = (self,trg) => {
		const debuff = new Buff(name,Buff.timing.beAtk,Buff.mark.charm,effTurn,self);
		trg.debuff(debuff);
	}
	return new Skill(name,Skill.timing.afAtk,effect,effTurn);
}

Skill.additionalAtk = (name,effect) => new Skill(name,Skill.timing.afAtk,effect,0);

Skill.threatBlow = (maxHpRate) => {
	const effect = (self,trg) => trg.recvAtk(self,calc(self.stats.maxHp,maxHpRate));
	return Skill.additionalAtk('脅威の一撃',effect)
}

Skill.passive = (name,effect) => new Skill(name,Skill.timing.init,effect,-1);

Skill.absorb = (level,healRate,defRate) => {
	const name = `吸収${level2Str[level]}`;
	const effect = (self,trg) => {
		const absorbEff = (self,dealer,timing) => {
			if(timing === Buff.timing.damage){
				self.state.barrierRate += 50;
			}else if(timing === Buff.timing.afDef){
				const heal = calc(self.stats.maxHp,healRate);
				console.log(`${self.name} の ${name} 発動\t\t// heal:${heal}`);
				self.stats.hp += heal;
			}
		}
		const buff = new Buff(name,[Buff.timing.afDef,Buff.timing.damage],absorbEff,-1,self);
		self.buff(buff);
	}
	return Skill.passive(name,effect);
}

Skill.debuffImmunity = () => {
	const name = `デバフ免疫(永続)`;
	const effect = (self,trg) => {
		return Skill.passive(name,Buff.mark.debuffImmunity);
	}
}

Skill.allImmunity = () => {
	const name = `永続全免疫`;
	const effect = (self,trg) => {
		return Skill.passive(name,Buff.mark.allImmunity);
	}
}

Skill.disAtkImmunity = () => {
	const name = `攻撃妨害免疫`;
	const effect = (self,trg) => {
		return Skill.passive(name,Buff.mark.allImmunity);
	}
}

const calc = (base,rate) => parseInt( (base * rate + 99) / 100 );

module.exports = Skill;
