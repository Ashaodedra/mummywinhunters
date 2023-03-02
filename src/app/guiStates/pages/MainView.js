import {GameConstStatic} from "../../GameConstStatic";
import {Background} from "../../display/Background";
import {MainViewBase} from "../../../casino/gui/pages/MainViewBase";
import {LineInGame} from "../../display/LineInGame";
import {AppG} from "../../../casino/AppG";
import {AppConst} from "../../../casino/AppConst";

export class MainView extends MainViewBase {
    constructor() {
        super();
        /** @type {ReelBlock} */
        this._reelBlock = null;
        AppG.emit.on(AppConst.APP_HIDE_WIN_EFFECT, this._cleanWinEffect, this);
        // AppG.emit.on(AppConst.APP_WAIT_REEL, this._stopWaitSymbolReel, this);
    }

    revive() {
        this._bgGraphic = this.getChildByName("c_game_bg");
        this._reelGraphic = this.getChildByName("reels").getChildByName("reel_canvas");

        super.revive();

        if (AppG.gameConst.gameHaveIntro) {
            OMY.Omy.viewManager.showWindow(AppConst.W_INTRO, true,
                OMY.Omy.viewManager.gameUI.getWindowLayer("c_intro_layer"));
        } else {
            OMY.Omy.sound.pauseAll();
            OMY.Omy.sound.resumeAll();
            GameConstStatic.S_game_bg = GameConstStatic.S_bg;
            OMY.Omy.sound.play(GameConstStatic.S_game_bg, true);
        }
    }

    _createGraphic() {
        this.bg = new Background(this._bgGraphic);
        super._createGraphic();

        /** @type {LineInGameParticle} */
        this._lineInGame = new LineInGame(this.getChildByName("c_numbers"), this._reelBlock.activeList);
        this._lineInGame.linesGraphic = this.getChildByName("c_lines");
        // this._lineInGame.hide();

        /*/!** @type {OMY.OContainer} *!/
        this._reelWaitCanvas = this.getChildByName("reels").getChildByName("c_effects");
        this._reelWaitCanvas.setAll("visible", false);
        this._isWaitEffect = false;*/

        /* /!** @type {OMY.OContainer} *!/
         this._freeInFreeMess = this.getChildByName("c_free_in_free").getChildByName("c_free_info");
         this._freeInFreeMess.visible = false;
         if (this._freeInFreeMess.json.test)
             OMY.Omy.add.timer(this._freeInFreeMess.json.test,
                 this.freeInFree, this);*/
        /** @type {OMY.OActorSpine} */
        this._fireWork1 = this.getChildByName("a_fireworks1");
        this._fireWork1.visible = false;
        /** @type {OMY.OActorSpine} */
        this._fireWork2 = this.getChildByName("a_fireworks2");
        this._fireWork2.visible = false;
        AppG.emit.on(AppConst.APP_SHOW_BIG_WIN, this._onShowBigWin, this);
        AppG.emit.on(AppConst.APP_HIDE_MESSAGE_WIN, this._onHideBigWin, this);
    }

    _updateGameSize(dx, dy, isScreenPortrait) {
        super._updateGameSize(dx, dy, isScreenPortrait);
    }

    // region spin:
    //-------------------------------------------------------------------------
    sendSpin() {
        OMY.Omy.sound.play(GameConstStatic.S_reel_bg, true);
        if (OMY.Omy.sound.isSoundPlay(GameConstStatic.S_intro))
            OMY.Omy.sound.stop(GameConstStatic.S_intro);

        super.sendSpin();
    }

    onSendSpin() {
        super.onSendSpin();
    }

    skipSpin() {
        // this._clearWaitEffect();
        if (this._isMoveReels) {
            if (OMY.Omy.sound.isSoundPlay(GameConstStatic.S_reel_bg)) {
                OMY.Omy.sound.stop(GameConstStatic.S_reel_bg);
            }
        }
        super.skipSpin();
    }

