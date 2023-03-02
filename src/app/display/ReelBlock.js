import {AppG} from "../../casino/AppG";
import {GameConstStatic} from "../GameConstStatic";
import {ReelBlockBase} from "../../casino/display/reels/ReelBlockBase";
import {AppConst} from "../../casino/AppConst";

export class ReelBlock extends ReelBlockBase {
    constructor() {
        super();
        AppG.emit.on(AppConst.APP_EMIT_CATCH_SCATTER, this._onCatchScatter, this);
    }

    _onTurboPreEase(reelId) {
        OMY.Omy.sound.play(((AppG.delayDelayBetweenReelsTimeCoef) ? GameConstStatic.S_reel_stop : GameConstStatic.S_reel_stop_all));
        super._onTurboPreEase(reelId);
        if (this._checkReelBySymbol(reelId, ["A"]) && !OMY.Omy.sound.isSoundPlay(GameConstStatic.S_wild_drop)) {
            OMY.Omy.sound.stop(GameConstStatic.S_reel_stop);
            OMY.Omy.sound.play(GameConstStatic.S_wild_drop);
        }
    }

    _onNormalPreEase(reelId) {
        super._onNormalPreEase(reelId);
        if (this._checkReelBySymbol(reelId, ["A"])) {
            OMY.Omy.sound.stop(GameConstStatic.S_reel_stop);
            OMY.Omy.sound.play(GameConstStatic.S_wild_drop);
        }
    }

    _onNormalSkipPreEase(reelId) {
        super._onNormalSkipPreEase(reelId);
        if (this._checkReelBySymbol(reelId, ["A"]) && !OMY.Omy.sound.isSoundPlay(GameConstStatic.S_wild_drop)) {
            OMY.Omy.sound.play(GameConstStatic.S_wild_drop);
        }
    }

    /*_checkScatterPreEase(reelId) {
        if (AppG.gameConst.getData("scatterSymbol").indexOf(this._activeList[reelId][1].symbolName) !== -1 &&
            reelId === this._countScatters) {
            this._countScatters++;
            this._scatterInReal = true;
            OMY.Omy.sound.play(GameConstStatic["S_reel_scatter" + String(this._countScatters)]);

            for (let j = 0; j < this._countSlot; j++) {
                if (AppG.gameConst.getData("scatterSymbol").indexOf(this._activeList[reelId][j].symbolName) !== -1) {
                    OMY.Omy.add.tween(this._activeList[reelId][j].scale, {
                        x: 1.1,
                        y: 1.1,
                        yoyo: true,
                        repeat: 1,
                    }, 0.2);
                }
            }
        }
    }*/

    _checkScatter(reelId) {
    }

    /**     * @private     */
    _onCatchScatter(count, reelId) {
        let needPlay = true;
        if (count === 1 && reelId >= 3) needPlay = false;
        if (count === 2 && reelId > 3) needPlay = false;
        if (needPlay)
            OMY.Omy.sound.play(GameConstStatic["S_reel_scatter" + String(count)]);
    }
}
