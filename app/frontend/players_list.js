import {createApp} from "vue";

export default createApp({
    data() {
        return { newPlayer: {}, players: [], errors: {} }
    },
    methods: {
        save(event) {
            this.errors = {};
            const matchingNumber = this.players.find((p) => p.number == this.newPlayer.number);
            if (matchingNumber) {
                this.errors = {number: "Number already taken"};
                return;
            }

            this.players.push(this.newPlayer);
            this.newPlayer = {};
            document.body.querySelector(`.players .add input:first-child`).focus();
        },
        has_errors() {
            return Object.keys(this.errors).length > 0;
        }
    }
});
