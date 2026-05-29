const paginate = async (Model, query = {}, page = 1, limit = 10, populate = "") => {
  const skip = (page - 1) * limit;
  const total = await Model.countDocuments(query);
  const data = await Model.find(query).skip(skip).limit(Number(limit)).populate(populate);
  return {
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export default paginate;
