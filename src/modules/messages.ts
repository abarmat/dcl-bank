// TODO: what about dismissing after a time
// TODO: dialog system?

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

@Component('talk')
export class Talk {
  text: string
  talkedAt: number
  expiresSeconds: number = null
  bubble: MessageBubble = null

  say(text: string, expiresSeconds?: number) {
    this.text = text
    this.expiresSeconds = expiresSeconds
  }

  dismiss() {
    this.text = null
    this.expiresSeconds = null
  }

  isSilent() {
    return !this.text
  }

  isUpdated() {
    return this.bubble && this.bubble.textShape.value !== this.text
  }

  isExpired() {
    return (
      this.expiresSeconds &&
      this.talkedAt &&
      (Date.now() - this.talkedAt) / 1000 > this.expiresSeconds
    )
  }

  willSay() {
    return !this.bubble && this.text
  }

  willDismiss() {
    return this.bubble && !this.text
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

      if (talk.isExpired()) {
        talk.dismiss()
      }

      if (talk.willDismiss()) {
        this.removeBubble(talkEntity)
        continue
      }

      if (talk.willSay()) {
        this.attachBubble(talkEntity)
      }

      if (talk.isUpdated()) {
        talk.bubble.textShape.value = talk.text
        talk.talkedAt = Date.now()
      }
    }
  }
}
