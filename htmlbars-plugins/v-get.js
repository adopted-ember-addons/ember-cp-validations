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

VGet.prototype.processNode = function(node) {
  var i;
  // Process statement
  // {{v-get model 'username' 'isValid'}}
  if (node.type === 'MustacheStatement' && node.path.original === 'v-get') {
    this.transformToGet(node);
  }

  // Process params
  // {{#if (v-get model 'username' 'isValid')}} {{/if}}
  for (i = 0; i < node.params.length; i++) {
    var param = node.params[i];
    if (param.type === 'SubExpression') {
      if (param.path.original === 'v-get') {
        this.transformToGet(param);
      } else {
        // {{#if (and (v-get model 'isValid') (v-get model 'username' 'isValid'))}} {{/if}}
        this.processNode(param);
      }
    }
  }

  // Process Hash
  // {{x-component prop=(v-get model 'isValid')}}
  for (i = 0; i < node.hash.pairs.length; i++) {
    var pair = node.hash.pairs[i];
    if (pair.value.type === 'SubExpression') {
      if (pair.value.path.original === 'v-get') {
        this.transformToGet(pair.value);
      } else {
        // {{x-component isValid=(and (v-get model 'isValid') (v-get model 'username' 'isValid'))}}
        this.processNode(pair.value);
      }
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

VGet.prototype.validate = function(node) {
  return node.type === 'BlockStatement' || node.type === 'MustacheStatement';
};

module.exports = VGet;
