import { NPS } from 'nps'

export class Bank extends Entity {
  nps: NPS = null

  constructor() {
    super()

    this.addComponent(new GLTFShape('models/isometric_bank/bank.gltf'))
    this.addComponent(
      new Transform({
        position: new Vector3(8, 0, 9), // TODO: change according to parcel size
        rotation: Quaternion.Euler(0, 180, 0),
        scale: new Vector3(0.1, 0.1, 0.1)
      })
    )
  }

  setGuard(nps) {
    nps.addComponent(
      new Transform({
        position: new Vector3(0, 0, 48),
        scale: new Vector3(0.5, 0.5, 0.5)
      })
    )
    nps.setParent(this)

    this.nps = nps
  }
}
