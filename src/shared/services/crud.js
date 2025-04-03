import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const index = async ({ model, query = {}, search = [], filters = [], expand = [] }) => {
  // params
  const page = parseInt(query.page) || 1;
  const take = parseInt(query.limit) || 10;
  const skip = (page - 1) * take;

  let orderBy = [];
  if (query.sort && Array.isArray(query.sort)) {
    orderBy = query.sort;
  } else if (query.sort) {
    try {
      const parsed = JSON.parse(query.sort);
      if (Array.isArray(parsed)) orderBy = parsed;
    } catch (e) {}
  }

  let where = {};
  if (query.search && search.length > 0) {
    const searchTerm = query.search.trim();
    where.OR = search.map((field) => ({ [field]: { contains: searchTerm } }));
  }

  filters.forEach((field) => {
    let value = query[field];
    if (value !== undefined) {
      if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch (e) {}
      }
      where[field] = Array.isArray(value) ? { in: value } : value;
    }
  });

  // query
  const data = await prisma[model].findMany({ skip, take, orderBy, where });
  const total = await prisma[model].count({ where });

  //expand
  if (expand.length > 0) {
    for (const { key, name, endpoint } of expand) {
      const uniqueIds = [...new Set(data.map((item) => item[key]))];

      const relatedData = await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const response = await axios.get(`${endpoint}/${id}`);
            return { id, result: response.data.data };
          } catch (e) {
            console.warn(`Error al expandir ${key} con id ${id}:`, e.message);
            return null;
          }
        }),
      );

      const map = Object.fromEntries(relatedData.filter((item) => item && item.result).map(({ id, result }) => [id, result]));

      data.forEach((item) => {
        if (map[item[key]]) {
          item[name] = map[item[key]];
          delete item[key];
        }
      });
    }
  }

  // meta
  const meta = { pagination: { total, page, pages: Math.ceil(total / take) } };

  // response
  return { data, meta };
};

const show = async ({ model, target, keys = ['id'], expand = [] } = {}) => {
  let data = null;

  for (const key of keys) {
    try {
      const query = { where: { [key]: target } };
      data = await prisma[model].findFirst(query);
      if (data) break;
    } catch (error) {
      console.log(error);
      continue;
    }
  }

  if (!data) return null;

  // expand
  if (expand.length > 0) {
    for (const { key, name, endpoint } of expand) {
      const id = data[key];

      try {
        const response = await axios.get(`${endpoint}/${id}`);
        const result = response.data?.data;

        if (result) {
          data[name] = result;
          delete data[key];
        }
      } catch (error) {
        console.warn(`Error al expandir ${key} con id ${id}:`, error.message);
      }
    }
  }

  return data;
};

export const crud = {
  index,
  show,
};
