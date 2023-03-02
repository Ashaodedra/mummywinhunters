import {SlotSymbolBase} from "../../../casino/display/reels/SlotSymbolBase";
import {AppConst} from "../../../casino/AppConst";
import {AppG} from "../../../casino/AppG";
import {GameConstStatic} from "../../GameConstStatic";

export class SlotSymbol extends SlotSymbolBase {
    constructor(reelIndex, reelParent, symbolIndex) {
        super(reelIndex, reelParent, symbolIndex);
        this.blockSymbName = this._gdConf["blockSymbName"];
    }

    //-------------------------------------------------------------------------
    // PRIVATE
    //-------------------------------------------------------------------------
    holdSymbol() {
        this.updateStateImg(AppConst.SLOT_SYMBOL_NO_WIN);
        this._isHold = true;
        if (OMY.OMath.inArray(AppG.gameConst.getData("longReelSymbol"), this._imageName)) {
            this._symbolS.visible = false;
            /** @type {OMY.OActorSpine} */
            this._effect = OMY.Omy.add.actorJson(this, this._gdConf["wait"]);
            this._effect.play(true);
        }
    }

    unHoldSymbol() {
        this._isHold = false;
        this.updateStateImg(AppConst.SLOT_SYMBOL_NONE);
    }

    _noWinState() {
        super._noWinState();
        this._stateName = this.blockSymbName;
    }

    _defeatState() {
        if (this._effect) {
            this._effect.stop();
            this._effect.kill();
            this._effect = null;
            this._symbolS.visible = true;
        }
        if (this._symbolBg) {
            this._symbolBg.destroy();
            this._symbolBg = null;
        }
        super._defeatState();
    }

    updateStateImg(st) {
        if (this._isHold) return;
        return super.updateStateImg(st);
    }

    scatterFree(loop = false) {
        if (AppG.gameConst.isScatterSymbol(this._imageName)) {
            this._symbolS.visible = false;
            /** @type {OMY.OActorSpine} */
            this._effect = OMY.Omy.add.actorJson(this, this._gdConf["scatter"]);
            if (!loop)
                this._effect.totalLoop = 2;
            this._effect.gotoAndPlay(0, true);
        }
    }

//-------------------------------------------------------------------------
    // PUBLIC
    //-------------------------------------------------------------------------
}
