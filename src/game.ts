import { Bank } from './modules/structures'
import { BatmanNPS } from './modules/nps'
import { Talk, TalkSystem, PlainDialogue } from './modules/messages'

engine.addSystem(new TalkSystem())

//
const bank = new Bank()
engine.addEntity(bank)

//
const nps = new BatmanNPS()
engine.addEntity(nps)
bank.setGuard(nps)

//
const dialogue = new PlainDialogue()
dialogue.addMessage('Talk to Batman, he is a good fellow', 20)
dialogue.addMessage('Not all Batmans are equal', 5)
dialogue.addMessage('Inflation has always a monetary cause', 5)
dialogue.addMessage('ah re', 5)

nps.getComponent(Talk).play(dialogue)
// nps.getComponent(Talk).say('Talk to Batman, he is a good fellow', 20)
