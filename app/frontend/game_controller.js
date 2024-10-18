import {createApp} from "vue";

export function GameController(gameID, playerData, playerTimes, lastSnapshot)
{
    let bench = []
    let court = []
    let unavailable = []
    let gameTimeMs = 0;
    let lastTick = null;

    if (lastSnapshot == null) {
        for (let player of playerData) { player.benchTime = 0; }
        bench = playerData;
    } else {
        for (let player of playerData) {
            if (!playerTimes[player.id]) {
                player.benchTime = 0;
                unavailable.push(player);
                continue;
            }
            player.benchTime = playerTimes[player.id]['bench']*1000 || 0;
            if (playerTimes[player.id]['last_position'] == 'bench') {
                bench.push(player);
            } else {
                court.push(player);
            }
        }
        gameTimeMs = lastSnapshot.game_time * 1000;
        lastTick = new Date(lastSnapshot.real_time);
    }

    return createApp({
        data() {
            return {
                bench: bench,
                court: court,
                unavailable: unavailable,
                selectingUnavailable: false,
                substitutions: [[]],
                selectedSub: null,
                gameTimeMs: gameTimeMs,
                lastTick: lastTick,
                digits: getDigitsFromTime(gameTimeMs),
                timeoutID: null,
            }
        },
        methods: {
            start() {
                this.saveSnapshot();
                if (this.lastTick == null) { this.lastTick = Date.now(); }
                this.sortPlayers();
                this.tick();
            },
            pause() {
                clearTimeout(this.timeoutID);
                this.timeoutID = null;
            },
            tick() {
                this.timeoutID = setTimeout(() => {
                    let now = Date.now();
                    const tickMs = (now - this.lastTick);
                    this.gameTimeMs += tickMs
                    for (let p of this.bench) { p.benchTime += tickMs; }
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

            hasAnySubstitutions() {
                for (let s of this.substitutions) {
                    if (s.length == 2) {
                        return true;
                    }
                }
                return false;
            },

            applySubstitutions() {
                for (let s of this.substitutions) {
                    if (s.length == 2) {
                        const court_i = this.court.indexOf(s[0]);
                        const bench_i = this.bench.indexOf(s[1]);
                        this.court[court_i] = s[1];
                        this.bench[bench_i] = s[0];
                    }
                }
                this.substitutions = [[]];
                this.sortPlayers();
                this.saveSnapshot();
            },

            accept() {
                if (this.substitutions.length < this.bench.length) { this.substitutions.push([]); }
            },

            remove() {
                if (this.substitutions[this.selectedSub].length > 0) {
                    this.substitutions[this.selectedSub] = [];
                }
                this.selectedSub = null;
            },

            assignedToSubstitution(player){
                return this.substitutions.find(s => s[0] == player || s[1] == player) !== undefined;
            },

            selectOnCourt(player){
                if (this.timeoutID == null) {
                    this.bench.push(player);
                    this.court = this.court.filter(p => p != player);
                    return
                }

                if(this.selectedSub == null) return;
                if(this.assignedToSubstitution(player)) return;
                this.substitutions[this.selectedSub][0] = player;
            },

            selectOnBench(player){
                if(this.selectingUnavailable) {
                    this.unavailable.push(player);
                    this.bench = this.bench.filter(p => p != player);
                    return;
                }

                if (this.timeoutID == null && this.court.length < 5) {
                    this.court.push(player);
                    this.bench = this.bench.filter(p => p != player);
                    return
                }

                if(this.selectedSub == null) return;
                if(this.assignedToSubstitution(player)) return;
                this.substitutions[this.selectedSub][1] = player;
            },

            sortPlayers() {
                this.court.sort((a,b) => b.benchTime - a.benchTime);
                this.bench.sort((a,b) => b.benchTime - a.benchTime);
            },

            toggleUnavailable() {
                this.selectingUnavailable = !this.selectingUnavailable;
            },

            addToBench(player) {
                this.unavailable = this.unavailable.filter(p => p != player);
                this.bench.push(player);
            },

            async saveSnapshot() {
                const csrfToken = document.head.querySelector("meta[name=csrf-token]")?.content;

                const data = { positions: {court: this.court.map(p => p.id), bench: this.bench.map(p => p.id)},
                               game_time: Math.floor(this.gameTimeMs/1000),
                               real_time: new Date().toISOString() }

                try {
                    const response = await fetch(`/games/${gameID}/snapshot`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': csrfToken,
                        },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    console.log('Snapshot saved successfully');
                } catch (error) {
                    console.error('Error saving snapshot:', error);
                }
            },

            formatTime(timeMs) { return formatToHalfMinutes(timeMs); },
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

function formatToHalfMinutes(timeMs) {
    return Math.floor(timeMs / 30000) / 2;
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

    assert(formatToHalfMinutes(0), 0);
    assert(formatToHalfMinutes(29000), 0);
    assert(formatToHalfMinutes(30000), 0.5);
    assert(formatToHalfMinutes(60000), 1);
    assert(formatToHalfMinutes(90000), 1.5);
    assert(formatToHalfMinutes(120000), 2);

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