    _spinEnd() {
        super._spinEnd();
        // this._clearWaitEffect();

        if (OMY.Omy.sound.isSoundPlay(GameConstStatic.S_reel_bg)) {
            OMY.Omy.sound.stop(GameConstStatic.S_reel_bg);
        }
    }

    //-------------------------------------------------------------------------
    //endregion

    // region scatter wait:
    //-------------------------------------------------------------------------
    /* /!**     * @private     *!/
     _stopWaitSymbolReel(reelId, waitSymbol) {
         if (!this._isWaitEffect) {
             this._isWaitEffect = true;
             for (let i = 0; i < reelId; i++) {
                 for (let j = 0; j < this._reelBlock.activeList[i].length; j++) {
                     this._reelBlock.activeList[i][j].holdSymbol();
                 }
             }
         } else {
             for (let j = 0; j < this._reelBlock.activeList[reelId - 1].length; j++) {
                 this._reelBlock.activeList[reelId - 1][j].holdSymbol();
             }
         }
         this._offWaitEffect();
         this._onWaitEffect(reelId);

     }

     /!**     * @private     *!/
     _offWaitEffect() {
         if (this._activeWaitEffect) {
             OMY.Omy.add.tween(this._activeWaitEffect, {alpha: 0, onCompleteParams: [this._activeWaitEffect]},
                 this._reelWaitCanvas.json["alpha_time"], (spine) => {
                     spine.stop();
                     spine.visible = false;
                 });
             this._activeWaitEffect = null;
         }
     }

     /!**     * @private     *!/
     _onWaitEffect(reelId) {
         if (!OMY.Omy.sound.isSoundPlay(GameConstStatic.S_scatter_wait))
             OMY.Omy.sound.play(GameConstStatic.S_scatter_wait, true);
         this._reelBlock._reelList[reelId].stopMoveSpeed();
         this._activeWaitEffect = this._reelWaitCanvas.getChildByName("reel_" + String(reelId));
         this._activeWaitEffect.visible = true;
         this._activeWaitEffect.alpha = 0;
         this._activeWaitEffect.gotoAndPlay(0, true);
         OMY.Omy.add.tween(this._activeWaitEffect, {alpha: 1},
             this._reelWaitCanvas.json["alpha_time"]);
     }

     /!**     * @private     *!/
     _clearWaitEffect() {
         if (this._isWaitEffect) {
             OMY.Omy.sound.stop(GameConstStatic.S_scatter_wait);
             for (let i = 0; i < this._reelBlock.activeList.length; i++) {
                 for (let j = 0; j < this._reelBlock.activeList[i].length; j++) {
                     this._reelBlock.activeList[i][j].unHoldSymbol();
                 }
             }
             this._isWaitEffect = false;
             this._offWaitEffect();
         }
     }*/

    //-------------------------------------------------------------------------
    //endregion

    // region BONUS GAME: WHEEL
    //-------------------------------------------------------------------------

    _startBonusGame() {
        super._startBonusGame();
    }

    _continueShowBonus() {
        super._continueShowBonus();
    }

//-------------------------------------------------------------------------
    //endregion

    // region FREE GAME
    //-------------------------------------------------------------------------

    startFreeGame() {
        super.startFreeGame();

        OMY.Omy.sound.stop(GameConstStatic.S_game_bg);
        GameConstStatic.S_game_bg = GameConstStatic.S_bg_fg;
    }

    _continueStartFree() {
        if (AppG.serverWork.haveFreeOnStart) {
            super._continueStartFree();
        } else {
            OMY.Omy.sound.play(GameConstStatic.S_scatter_join);
            this._reelBlock.updateToState(AppConst.SLOT_SYMBOL_NO_WIN);
            this._activeList.map((a, index, array) => a.map((b, index, array) => b.scatterFree()));
            OMY.Omy.add.timer(this._gdConf["timer_start_free"], this._showFreeWindow, this);
        }
    }

