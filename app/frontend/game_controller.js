import {createApp} from "vue";

export function GameController(playerData)
{
    return createApp({
        data() {
            return {bench: playerData.slice(0,5), onCourt: playerData.slice(5), absent: []}
        },
    });
}