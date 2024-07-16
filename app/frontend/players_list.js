import {createApp} from "vue";

export default createApp({
    data() {
        return { newPlayer: {errors:{}}, players: [], errors: [] }
    },
    methods: {
        add(event) {
            this.errors = {};
            this.newPlayer.errors = {};
            const matchingNumber = this.players.find((p) => p.number == this.newPlayer.number);
            if (matchingNumber) {
                this.newPlayer.errors = {number:true};
                this.errors = ["Number already taken"];
                return;
            }

            this.players.push(this.newPlayer);
            this.newPlayer = {errors:{}};
            document.body.querySelector(`.players .add input:first-child`).focus();
        },
    }
});
