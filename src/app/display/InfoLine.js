import {AppG} from "../../casino/AppG";
import {InfoLineBase} from "./InfoLineBase";

export class InfoLine extends InfoLineBase {
    /**
     * @param {OMY.OContainer} container
     */
    constructor(container) {
        super(container);

        this._freeText = "";
        /** @type {OMY.OMultiStyleTextFont} */
        this._tField = this._graphic.getChildByName("t_value");

        this._startGame();
    }

    _onLocChanged() {
        if (this._freeText.length) {
            this._freeText = this._getText("gui_total_win_title") + ": " + this._freeWinValue + AppG.currency;
        }
        super._onLocChanged();
    }

    _stateUpdate(state) {
        this._infoText = this._freeText;
        super._stateUpdate(state);
        if (this._tField.text !== this._infoText)
            this._tField.text = this._infoText;
    }

    _updateDefaultState() {
        super._updateDefaultState();
    }

    _updateSkipState() {
        if (!AppG.isHaveSkip) return;
        super._updateSkipState();
        if (!OMY.Omy.isDesktop && !AppG.isFreeGame && !AppG.isTurbo)
            this._infoText += ((AppG.isFreeGame) ? "\n" : "") + this._getText("gui_skip");
    }

    _startGame() {
        if (AppG.isFreeGame) {
            this._updateWinFreeValue();
            this._freeText = this._getText("gui_total_win_title") + ": " + this._freeWinValue + AppG.currency;
        }
        super._startGame();
    }

    _onFreeGameBegin() {
        super._onFreeGameBegin();
        this._freeText = this._getText("gui_total_win_title") + ": " + this._freeWinValue + AppG.currency;
        OMY.Omy.add.timer(1, this._stateUpdate, this);
    }

    _onFreeGameEnd() {
        OMY.Omy.add.timer(1, () => {
            this._freeText = "";
            this._stateUpdate(this.C_DEFAULT);
        }, this);
    }
}
