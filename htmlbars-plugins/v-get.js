function VGet(options) {
  this.options = options;
  this.syntax = null; // set by HTMLBars
}

VGet.prototype.transform = function(ast) {
  var context = this;
  var walker = new this.syntax.Walker();

  walker.visit(ast, function(node) {
    if (context.validate(node)) {
      context.processNode(node);
    }
  });

  return ast;
};

VGet.prototype.validate = function(node) {
  return ['BlockStatement', 'MustacheStatement', 'ElementNode'].indexOf(node.type) > -1;
};

VGet.prototype.processNode = function(node) {
  var type = node.type;
  node = unwrapNode(node);

  // {{v-get model 'username' 'isValid'}}
  if (type === 'MustacheStatement' && node.path.original === 'v-get') {
    this.transformToGet(node);
  }

  this.processNodeParams(node);
  this.processNodeHash(node);
  this.processNodeAttributes(node);
};

/**
 * {{#if (v-get model 'username' 'isValid')}} {{/if}}
 * @param  {AST.Node} node
 */
VGet.prototype.processNodeParams = function(node) {
  if (node.params) {
    for (var i = 0; i < node.params.length; i++) {
      var param = node.params[i];
      if (param.type === 'SubExpression') {
        if (param.path.original === 'v-get') {
          this.transformToGet(param);
        } else {
          this.processNode(param);
        }
      }
    }
  }
};

/**
 * {{x-component prop=(v-get model 'isValid')}}
 * @param  {AST.Node} node
 */
VGet.prototype.processNodeHash = function(node) {
  if (node.hash && node.hash.pairs) {
    for (var i = 0; i < node.hash.pairs.length; i++) {
      var pair = node.hash.pairs[i];
      if (pair.value.type === 'SubExpression') {
        if (pair.value.path.original === 'v-get') {
          this.transformToGet(pair.value);
        } else {
          this.processNode(pair.value);
        }
      }
    }
  }
};

/**
 * <button type="submit" disabled={{v-get model 'isInvalid'}}>Submit</button>
 * @param  {AST.Node} node
 */
VGet.prototype.processNodeAttributes = function(node) {
  if (node.attributes) {
    for (var i = 0; i < node.attributes.length; i++) {
      var attr = node.attributes[i];
      this.processNode(attr.value);
    }
  }
};


/**
 * Transform (v-get model 'username' 'isValid') to (get (get model.validations.attrs 'username') 'isValid') OR
 * (v-get model 'isValid') to (get model.validations 'isValid')
 * @param  {AST.Node} node
 * @return {AST.Node}
 */
VGet.prototype.transformToGet = function(node) {
  node = unwrapNode(node);
  var params = node.params;
  var i = 0;

  if (params.length < 2) {
    throw new Error('{{v-get}} requires at least two arguments');
  }
  if (params[0].type !== 'PathExpression') {
    throw new Error('The first argument to {{v-get}} must be a stream');
  }

  var root = this.syntax.builders.path(params[i++].original + '.validations');

  if (params.length === 3) {
    root = this.syntax.builders.path(root.original + '.attrs');
    root = this.syntax.builders.sexpr(this.syntax.builders.path('get'), [root, params[i++]]); // (get model.validations.attrs 'username')
  }

  node.path = this.syntax.builders.path('get');
  node.params = [root, params[i]];

};

// For compatibility with pre- and post-glimmer
function unwrapNode(node) {
  if (node.sexpr) {
    return node.sexpr;
  } else {
    return node;
  }
}

module.exports = VGet;
