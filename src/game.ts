import { Bank } from './modules/structures'
import { BatmanNPS } from './modules/nps'
import { Talk, TalkSystem } from './modules/messages'

engine.addSystem(new TalkSystem())

//
const bank = new Bank()
engine.addEntity(bank)

//
const nps = new BatmanNPS()
engine.addEntity(nps)
bank.setGuard(nps)

//
nps.getComponent(Talk).say('Talk to Batman, he is a good fellow', 30)