    /**     * @private     */
    _showFreeWindow() {
        OMY.Omy.sound.stop(GameConstStatic.S_scatter_join);
        OMY.Omy.add.timer(1, () => {
            this._reelBlock.updateToState(AppConst.SLOT_SYMBOL_NONE);
        }, this);
        super._continueStartFree();
    }

    finishFreeGame() {
        super.finishFreeGame();
    }

    _continueEndFree() {
        super._continueEndFree();
    }

    freeInFree() {
        /*this._reelBlock.updateToState(AppConst.SLOT_SYMBOL_NO_WIN);
        this._activeList.map((a, index, array) => a.map((b, index, array) => b.scatterFree(true)));
        OMY.Omy.add.timer(this._gdConf["timer_start_free"], this._showFreeInFreeWindow, this);*/
    }

    /*/!**     * @private     *!/
    _showFreeInFreeWindow() {
        this._freeInFreeMess.visible = true;
        this._freeInFreeMess.alignContainer();
        this._freeInFreeMess.alpha = 0;
        this._freeInFreeMess.scale.set(0);
        OMY.Omy.sound.play(GameConstStatic.S_fg_in_free);
        this._freeInFreeMess.setXY(this._freeInFreeMess.json.x, this._freeInFreeMess.json.y);
        OMY.Omy.add.tween(this._freeInFreeMess, {
            scaleX: 1, scaleY: 1, alpha: 1, ease: this._freeInFreeMess.json["ease_show"],
        }, this._freeInFreeMess.json["tween_show"], this._inFreeDelay.bind(this));
    }

    /!**     * @private     *!/
    _inFreeDelay() {
        OMY.Omy.add.timer(this._freeInFreeMess.json["delay_screen"], this._hideInFreeMess, this);
    }

    /!**     * @private     *!/
    _hideInFreeMess() {
        const hidePos = this._freeInFreeMess.json["tween_hide_pos"];
        OMY.Omy.add.tween(this._freeInFreeMess, {
            scaleX: 0, scaleY: 0, alpha: 0, ease: this._freeInFreeMess.json["ease_hide"],
            x: hidePos.x, y: hidePos.y,
        }, this._freeInFreeMess.json["tween_hide"], this._onInFreeMessHide.bind(this));
    }

    /!**     * @private     *!/
    _onInFreeMessHide() {
        this._reelBlock.updateToState(AppConst.SLOT_SYMBOL_NONE);
        AppG.serverWork.updateTotalFreeGame();
        AppG.state.gameOver();
    }*/

//-------------------------------------------------------------------------
    //endregion

    showWinCombo() {
        switch (this._dataWin.maxCountSymbol) {
            case 5: {
                OMY.Omy.sound.play(GameConstStatic.S_show_win_5);
                break;
            }
            case 4: {
                OMY.Omy.sound.play(GameConstStatic.S_show_win_4);
                break;
            }

            default: {
                OMY.Omy.sound.play(GameConstStatic.S_show_win_3);
                break;
            }
        }
        super.showWinCombo();
    }

    _animateLoopLine() {
        super._animateLoopLine();
        switch (this._dataWin.countSymbol) {
            case 5: {
                OMY.Omy.sound.play(GameConstStatic.S_win_5());
                break;
            }
            case 4: {
                OMY.Omy.sound.play(GameConstStatic.S_win_4());
                break;
            }

            default: {
                OMY.Omy.sound.play(GameConstStatic.S_win_3());
                break;
            }
        }
    }

    _animateWinLine() {
        super._animateWinLine();

        /*if (!this._isAnimationsSkiped || this._dataWin.isBonusWin || this._dataWin.isScatter) {
            if (this._winSymbolSound)
                OMY.Omy.sound.stop(this._winSymbolSound);
            this._winSymbolSound = null;
            switch (this._dataWin.winSymbol) {
                default: {
                    this._winSymbolSound = GameConstStatic["S_symbol_" + String(this._dataWin.winSymbol)];
                    break;
                }
            }
            OMY.Omy.sound.play(this._winSymbolSound);
        }*/
    }

