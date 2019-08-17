import { Talk } from './messages'

export class NPS extends Entity {}

export class BatmanNPS extends NPS {
  constructor() {
    super()

    this.addComponent(new GLTFShape('models/lego_batman/scene.gltf'))
    this.addComponent(new Talk())
  }
}
