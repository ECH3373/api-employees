import { helpers } from '../../helpers/index.js';

const index = helpers.query.index({
  search: ['code', 'name'],
  filters: ['is_active', 'department_id'],
  sort: ['code', 'name', 'is_active', 'department_id'],
});

export const query = {
  index,
};