    _skipWinAnimations() {
        super._skipWinAnimations();
    }

    _endShowWinLines() {
        super._endShowWinLines();
    }

    _settingNextLineTime() {
        // if (AppG.isAutoGame) {
        //     return AppG.incTimeTake / this._dataWin.countLinesWin;
        // } else {
        return super._settingNextLineTime();
        // }
    }

    startLoopAnimation() {
        if (AppG.isAutoGame || AppG.isFreeGame) return;
        this._lineTimer?.destroy();
        if (this._dataWin.countLinesWin !== 1) {
            if (!this._playLoopAnimations) {
                super.startLoopAnimation();
            } else {
                if (this._gdConf["wait_delay_loop"]) {
                    this._lineInGame.hideWinEffect();
                    this._winEffect.hide();
                    this._reelBlock.updateToState(AppConst.SLOT_SYMBOL_NONE);
                    this._delayLoopTimer = OMY.Omy.add.timer(this._gdConf["wait_delay_loop"], this._onWaitDelayLoop, this);
                } else {
                    super.startLoopAnimation();
                }
            }
        } else {
            if (!this._playLoopAnimations)
                super.startLoopAnimation();
        }
    }

    findWinSymbols(dataWin, playSound = true, dispatch = true, noWin = false) {
        dispatch = this._playLoopAnimations;
        return super.findWinSymbols(dataWin, playSound, dispatch, noWin);
    }

    hideWin() {
        this._delayLoopTimer?.destroy();
        return super.hideWin();
    }

    /**     * @private     */
    _onWaitDelayLoop() {
        this._delayLoopTimer = null;
        super.startLoopAnimation();
    }

    /**     * @private     */
    _cleanWinEffect() {

    }

    _onPayWindowOpen() {
        super._onPayWindowOpen();
        this.getChildByName("reels").alpha = 0;
        this.getChildByName("c_numbers").alpha = 0;
        this.getChildByName("c_lines").alpha = 0;
        this.getChildByName("c_logo").alpha = 0;
    }

    _onPayWindowClose() {
        super._onPayWindowClose();
        this.getChildByName("reels").alpha = 1;
        this.getChildByName("c_numbers").alpha = 1;
        this.getChildByName("c_lines").alpha = 1;
        this.getChildByName("c_logo").alpha = 1;
    }

    _onIntroWindowClose() {
        OMY.Omy.sound.pauseAll();
        OMY.Omy.sound.resumeAll();
        if (!AppG.beginFreeGame && !AppG.isFreeGame) {
            GameConstStatic.S_game_bg = GameConstStatic.S_bg;
            OMY.Omy.sound.play(GameConstStatic.S_game_bg, true);
        }
        super._onIntroWindowClose();
    }

    /**     * @private     */
    _onShowBigWin() {
        this._fireWork1.visible = true;
        this._fireWork2.visible = true;
        this._fireWork1.alpha = 0;
        this._fireWork2.alpha = 0;
        this._fireWork1.gotoAndPlay(0, true);
        this._fireWork2.gotoAndPlay(0, true);
        OMY.Omy.add.tween(this._fireWork1, {alpha: 1}, 0.3);
        OMY.Omy.add.tween(this._fireWork2, {alpha: 1}, 0.3);
    }

    /**     * @private     */
    _onHideBigWin() {
        OMY.Omy.add.tween(this._fireWork1, {alpha: 0, onCompleteParams: [this._fireWork1]}, 0.3, (actor) => {
            actor.visible = false;
            actor.stop();
        });
        OMY.Omy.add.tween(this._fireWork2, {alpha: 0, onCompleteParams: [this._fireWork2]}, 0.3, (actor) => {
            actor.visible = false;
            actor.stop();
        });
    }
}
