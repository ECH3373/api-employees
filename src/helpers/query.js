import { Schema } from 'querymen';

const index = ({ page = 1, limit = 10, sort = ['_id'], search = [], filters = [] } = {}) => {
  let all_filters = {};

  filters.forEach((filter) => {
    all_filters[filter] = {
      type: [String],
      operator: '$in',
      paths: [filter],
    };
  });

  const schema = new Schema({
    page: {
      type: Number,
      default: page,
    },

    limit: {
      type: Number,
      default: limit,
    },

    sort: {
      type: [String],
      default: sort,
    },

    search: {
      type: RegExp,
      or: true,
      paths: search,
      cast: (val) => new RegExp(`.*${val}.*`, 'i'),
    },

    ...all_filters,
  });

  return schema;
};

export const query = {
  index,
};
