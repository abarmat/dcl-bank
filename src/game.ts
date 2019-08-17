import { Bank } from './modules/structures'
import { BatmanNPS } from './modules/nps'
import { Talk, TalkSystem } from './modules/messages'

// function spawnModel(path: string) {
//   const obj = new Entity()
//   obj.addComponent(new GLTFShape(path))
//   engine.addEntity(obj)
//   return obj
// }

engine.addSystem(new TalkSystem())

//
const bank = new Bank()
engine.addEntity(bank)

//
const nps = new BatmanNPS()
engine.addEntity(nps)
bank.setGuard(nps)

//
nps.getComponent(Talk).say('Talk to Batman, he is a good fellow')
