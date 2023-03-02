import {PaytablePageBase} from "../../../../casino/gui/windows/paytable/PaytablePageBase";
import {AppG} from "../../../../casino/AppG";

export class PaytablePage extends PaytablePageBase {
    constructor(gd) {
        super(gd);

        /** @type {OMY.OContainer} */
        this._rtpCanvas = this.getChildByName("c_canvas");
        if (this._rtpCanvas) {
            /** @type {OMY.OTextBitmap} */
            this._tRtp = this._rtpCanvas.canvas.getChildByName("t_rtp");
        }

        this._scatterLabel = this.getChildByName("s_pt_label");
        if (this._scatterLabel) {
            OMY.Omy.loc.addUpdate(this._onLocChange, this);
            this._onLocChange();
        }
    }

    /**     * @private     */
    _onLocChange() {
        if (this._scatterLabel) {
            for (let key in this._scatterLabel.json["loc"]) {
                if (OMY.OMath.inArray(this._scatterLabel.json["loc"][key], AppG.language)) {
                    this._scatterLabel.texture = key;
                    break;
                }
            }
        }
    }

    revive() {
        super.revive();
        if (this._rtpCanvas) {
            OMY.Omy.add.formatObjectsByY(this._rtpCanvas.canvas);
            this._rtpCanvas.alignContainer();
        }
    }

    kill() {
        super.kill();
    }

    destroy(apt) {
        if (this._scatterLabel) {
            OMY.Omy.loc.removeUpdate(this._onLocChange, this);
            this._scatterLabel = null;
        }
        this._rtpCanvas = null;
        super.destroy(apt);
    }

    _updateBet() {
        super._updateBet();
    }
}
