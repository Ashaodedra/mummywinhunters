import {AppG} from "../../casino/AppG";
import {InfoLineBase} from "./InfoLineBase";

export class InfoLineV extends InfoLineBase {
    /**
     * @param {OMY.OContainer} container
     */
    constructor(container) {
        super(container);

        this._freeText = "";
        /** @type {OMY.OTextBitmap} */
        this._tSkipField = this._graphic.getChildByName("t_skip");
        this._tSkipField.visible = false;
        /** @type {OMY.OTextBitmap} */
        this._tWinField = this._graphic.getChildByName("t_win");
        /** @type {OMY.OSprite} */
        this._sWinBg = this._graphic.getChildByName("s_panel_win");
        this._sWinBg.visible = false;

        this._startGame();
    }

    _onLocChanged() {
        if (this._freeText.length) {
            this._freeText = this._getText("gui_total_win_title") + ": " + this._freeWinValue/* + AppG.currency*/;
        }
        super._onLocChanged();
    }

    _stateUpdate(state) {
        super._stateUpdate(state);
        if (this._tWinField.text !== this._freeText)
            this._tWinField.text = this._freeText;
    }

    _updateDefaultState() {
        super._updateDefaultState();
        this._tSkipField.visible = false;
    }

    _updateSkipState() {
        if (!AppG.isHaveSkip) return;
        super._updateSkipState();
        this._tSkipField.visible = !AppG.isFreeGame && !AppG.isTurbo;
    }

    _startGame() {
        if (AppG.isFreeGame) {
            this._updateWinFreeValue();
            this._freeText = this._getText("gui_total_win_title") + ": " + this._freeWinValue/* + AppG.currency*/;
        }
        super._startGame();
    }

    _onFreeGameBegin() {
        super._onFreeGameBegin();
        this._freeText = this._getText("gui_total_win_title") + ": " + this._freeWinValue/* + AppG.currency*/;
        OMY.Omy.add.timer(1, () => {
            this._sWinBg.visible = true;
            this._stateUpdate();
        }, this);
    }

    _onFreeGameEnd() {
        OMY.Omy.add.timer(1, () => {
            this._freeText = "";
            this._sWinBg.visible = false;
            this._stateUpdate(this.C_DEFAULT);
        }, this);
    }
}
