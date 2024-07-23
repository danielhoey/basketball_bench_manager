import {createApp} from "vue";

export function PlayersList(player_data)
{
    player_data.forEach((player)=>{player.errors={}});
    return createApp({
        data() {
            return {newPlayer: {errors: {}}, players: player_data, errors: [], loading: false}
        },
        methods: {
            async add() {
                if (this.checkDuplicate(this.newPlayer)) { return; }

                this.loading = true;
                const response = await fetchJSON("/players", 'POST', this.newPlayer);
                this.loading = false;
                if (!response.ok) {
                    alert("Unexpected error, try again.");
                    return;
                }
                const savedPlayer = await response.json();
                savedPlayer.errors = {};
                this.players.push(savedPlayer);
                this.newPlayer = {errors: {}};
                document.body.querySelector(`.players .add input:first-child`).focus();
            },
            async remove(player) {
                const response = await fetchJSON(`/players/${player.id}`, 'DELETE');
                if (!response.ok) {
                    alert("Unexpected error, try again.");
                    return;
                }
                let i = this.players.findIndex(p => p === player);
                this.players.splice(i, 1);
            },
            async update(player) {
                if (this.checkDuplicate(player)) { return; }
                await fetchJSON(`/players/${player.id}`, 'PUT', player);
            },
            checkDuplicate(player) {
                this.errors = {};
                player.errors = {};
                const matchingNumber = this.players.find((p) => p !== player && p.number === player.number);
                if (matchingNumber) {
                    player.errors = {number: true};
                    this.errors = ["Number already taken"];
                    return true;
                }
                return false;
            }
        },
    });
}


function fetchJSON(url, method, data) {
  const csrf = getCsrfToken();
  let httpParams = {method: method, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-Token': csrf }};
  if (data) { httpParams.body = JSON.stringify(data); }
  return fetch(url, httpParams)
}

function getCsrfToken(){
  const element = document.querySelector("meta[name='csrf-token']");
  return element.getAttribute("content") || '';
}