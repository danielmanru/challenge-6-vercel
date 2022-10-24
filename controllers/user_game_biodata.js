const { user_game_biodata } = require('../models');
const jwt = require('jsonwebtoken');

const {
  JWT_SIGNATURE_KEY
} = process.env;

module.exports = {
  create: async (req, res, next) => {
    try {
      const { name, gender, region, phone } = req.body;

      const existBio = await user_game_biodata.findOne({ where: { id_user: req.user.id } });
      if (existBio) {
        return res.status(409).json({
          status: false,
          message: 'biodata already created!'
        });
      }
      const Createuser = await user_game_biodata.create({
        id_user: req.user.id,
        name,
        gender,
        region,
        phone
      });

      return res.status(201).json({
        status: true,
        message: 'success',
        data: 'successfully create user biodata'
      });
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    try {
      const userBiodata = await user_game_biodata.findOne({ where: { id_user: req.user.id } })
      if (!userBiodata) {
        return res.status(404).json({
          status: false,
          message: 'user bio not found',
          data: null
        });
      }
      return res.status(200).json({
        status: true,
        message: 'success',
        data: userBiodata
      });
    } catch (err) {
      next(err);
    }

  },

  update: async (req, res, next) => {
    try {
      const { name, gender, region, phone } = req.body;
      const id_user = req.user.id;

      const userBiodata = await user_game_biodata.findOne({ where: { id_user: id_user } })
      if (!userBiodata) {
        return res.status(404).json({
          status: false,
          message: 'biodata not found!',
          data: null
        });
      }
      if (name) {
        const userName = await user_game_biodata.update(
          { name, }, { where: { id_user: id_user }, }
        );
      }

      if (gender) {
        const userGender = await user_game_biodata.update(
          { gender, }, { where: { id_user: id_user }, }
        );
      }

      if (region) {
        const userRegion = await user_game_biodata.update(
          { region, }, { where: { id_user: id_user }, }
        );
      }

      if (phone) {
        const userPhone = await user_game_biodata.update(
          { phone, }, { where: { id_user: id_user }, }
        );
      }
      //const hasil = await user_game_biodata.findOne({ where: { id_user: id_user } })
      return res.status(200).json({
        status: true,
        message: "Success updated biodata",

      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const id_user = req.user.id;
      const userBiodata = await user_game_biodata.findOne({ where: { id_user: id_user } })
      if (!userBiodata) {
        return res.status(404).json({
          status: false,
          message: 'biodata not found!',
          data: null
        });
      }
      const userGameBiodata = await user_game_biodata.destroy({
        where: { id_user: id_user },
      });
      return res.status(200).json({
        status: true,
        message: "bio has been deleted",
      });
    }
    catch (err) {
      next(err);
    }
  }
}


