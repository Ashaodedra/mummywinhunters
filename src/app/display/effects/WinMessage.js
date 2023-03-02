import {WinMessageBase} from "../../../casino/display/win/WinMessageBase";
import {GameConstStatic} from "../../GameConstStatic";
import {AppG} from "../../../casino/AppG";
import {AppConst} from "../../../casino/AppConst";

let _incAnim = false;

export class WinMessage extends WinMessageBase {
    constructor(graphic) {
        super(graphic);
        this.C_TYPE_WIN = "none";
        this.C_TYPE_BIG = "big";
        this.C_TYPE_EPIC = "epic";

        this._txtWin.lastText = ",";
        /** @type {OMY.OContainer} */
        this._labelCanvas = graphic.getChildByName("c_label");
        /** @type {OMY.OSprite} */
        this._label = this._labelCanvas.canvas.getChildByName("s_label");
        this._labelCanvas.kill();
        /** @type {OMY.ORevoltParticleEmitter} */
        this._coins = graphic.getChildByName("re_coins_top");
        this._coins.kill();
        OMY.Omy.loc.addUpdate(this._locUpdate, this, false);
        AppG.sizeEmmit.on(AppConst.EMIT_RESIZE, () => {
            if (this._coins.active) {
                this._coins.particle.settings.floorY = OMY.Omy.HEIGHT * 1.5;

            }
        });
        this._txtWin.onStepInc = this._update.bind(this);
        this._winCoef = 0;

        if (this._gdConf.hasOwnProperty("active_debug")) {
            this._debugMessage = true;
            const debConst = this._gdConf["active_debug"].split(":");
            AppG.winCredit = debConst[1];
            AppG.winCoef = AppG.winCredit / AppG.serverWork.betForLimit;
            AppG.getTimeByWinValue(AppG.winCredit, AppG.gameConst.getData("show_win_conf"), true);
            switch (debConst[0]) {
                case this.C_TYPE_BIG: {
                    OMY.Omy.add.timer(0.6, this._showBigWinMessage, this);
                    break;
                }
                case this.C_TYPE_EPIC: {
                    OMY.Omy.add.timer(0.6, this._showEpicWinMessage, this);
                    break;
                }
                case "mega": {
                    OMY.Omy.add.timer(0.6, this._showMegaWinMessage, this);
                    break;
                }

                default: {
                    OMY.Omy.add.timer(0.6, this._showSimpleWinMessage, this);
                    break;
                }
            }
        }
    }

    //-------------------------------------------------------------------------
    // PRIVATE
    //-------------------------------------------------------------------------

    /**
     * Show win message
     * @param {string} [winSize="big_win"]
     */
    _showWinMessage(winSize = "big") {
        super._showWinMessage(winSize);
        this._skiping = false;
        this._txtWin.visible = true;

        this._txtWin.alpha = 0;
        this._txtWin.scale.set(0);
        this._txtWin.setNumbers(0, false);
        OMY.Omy.remove.tween(this._txtWin);
        this._labelCanvas.kill();
        AppG.emit.emit(AppConst.APP_START_INC_WIN, AppG.winCredit, AppG.incTimeTake);
        _incAnim = false;
        this._isCheckLimits = false;
        this._checkPartCount = 1;
        this._maxWinType = winSize;
        let pos;

        switch (this._maxWinType) {
            case this.C_TYPE_BIG: {
                // OMY.Omy.navigateBtn.updateState(AppConst.C_BLOCK);
                this._currentWinLvl = this.C_TYPE_WIN;
                this._checkPartCount = 2;
                this._txtWin.scale.set(0.5);
                AppG.showWinTime = AppG.incTimeTake/* + this._gdConf["bonus_delay"]*/;
                OMY.Omy.sound.play(GameConstStatic.S_big_win, true);
                this._isCheckLimits = true;
                this._needCoefLimit = (1 / this._checkPartCount) * AppG.winCoef;

                OMY.Omy.sound.play(GameConstStatic.S_big_win);
                OMY.Omy.sound.play(GameConstStatic.S_take_take, true);
                break;
            }

            default: {
                OMY.Omy.sound.play(GameConstStatic.S_take_take, true);
                AppG.showWinTime = AppG.incTimeTake;
                this._currentWinLvl = this.C_TYPE_WIN;
            }
        }

        this._txtWin.incSecond = AppG.incTimeTake;
        this._txtWin.setNumbers(AppG.winCredit, true);
        OMY.Omy.add.tween(this._txtWin, {
            alpha: 1,
            scaleX: 1, scaleY: 1,
            ease: "back.out(1.7)",
        }, this._gdConf["time_show"], null);

        pos = this._gdConf["position"]["none"];
        this._txtWin.x = pos.x;
        this._txtWin.y = pos.y;

        this._timeHideMessage = this._gdConf["time_hide"];
        if (!this._debugMessage)
            this._lineTimer = OMY.Omy.add.timer(AppG.showWinTime, this._hideWinMessage, this);

        AppG.updateGameSize(this._graphic);
        this._startHide = false;
        _incAnim = true;

        /*if (AppG.skippedWin &&
            (this._maxWinType === this.C_TYPE_BIG || this._maxWinType === this.C_TYPE_EPIC) &&
            this._timerForceSkip) {
            this._timerForceSkip.destroy();
            this._timerForceSkip = OMY.Omy.add.timer(this._gdConf["skip_big_win_time"], this._skipWinAnimations, this);
        }*/
    }

    /**     * @private     */
    _update(value) {
        if (this._isCheckLimits) {
            this._winCoef = value / AppG.serverWork.betForLimit;
            if (this._winCoef >= this._needCoefLimit) {
                this._changeWinLimit();
            }
        }
    }

