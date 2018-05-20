const Skill = require('./Skill');
const Buff = require('./Buff');
const Option = require('./Option');
const [Some,None] = [Option.Some,Option.None]

let id = 0;

class Character {
	constructor(name,type,stats,skills){
		this.name = name;
		this.type = type;
		this.stats = stats;
		this.skills = skills;
		this.state = {
			buff : [],
			debuff : [],
			barrierRate : 0,
			charge : false
		}
		this.id = id;
		id++;
	}

	attack(trg){
		console.log(`${this.name} attack to ${trg.name}`);
		this.skills.forEach( skill => {
			if(skill.timing.includes === Skill.timing.beAtk){
				skill.fire(this,trg);
			}
		});
		trg.recvAtk(this,this.stats.atk);
		fireBuff(trg,this,Buff.timing.afDef);

		this.skills.forEach( skill => {
			if(skill.timing === Skill.timing.afAtk){
				skill.fire(this,trg);
			}
		});

		trg.stats.hp = Math.min(trg.stats.hp,trg.stats.maxHp);
		this.state.charge = false;
	}

	charge(){ this.state.charge = true }

	isAlive(){ return this.stats.hp > 0 }

	recvAtk(dealer,damage){
		const beHp = this.stats.hp;
		this.state.barrierRate = 0;
		fireBuff(this,dealer,Buff.timing.damage);
		const damageA = calc(damage,100-this.stats.def); // 防御軽減
		const damageB = calc(damageA,(100-this.state.barrierRate)); // シールド軽減
		const dodged = this.stats.agi*0.01 >= Math.random();
		if(dodged) console.log(`${this.name} dodged!`);
		const damageC = dodged ? calc(damageB,65) : damageB;
		const crited = dealer.stats.crit*0.01 >= Math.random();
		if(crited) console.log(`${dealer.name} critical!`);
		const damageD = crited ? calc(damageC,dealer.stats.critDmg+100) : damageC;
		this.stats.hp -= damageD;

		console.log(`${this.name}:HP[${beHp}] -> [${this.stats.hp}]\t// damage:${damageC} (atk:${damage} * d:${this.stats.def} * b:${this.state.barrierRate} * cd:${dealer.stats.critDmg})`);
	}

	debuff(debuff){ 
		if(debuff.effTurn === 0) return;
		const sameDebuff = Some(this.state.debuff.findIndex(v => v.id === debuff.parent.id && v.name === debuff.name));
		sameDebuff.foreach(v => this.state.debuff.splice(v,1));
		this.state.debuff.push(debuff);
	}

	buff(buff){ 
		if(buff.effTurn === 0) return;
		const sameBuff = Some(this.state.buff.findIndex(v => v.id === buff.parent.id && v.name === buff.name));
		sameBuff.foreach(v => this.state.buff.splice(v,1));
		this.state.buff.push(buff);
	}

}

const fireBuff = (self,one,timing) => self.state.buff
									.filter(b => b.timing.includes(timing))
									.forEach(b => b.fire(self,one,timing));

Character.types = {
	atk     : '攻撃',
	def     : '防御',
	magic   : '魔法',
	support : '支援'
}

const calc = (base,rate) => parseInt( ((base*rate) + 99)/100 );

module.exports = Character;

//const skillTiming = 
