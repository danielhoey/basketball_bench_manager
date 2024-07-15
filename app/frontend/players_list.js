import {createApp} from "vue";

export default createApp({
    data() {
        return { count: 12, newPlayer: {}, players: [] }
    },
    methods: {
        save(event) {
            this.players.push(this.newPlayer);
            this.newPlayer = {};
            document.body.querySelector(`.players .add input:first-child`).focus();

        }
    }
});
