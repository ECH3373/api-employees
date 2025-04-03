import { services } from '../shared/services/index.js';

const expand = [{ key: 'department_id', name: 'department', endpoint: 'http://82.29.197.244:8080/departments' }];

const index = async (req, res) => {
  const { data, meta } = await services.crud.index({ model: 'employee', query: req.query, expand, search: ['code', 'name'], filters: ['is_active', 'department_id'] });
  return services.response.send({ res, data, meta, message: 'the list of employees has been successfully retrieved' });
};

const show = async (req, res) => {
  const data = await services.crud.show({ model: 'employee', target: req.params.id, keys: ['id', 'code'], expand });
  if (!data) return services.response.send({ res, data, error: 'the employee with the provided ID does not exist' });
  services.response.send({ res, data, message: 'employee successfully retrieved' });
};

export const controller = {
  index,
  show,
};
