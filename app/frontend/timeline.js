import {createApp} from "vue";

const Substitution = {
    props: ['substitution'],
    template: '#substitution',
}

export function Timeline(gameID, playerData, events)
{

    return createApp({
        data() {
            return {
                events: events,
                court: playerData.slice(0,5),
                bench: playerData.slice(5),
                started: true,
                current_substitution: {in: [], out: []},
            }
        },
        methods: {
            selectOnCourt(player) {
                let out = this.current_substitution.out;
                if (out.includes(player)) {
                    out.splice(out.indexOf(player), 1);
                } else {
                    out.push(player);
                }
            },
            selectOnBench(player) {
                let i = this.current_substitution.in;
                if (i.includes(player)) {
                    i.splice(i.indexOf(player), 1);
                } else {
                    i.push(player);
                }
            },

            isSelected(player) {
                let cs = this.current_substitution;
                return cs.in.includes(player) || cs.out.includes(player);
            },
            formatTime(timeMs) { return Math.floor(timeMs / 30000) / 2; },
        },
        components: {
            Substitution,
        },
    })
}
