'use strict';

const _ = require('lodash');

function ServiceResponse() {
  return (req, res, next) => {
    let data = [];
    const rawData = req.data;
    let pagination = req.pagination;
    if (Array.isArray(rawData)) {
      if (rawData)
        _.forEach(rawData, r => {
          data.push(r)
        });
    } else {
      data = rawData;
    }


    let jsonRes = {
      status: true,
      message: _.get(req.response, 'message', 'OK'),
      meta: {},
      data: data
    };

    if (pagination) {
      jsonRes.meta.pagination = {
        page: parseInt(pagination.page),
        limit: parseInt(pagination.pageSize),
        total: parseInt(pagination.rowCount),
        pageCount: parseInt(pagination.pageCount)
      };
    }

    res.status(_.get(req.response, 'code', 200));
    res.json(jsonRes);
  };
}

module.exports = ServiceResponse();
