const index = async ({ model, params = {}, expand = [] }) => {
  const data = await model.find(params.query).limit(params.cursor.limit).skip(params.cursor.skip).sort(params.cursor.sort).lean();
  const total = await model.countDocuments(params.query);
  const meta = { pagination: { page: 1, pages: Math.ceil(total / params.cursor.limit), total } };

  if (expand.length > 0) {
    for (const { in: inField, as, api } of expand) {
      const uniqueIds = [...new Set(data.map((item) => item[inField]))];
      const relatedData = await Promise.all(
        uniqueIds.map(async (id) => {
          const result = await api(id);
          return { id, result };
        }),
      );

      const map = Object.fromEntries(relatedData.map(({ id, result }) => [id, result]));

      data.forEach((item) => {
        item[as] = map[item[inField]] || null;
        delete item[inField];
      });
    }
  }

  return { data, meta };
};

const show = async ({ model, value, fields = ['_id', 'id'] } = {}) => {
  for (const field of fields) {
    try {
      const query = { [field]: value };
      const data = await model.findOne(query);
      if (data) return data;
    } catch (error) {
      continue;
    }
  }

  return null;
};

export const crud = {
  index,
  show,
};
