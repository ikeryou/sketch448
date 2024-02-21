import { Color, Mesh, MeshBasicMaterial, Shape, ShapeGeometry, Vector2 } from "three"
import { MyObject3D } from "../webgl/myObject3D"
import { Util } from "../libs/util";
import { Val } from "../libs/val";
import { Tween } from "../core/tween";

export class Item extends MyObject3D {

  private _mesh: Mesh
  private _baseCol: Color
  private _tgCol: Color
  private _flushVal: Val = new Val(0)
  private _speed: number = 1

  constructor(_id:number, v0:Vector2, v1:Vector2, v2:Vector2) {
    super()

    // this._c = Util.randomInt(0, 1000)
    this._c = _id * 0.5
    // this._speed = 1 * (Util.hit(2) ? 1 : -1)

    this._flushVal.isUse = false

    const shape = new Shape();
    shape.moveTo(v0.x, v0.y);
    shape.lineTo(v1.x, v1.y);
    shape.lineTo(v2.x, v2.y);
    shape.lineTo(v0.x, v0.y);
    const geo = new ShapeGeometry(shape);

    this._baseCol = new Color(0x000000).offsetHSL(Util.random(0.5, 0.75), 1, 0.5)
    this._tgCol = new Color(0x000000).offsetHSL(Util.random(0, 1), 1, 0)

    this._mesh = new Mesh(
      geo,
      new MeshBasicMaterial({
        color:this._baseCol,
        transparent:true,
        // wireframe: true,
        opacity: 1,
      })
    )
    this.add(this._mesh);

    this._resize()
  }


  public flush(d: number):void {
    const t = 0.15
    Tween.a(this._flushVal, {
      val: [0, 1]
    }, t, d, Tween.Power2EaseOut, () => {
      this._flushVal.isUse = true
      this._update()
    }, null, () => {
      Tween.a(this._flushVal, {
        val: 0
      }, t, 0, Tween.Power2EaseInOut, null, null, () => {
        this._update()
        this._flushVal.isUse = false
      })
    })
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    this._flushVal.val = Util.map(Math.sin(this._c * 0.1 * this._speed), 0, 1, -1, 1)

    const col = this._baseCol.clone().lerp(this._tgCol, this._flushVal.val)
    ;(this._mesh.material as MeshBasicMaterial).color = col
    // ;(this._mesh.material as MeshBasicMaterial).opacity = Util.map(this._flushVal.val, 0, 1, 0, 1)

    const s = Util.map(this._flushVal.val, 0.9, 1, 0, 1)
    this.scale.set(s, s, s)

  }
}