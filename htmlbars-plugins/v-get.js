/**
 * @module Templating
 * @main Templating
 */

/**
 * Accessing validation information in your templates is really simple but the pathing can be quite long. For example, if we want to display the error `message` for the `username` attribute, it would look something like this:
 *
 * ```handlebars
 * {{model.validations.attrs.username.message}}
 * ```
 *
 * ## The V-Get Helper
 * To bypass such long pathing, you can use the `v-get` helper.
 *
 * _**Notice**: Ember v1.13.0 is not supported due to a bug. Please use Ember v1.13.1 and higher or Ember v1.12.* and lower_
 *
 * **Access global model properties**
 *
 * ```handlebars
 * {{v-get model 'isValid'}}
 * ```
 *
 * **Access attribute specific properties**
 *
 * ```handlebars
 * {{v-get model 'username' 'message'}}
 * ```
 *
 * **Access model relationship validations**
 *
 * Say we have a `user` model with a `details` attribute that is a belongsTo relationship, to access validations on the `details` attribute/model we can access it as such.
 *
 * ```handlebars
 * {{v-get model.details 'isValid'}}
 * {{v-get model.details 'firstName' 'message'}}
 * ```
 *
 * What's awesome about this is that you can pass in bound properties!
 *
 * ```handlebars
 * {{v-get model attr prop}}
 * {{v-get model prop}}
 * ```
 *
 * Here is a more extensive example:
 * ```handlebars
 * <form>
 *   {{input value=model.username placeholder="Username"}}
 *   {{#if (v-get model 'username' 'isInvalid')}}
 *     <div class="error">
 *       {{v-get model 'username' 'message'}}
 *     </div>
 *   {{/if}}
 *
 *   <button type="submit" disabled={{v-get model 'isInvalid'}}>Submit</button>
 * </form>
 * ```
 *
 * @module Templating
 * @submodule V-Get Helper
 */

/* eslint-env node */

var plugin = function ({ syntax }) {
  return {
    visitor: {
      BlockStatement(node) {
        processNode(node, syntax);
      },

      ElementNode(node) {
        processNode(node, syntax);
      },

      MustacheStatement(node) {
        processNode(node, syntax);
      },
    },
  };
};

function processNode(node, syntax) {
  var type = node.type;

  // {{v-get model 'username' 'isValid'}}
  if (type === 'MustacheStatement' && getValue(node.path) === 'v-get') {
    transformToGet(node, syntax);
  }

  processNodeParams(node, syntax);
  processNodeHash(node, syntax);
  processNodeAttributes(node, syntax);
}

/**
 * {{#if (v-get model 'username' 'isValid')}} {{/if}}
 * @param  {AST.Node} node
 */
function processNodeParams(node, syntax) {
  if (node.params) {
    for (var i = 0; i < node.params.length; i++) {
      var param = node.params[i];
      if (param.type === 'SubExpression') {
        if (getValue(param.path) === 'v-get') {
          transformToGet(param, syntax);
        } else {
          processNode(param, syntax);
        }
      }
    }
  }
}

/**
 * {{x-component prop=(v-get model 'isValid')}}
 * @param  {AST.Node} node
 */
function processNodeHash(node, syntax) {
  if (node.hash && node.hash.pairs) {
    for (var i = 0; i < node.hash.pairs.length; i++) {
      var pair = node.hash.pairs[i];
      if (pair.value.type === 'SubExpression') {
        if (getValue(pair.value.path) === 'v-get') {
          transformToGet(pair.value, syntax);
        } else {
          processNode(pair.value, syntax);
        }
      }
    }
  }
}

/**
 * <button type="submit" disabled={{v-get model 'isInvalid'}}>Submit</button> (node.attributes)
 * <div class="form-group {{if (v-get model 'isInvalid') 'has-error'}}">
 * @param  {AST.Node} node
 */
function processNodeAttributes(node, syntax) {
  var i;
  if (node.attributes) {
    for (i = 0; i < node.attributes.length; i++) {
      var attr = node.attributes[i];
      processNode(attr.value, syntax);
    }
  }

  if (node.parts) {
    for (i = 0; i < node.parts.length; i++) {
      processNode(node.parts[i], syntax);
    }
  }
}

/**
 * Transform:
 *  (v-get model 'username' 'isValid') to (get (get (get (get model 'validations') 'attrs') 'username') 'isValid')
 * OR
 *  (v-get model 'isValid') to (get (get model 'validations') 'isValid')
 * @param  {AST.Node} node
 * @return {AST.Node}
 */
function transformToGet(node, syntax) {
  var params = node.params;
  var numParams = params.length;

  if (numParams < 2) {
    throw new Error('{{v-get}} requires at least two arguments');
  }
  if (params[0].type !== 'PathExpression') {
    throw new Error('The first argument to {{v-get}} must be a stream');
  }

  // (get model 'validations')
  var root = syntax.builders.sexpr(syntax.builders.path('get'), [
    params[0],
    syntax.builders.string('validations'),
  ]);

  // (get (get (get model 'validations') 'attrs') 'username')
  if (numParams === 3) {
    root = syntax.builders.sexpr(syntax.builders.path('get'), [
      root,
      syntax.builders.string('attrs'),
    ]);
    root = syntax.builders.sexpr(syntax.builders.path('get'), [
      root,
      params[1],
    ]);
  }

  node.path = syntax.builders.path('get');
  // (get root 'isValid')
  node.params = [root, params[numParams - 1]];
}

function getValue(path) {
  if (!path) return;

  if ('value' in path) {
    return path.value;
  }

  /**
   * Deprecated in ember 5.9+
   * (so we use the above for newer embers)
   */
  return path.original;
}

module.exports = plugin;
