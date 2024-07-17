import {createApp} from "vue";

export default createApp({
    data() {
        return { newPlayer: {errors:{}}, players: [], errors: [] }
    },
    methods: {
        add(event) {
            if (this.checkDuplicate(this.newPlayer)) { return; }

            this.players.push(this.newPlayer);
            this.newPlayer = {errors:{}};
            document.body.querySelector(`.players .add input:first-child`).focus();
        },
        checkDuplicate(player) {
            this.errors = {};
            player.errors = {};
            const matchingNumber = this.players.find((p) => p != player && p.number == player.number);
            if (matchingNumber) {
                player.errors = {number:true};
                this.errors = ["Number already taken"];
                return true;
            }
            return false;
        }
    },
});
