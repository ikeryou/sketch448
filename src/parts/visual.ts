import { Object3D, Vector2 } from "three"
import Delaunator from "delaunator";
import { Canvas } from "../webgl/canvas"
import { Item } from "./item"
import { Func } from "../core/func"
import { Util } from "../libs/util"
import { Tween } from "../core/tween";

export class Visual extends Canvas {

  private _con: Object3D
  private _item: Array<Item> = []
  private _txt: HTMLElement

  constructor(opt:any) {
    super(opt)

    this._txt = document.querySelector('.l-main p') as HTMLElement

    this._con = new Object3D()
    this.mainScene.add(this._con)

    const sw = Func.sw() * 1.5
    const sh = Func.sh() * 0.5

    const t:Array<Array<number>> = [];
    // t.push([-sw * 0.5, sh * 0.5]);
    // t.push([sw * 0.5, sh * 0.5]);
    // t.push([sw * 0.5, -sh * 0.5]);
    // t.push([-sw * 0.5, -sh * 0.5]);

    const triNum = Func.val(150, 150);
    for(let l = 0; l < triNum; l++) {
      t.push([Util.random(-sw * 0.5, sw * 0.5), Util.random(-sh * 0.5, sh * 0.5)]);
    }
    const r = Delaunator.from(t);

    const tri = r.triangles
    let i = 0
    while(i < tri.length) {
      const a = tri[i + 0]
      const b = tri[i + 1]
      const c = tri[i + 2]
      const item = new Item(
        i / 3,
        new Vector2(t[a][0], t[a][1]),
        new Vector2(t[b][0], t[b][1]),
        new Vector2(t[c][0], t[c][1]),
      );
      this._con.add(item);
      this._item.push(item);
      i += 3
    }

    console.log(this._item.length)


    this._resize()
  }


  _update():void {
    super._update()

    const rad = Util.radian(this._c * 5)
    const range = 10
    Tween.set(this._txt, {
      x: Math.cos(rad) * range,
      y: Math.sin(-rad * 0.82) * range,
      // scale: Util.map(Math.sin(rad * 1.22), 0.95, 1, -1, 1),
      rotationZ: Math.sin(rad * 0.42) * 2,
    })
    Tween.set(this.el, {
      x: Math.cos(rad) * range,
      y: Math.sin(-rad * 0.82) * range,
      scale: Util.map(Math.sin(rad * 1.22), 0.95, 1, -1, 1),
      rotationZ: Math.sin(rad * 0.42) * 2,
    })

    if(this.isNowRenderFrame()) {
      this._render()
    }
  }

  _render():void {
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.render(this.mainScene, this.cameraOrth)
  }

  isNowRenderFrame():boolean {
    return true
  }

  _resize():void {
    super._resize()

    const w = Func.sw()
    const h = Func.sh()

    this.renderSize.width = w
    this.renderSize.height = h

    this._updateOrthCamera(this.cameraOrth, w, h)

    let pixelRatio:number = window.devicePixelRatio || 1
    this.renderer.setPixelRatio(pixelRatio)
    this.renderer.setSize(w, h)
  }
}