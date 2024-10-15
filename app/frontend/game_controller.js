import {createApp} from "vue";

export function GameController(playerData)
{
    return createApp({
        data() {
            return {
                bench: playerData,
                onCourt: [],
                absent: [],
                substitutions: [[]],
                selectedSub: null,
                gameTimeMs: 0,
                lastTick: null,
                digits: [0, 0, 0, 0],
                timeoutID: null,
            }
        },
        methods: {
            start() {
                this.lastTick = Date.now();
                this.tick();
            },
            pause() {
                clearTimeout(this.timeoutID);
                this.timeoutID = null;
            },
            tick() {
                this.timeoutID = setTimeout(() => {
                    let now = Date.now();
                    this.gameTimeMs += (now - this.lastTick);
                    this.setGameClockDigits();
                    this.lastTick = now;
                    this.tick();
                }, 1000)
            },
            setGameClockDigits() { this.digits = getDigitsFromTime(this.gameTimeMs); },

            selectSubstitution(index) {
                if (this.isSelectedSub(index)) {
                    this.selectedSub = null;
                } else {
                    this.selectedSub = index;
                }
            },
            isSelectedSub(index){ return this.selectedSub == index; },

            accept() {
              this.substitutions.push([]);
            },

            remove() {
                this.substitutions.splice(this.selectedSub, 1);
                this.selectedSub = null;
            },

            assignedToSubstitution(player){
                return this.substitutions.find(s => s[0] == player || s[1] == player) !== undefined;
            },

            selectOnCourt(player){
                if (this.timeoutID == null) {
                    this.bench.push(player);
                    this.onCourt = this.onCourt.filter(p => p != player);
                    return
                }

                if(this.selectedSub == null) return;
                if(this.assignedToSubstitution(player)) return;
                this.substitutions[this.selectedSub][0] = player;
            },

            selectBench(player){
                if (this.timeoutID == null && this.onCourt.length < 5) {
                    this.onCourt.push(player);
                    this.bench = this.bench.filter(p => p != player);
                    return
                }

                if(this.selectedSub == null) return;
                if(this.assignedToSubstitution(player)) return;
                this.substitutions[this.selectedSub][1] = player;
            },
        },
    });
}

function getDigitsFromTime(timeMs) {
    let timeSec = Math.round(timeMs / 1000);
    let tenMinutes = Math.floor(timeSec / 600);
    timeSec = (timeSec - tenMinutes*600);
    let minutes = Math.floor(timeSec / 60);
    timeSec = timeSec - minutes*60;
    let tenSeconds = Math.floor(timeSec / 10);
    let seconds = timeSec - tenSeconds*10;
    return [tenMinutes,minutes,tenSeconds,seconds];
}

export function GameControllerTests(window) {
    let failed = false;

    assert(getDigitsFromTime(1000), [0,0,0,1]);
    assert(getDigitsFromTime(9001), [0,0,0,9]);
    assert(getDigitsFromTime(10000), [0,0,1,0]);
    assert(getDigitsFromTime(60000), [0,1,0,0]);
    assert(getDigitsFromTime(61000), [0,1,0,1]);
    assert(getDigitsFromTime(72000), [0,1,1,2]);
    assert(getDigitsFromTime(600000), [1,0,0,0]);

    function assert(actual, expected) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
           console.group('test failed');
           console.log('expected', expected);
           console.log('actual', actual);
           console.trace();
           failed = true;
        }
    }

    if (failed) { alert('Test failures encountered. Check console for details'); }

}
