'use strict';

function FormatterHelper() {
  const slugify =  (str) => {
    str = str.toLowerCase();
    str = str.replace(/\s+/g, '-'); // Replace spaces with -
    str = str.replace(/[^\w\-]+/g, ''); // Remove all non-word chars
    str = str.replace(/([-+])+/g, '-'); // Replace multiple - with single -
    str = str.replace(/^-+/g, ''); // Trim - from start of text
    str = str.replace(/-+$/g, ''); // Trim - from end of text

    return str;
  };

  const slugifyJobId = (job) => {
    const tmp = JSON.parse(job);
    job = JSON.stringify(tmp);

    let slug = (job['title'] ? job['title'] : '') + ' '
      + (isset(job['company']['name']) ? job['company']['name'] : '');

    return job['id'] + '-' + slugify(slug);
  };

  return {
    slugify: slugify,
    slugifyJobId: slugifyJobId
  }
}


module.exports = FormatterHelper();