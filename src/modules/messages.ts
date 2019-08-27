// TODO: dialog system?
// TODO: add some videogame audio

export class MessageBubble extends Entity {
  static defaultTexture: Texture = new Texture('models/mau.png')
  textShape: TextShape

  constructor(text?: string) {
    super()

    // background and frame
    const material = new BasicMaterial()
    material.texture = MessageBubble.defaultTexture

    const frameObj = new Entity()
    frameObj.addComponent(new PlaneShape())
    frameObj.addComponent(material)
    frameObj.addComponent(
      new Transform({
        scale: new Vector3(40, 20, 1), // TODO: params for size
        rotation: Quaternion.Euler(180, 0, 0)
      })
    )
    frameObj.setParent(this)

    // text
    this.textShape = new TextShape()
    this.textShape.billboard = false
    this.textShape.height = 200
    this.textShape.width = 300
    this.textShape.resizeToFit = true
    this.textShape.color = Color3.Black()
    this.textShape.fontSize = 24
    this.textShape.fontWeight = 'bold'
    this.setMessage(text || '')

    const textObj = new Entity()
    textObj.addComponent(this.textShape)
    textObj.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 180, 0),
        position: new Vector3(0, 0, 1)
      })
    )
    textObj.setParent(this)
  }

  setMessage(text: string) {
    this.textShape.value = text
  }
}

export class Message {
  text: string
  expiresSeconds: number
  saidAt: number

  constructor(text: string, expiresSeconds?: number) {
    this.text = text
    this.expiresSeconds = expiresSeconds
  }

  isExpired() {
    return (
      this.expiresSeconds &&
      this.saidAt &&
      (Date.now() - this.saidAt) / 1000 > this.expiresSeconds
    )
  }
}

export abstract class Dialogue {
  abstract next()
}

export class PlainDialogue extends Dialogue {
  items: Message[] = []
  step: number = 0

  addMessage(text: string, expiresSeconds?: number) {
    this.items.push(new Message(text, expiresSeconds))
  }

  next() {
    return this.items[this.step++]
  }
}

@Component('talk')
export class Talk {
  dialogue: Dialogue
  message: Message
  bubble: MessageBubble

  play(dialogue: Dialogue) {
    this.dialogue = dialogue
    this.message = this.dialogue.next()
  }

  say(text: string, expiresSeconds?: number) {
    this.message = new Message(text, expiresSeconds)
  }

  dismiss() {
    this.message = null
    this.dialogue = null
  }

  next() {
    this.message = this.dialogue ? this.dialogue.next() || null : null
  }

  isUpdated() {
    return this.isTalking() && this.bubble.textShape.value !== this.message.text
  }

  isTalking() {
    return this.bubble && this.message
  }

  willSay() {
    return !this.bubble && this.message
  }

  willDismiss() {
    return this.bubble && !this.message
  }
}

export class TalkSystem implements ISystem {
  private spawnBubble(talkEntity) {
    const bubble = new MessageBubble()
    bubble.getComponentOrCreate(Transform).position.set(0, 60, 0) // TODO: take into account entity height
    bubble.setParent(talkEntity)
    return bubble
  }

  private attachBubble(talkEntity) {
    const talk = talkEntity.getComponent(Talk)

    if (!talk.bubble) {
      talk.bubble = this.spawnBubble(talkEntity)
    }

    return talk.bubble
  }

  private removeBubble(talkEntity) {
    const talk = talkEntity.getComponent(Talk)
    engine.removeEntity(talk.bubble)
    talk.bubble = null
  }

  update(dt: number) {
    const talkers = engine.getComponentGroup(Talk)
    for (let talkEntity of talkers.entities) {
      const talk = talkEntity.getComponent(Talk)

      if (talk.message.isExpired()) {
        talk.next()
      }

      if (talk.willDismiss()) {
        this.removeBubble(talkEntity)
        continue
      }

      if (talk.willSay()) {
        this.attachBubble(talkEntity)
      }

      if (talk.isUpdated()) {
        talk.bubble.textShape.value = talk.message.text
        talk.message.saidAt = Date.now()
      }
    }
  }
}
