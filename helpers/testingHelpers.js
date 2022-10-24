const { user_game } = require('../models');
const { user_game_biodata } = require('../models')
const { user_game_history } = require('../models')

module.exports = {
    userTruncate: async () => {
        await user_game.destroy({ truncate: true, restartIdentity: true });
    },
    biodataTruncate: async () => {
        await user_game_biodata.destroy({ truncate: true, restartIdentity: true });
    },
    historyTruncate: async () => {
        await user_game_history.destroy({ truncate: true, restartIdentity: true });
    }

};