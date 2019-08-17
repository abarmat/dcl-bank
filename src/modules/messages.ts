// TODO: what about dismissing after a time
// TODO: dialog system?

export class MessageBubble extends Entity {
  textShape: TextShape

  constructor(text?: string) {
    super()

    // background and frame
    const frameObj = new Entity()
    frameObj.addComponent(new BoxShape())
    frameObj.addComponent(
      new Transform({
        scale: new Vector3(40, 20, 1)
      })
    )
    frameObj.setParent(this)

    // text
    this.textShape = new TextShape()
    this.textShape.billboard = false
    this.textShape.height = 200
    this.textShape.width = 400
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

  say(text: string) {
    this.text = text
  }

  dismiss() {
    this.text = ''
  }
}

export class TalkSystem implements ISystem {
  cache = {}

  getBubbleForEntity(entity) {
    let bubble = this.cache[entity]

    if (!bubble) {
      bubble = new MessageBubble()
      bubble.getComponentOrCreate(Transform).position.set(0, 60, 0) // TODO: take into account entity height
      bubble.setParent(entity)
      this.cache[entity] = bubble
    }

    return bubble
  }

  removeBubbleForEntity(entity) {
    const bubble = this.cache[entity]
    engine.removeEntity(bubble)
    delete this.cache[entity]
  }

  update(dt: number) {
    const talkers = engine.getComponentGroup(Talk)
    for (let entity of talkers.entities) {
      const talk = entity.getComponent(Talk)
      const bubble = this.getBubbleForEntity(entity)

      bubble.textShape.value = talk.text

      if (!talk.text) {
        this.removeBubbleForEntity(entity)
      }
    }
  }
}
