// code taken from https://github.com/Flet/github-slugger

var whitespace = /\s/g;

function GithubSlugger () {
  var self = this;
  if (!(self instanceof GithubSlugger)) return new GithubSlugger();

  self.reset();
}

/**
 * Generate a unique slug.
 * @param  {string} value String of text to slugify
 * @return {string}       A unique slug string
 */
GithubSlugger.prototype.slug = function (value) {
  var self = this;
  var slug = slugger(value);
  var occurrences = self.occurrences[slug];

  if (self.occurrences.hasOwnProperty(slug)) {
    occurrences++;
  } else {
    occurrences = 0;
  }

  self.occurrences[slug] = occurrences;

  if (occurrences) {
    slug = slug + '-' + occurrences;
  }

  return slug;
};

/**
 * Reset - Forget all previous slugs
 * @return void
 */
GithubSlugger.prototype.reset = function () {
  this.occurrences = {};
};

function lower (string) {
  return string.toLowerCase();
}

function slugger (string) {
  var re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,.\/:;<=>?@\[\]^`{|}~]/g;
  var maintainCase = false;
  var replacement = '-';

  if (typeof string !== 'string') return '';
  if (!maintainCase) string = string.replace(/[A-Z]+/g, lower);
  return string.trim()
    .replace(re, '')
    .replace(whitespace, replacement);
}
