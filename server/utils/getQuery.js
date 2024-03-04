class getQuery {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 3;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  sort() {
    const sortBy = this.queryStr.sort.split(',').join(' ');
    this.query = this.query.sort(sortBy);
    return this;
  }
}

module.exports = getQuery;
