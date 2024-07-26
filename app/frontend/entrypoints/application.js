console.log('Vite ⚡️ Rails')
console.log('Visit the guide for more information: ', 'https://vite-ruby.netlify.app/guide/rails')

import {PlayersList} from '../players_list';
import {GameController} from '../game_controller';

window.vueApps = {
    'PlayersList': PlayersList,
    'GameController': GameController,
}
