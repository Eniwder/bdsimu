class Buff {
	constructor(name,timing,effect,effTurn,parent){
		this.name = name;
		this.timing = (typeof timing === 'object') ? timing : [timing];
		this.effect = effect;
		this.effTurn = effTurn;
		this.elapsedTurn = 0;
		this.parent = parent;
		Buff.allBuff.push(this);
	}

	step(){
		this.elapsedTurn++;
		return this.effTurn <= this.elapsedTurn;
	}

	fire(self,one,timing){
		this.effect(self,one,timing);
	}
}

Buff.allBuff = [];

Buff.timing = {
	init  : 'バフ付与時',
	beAtk : '基本攻撃前',
	afAtk : '基本攻撃後',
	beDef : '基本被撃前',
	afDef : '基本被撃後',
	damage : 'ダメージ計算毎',
	death : 'キャラ死亡時'
}

module.exports = Buff;
