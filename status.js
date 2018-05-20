class Status {
	constructor(atk,hp,def,crit,critDmg,agi){
		this.atk = atk;
		this.buffedAtk = atk;
		this.hp = hp;
		this.maxHp = hp;
		this.def = def;
//		this.def2 = (100-def)*0.01;
		this.crit = crit;
		this.critDmg = critDmg;
		this.agi = agi;
//		this.agi2 = agi*0.01;
	}
}

module.exports = Status;