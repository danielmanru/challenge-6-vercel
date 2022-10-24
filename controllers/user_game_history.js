const { user_game_history } = require('../models');
const jwt = require('jsonwebtoken');

const {
  JWT_SIGNATURE_KEY
} = process.env;

module.exports = {
  create: async (req, res, next) => {
    try {
      const { date, time, score } = req.body;
      const Createhistory = await user_game_history.create({
        id_user: req.user.id,
        date,
        time,
        score
      });
      return res.status(201).json({
        status: true,
        message: 'success',
        data: {
          id: Createhistory.id,
        }
      });
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    try {
      const userHistory = await user_game_history.findAll({ where: { id_user: req.user.id } })
      if (userHistory == "") {
        return res.status(404).json({
          status: false,
          message: 'user history not found',

        });
      }
      return res.status(200).json({
        status: true,
        message: 'success',
        data: userHistory
      });
    } catch (err) {
      next(err);
    }

  },

  update: async (req, res, next) => {
    try {
      const { date, time, score } = req.body;
      const { historyId } = req.params;
      const id_user = req.user.id;

      const userHistory = await user_game_history.findOne({ where: { id_user: id_user, id: historyId } })
      if (!userHistory) {
        return res.status(404).json({
          status: false,
          message: 'history not found!',

        });
      }
      if (date) {
        const historyDate = await user_game_history.update(
          { date, }, { where: { id_user: id_user, id: historyId }, }
        );
      }

      if (time) {
        const historyTime = await user_game_history.update(
          { time, }, { where: { id_user: id_user, id: historyId }, }
        );
      }

      if (score) {
        const historyScore = await user_game_history.update(
          { score, }, { where: { id_user: id_user, id: historyId }, }
        );
      }
      const hasil = await user_game_history.findOne({ where: { id_user: id_user, id: historyId } })
      return res.status(200).json({
        status: true,
        message: "Success updated biodata",
        data: hasil
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const id_user = req.user.id;
      const { historyId } = req.params;
      const userHistory = await user_game_history.findOne({ where: { id_user: id_user, id: historyId } })
      if (!userHistory) {
        return res.status(404).json({
          status: false,
          message: 'History not found!',

        });
      }
      const userGameHistory = await user_game_history.destroy({
        where: { id_user: id_user, id: historyId },
      });
      return res.status(200).json({
        status: true,
        message: "history has been deleted",
      });
    }
    catch (err) {
      next(err);
    }
  }
}


