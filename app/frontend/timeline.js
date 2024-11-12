import {createApp} from "vue";

const Substitution = {
    props: ['substitution'],
    template: '#substitution',
}

const SubstitutionSelector = {
    props: ['substitution'],
    template: '#substitution-selector',
    emits: ['cancel', 'submit'],
    data() {
        return {
            court: this.substitution.court,
            bench: this.substitution.bench,
            unavailable: this.substitution.unavailable,
            selectingUnavailable: false,
        }
    },
    methods: {
        selectOnCourt(player) {
            let out = this.substitution.out;
            if (out.includes(player)) {
                out.splice(out.indexOf(player), 1);
            } else {
                out.push(player);
            }
        },
        selectOnBench(player) {
            let i = this.substitution.in;
            if (i.includes(player)) {
                i.splice(i.indexOf(player), 1);
            } else {
                i.push(player);
            }
        },

        isSelected(player) {
            let s = this.substitution;
            return s.in.includes(player) || s.out.includes(player);
        },
        valid() {
            let s = this.substitution;
            console.log(s.in.length, s.out.length);
            return (s.in.length == s.out.length) && (s.in.length > 0);
        },
        formatTime(timeMs) { return Math.floor(timeMs / 30000) / 2; },
    },
    components: {
        Substitution,
    },
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
                substitution_being_edited: null
            }
        },
        methods: {
            createSubstitution() {
                this.substitution_being_edited = {in: [], out: [], court: this.court, bench: this.bench};
            },
        },
        components: {
            Substitution,
            SubstitutionSelector,
        },
    })
}