    /**     * @private     */
    _changeWinLimit() {
        let pos = null;
        switch (this._currentWinLvl) {
            case this.C_TYPE_WIN: {
                this._isCheckLimits = false;
                this._currentWinLvl = this.C_TYPE_BIG;
                this._needCoefLimit = Number.MAX_VALUE;

                this._labelCanvas.revive();
                this._labelCanvas.alpha = 0;
                this._labelCanvas.scale.set(0);
                OMY.Omy.add.tween(this._labelCanvas, {
                    alpha: 1,
                    scaleX: 1, scaleY: 1,
                    ease: "back.out(1.7)",
                }, this._gdConf["time_show"] - 0.2, null);
                this._checkLock();

                pos = this._gdConf["position"]["big"];
                OMY.Omy.add.tween(this._txtWin, {
                    x: pos["x"],
                    y: pos["y"],
                    ease: "none",
                }, 0.3);

                this._coins.revive();
                this._coins.particle.settings.floorY = OMY.Omy.HEIGHT * 1.5;
                this._coins.addCompleted(this._needClearCoin, this, false);
                this._coins.start();
                break;
            }
        }
    }

    /**     * @private     */
    _locUpdate() {
        this._checkLock();
    }

    /**     * @private     */
    _checkLock() {
        this._label.texture = this._label.json["locTexture"][AppG.language];
        this._labelCanvas.alignContainer();
    }

    /**     * @private     */
    _onCompleteIncBonus() {
        this._txtWin.onCompleteInc = null;
        AppG.emit.emit("close_show_message");
    }

    _onShowWinValue() {
        super._onShowWinValue();
    }

    _onCompleteIncWin() {
        this._isCheckLimits = false;
        if (_incAnim) {
            _incAnim = false;
            OMY.Omy.sound.stop(GameConstStatic.S_take_take);
            if (OMY.Omy.sound.isSoundPlay(GameConstStatic.S_big_win)) {
                OMY.Omy.sound.stop(GameConstStatic.S_big_win);
                OMY.Omy.sound.play(GameConstStatic.S_big_win_END);
            }
            OMY.Omy.remove.tween(this._txtWin);
            this._txtWin.stopInctAnimation();
            this._txtWin.setNumbers(this._txtWin.value);

            this._coins.active && this._coins.stop();
            AppG.emit.emit(AppConst.APP_SHOW_WIN, (AppG.isRespin) ? AppG.totalWinInSpin : AppG.winCredit, true);
            super._onCompleteIncWin();
        }
    }

    /**     * @private     */
    _skipWinAnimations() {
        if (!this._graphic.visible) return;
        if (this._skiping) return;
        if (OMY.Omy.sound.isSoundPlay(GameConstStatic.S_big_win)) {
            OMY.Omy.sound.stop(GameConstStatic.S_big_win);
            OMY.Omy.sound.play(GameConstStatic.S_big_win_END);
        }
        this._onCompleteIncWin();

        this._lineTimer?.destroy();
        this._skiping = true;
        let forceEnd = false;

        if (this._maxWinType !== this._currentWinLvl) {
            this._currentWinLvl = this._maxWinType;
            let pos = null;
            switch (this._currentWinLvl) {
                case this.C_TYPE_BIG: {
                    forceEnd = true;
                    if (!this._labelCanvas.active) {
                        this._labelCanvas.revive();
                        this._labelCanvas.alpha = 0;
                        this._labelCanvas.scale.set(0);
                        OMY.Omy.add.tween(this._labelCanvas, {
                            alpha: 1,
                            scaleX: 1, scaleY: 1,
                            ease: "back.out(1.7)",
                        }, 0.3, null);
                        this._checkLock();

                        OMY.Omy.remove.tween(this._txtWin);
                        pos = this._gdConf["position"]["big"];
                        OMY.Omy.add.tween(this._txtWin, {
                            x: pos["x"],
                            y: pos["y"],
                            ease: "none",
                        }, 0.1);
                    }
                    break;
                }
            }
        }
        this._currentWinLvl = this._maxWinType;
        if (!this._startHide) {
            this._txtWin.alpha = 1;
            this._txtWin.scale.set(1);
            if (forceEnd) OMY.Omy.add.timer(this._gdConf["skip_bigWin_delay"], this._hideWinMessage, this);
            else this._hideWinMessage();

        }
    }

    /**     * @private     */
    _needClearCoin() {
        this._coins.kill();
    }

    _hideWinMessage() {
        this._onCompleteIncWin();

        this._isCheckLimits = false;
        this._lineTimer?.destroy();
        this._startHide = true;
        OMY.Omy.remove.tween(this._txtWin);
        OMY.Omy.remove.tween(this._labelCanvas);
        this._timerHideDelay = OMY.Omy.add.timer(this._gdConf["screen_delay"], this._delayHideMess, this);
    }

    /**     * @private     */
    _delayHideMess() {
        this._timerHideDelay = null;
        OMY.Omy.add.tween(this._txtWin, {
            alpha: 0,
            scaleX: this._gdConf["hide_scale"], scaleY: this._gdConf["hide_scale"],
            ease: "none",
        }, this._timeHideMessage, this._messageClear.bind(this));
        if (this._labelCanvas.active) {
            OMY.Omy.add.tween(this._labelCanvas, {
                alpha: 0,
                ease: "none",
            }, this._timeHideMessage);
        }
    }

    _messageClear() {
        this._timerHideDelay?.destroy();
        this._timerHideDelay = null;
        this._lineTimer?.destroy();
        OMY.Omy.remove.tween(this._txtWin);
        OMY.Omy.remove.tween(this._labelCanvas);
        this._labelCanvas.kill();
        AppG.emit.emit(AppConst.APP_STOP_WIN_PARTICLES);
        super._hideWinMessage();
    }

    static get incAnim() {
        return _incAnim;
    }
}
