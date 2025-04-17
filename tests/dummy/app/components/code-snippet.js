import Component from '@glimmer/component';
import snippets from '../snippets';

export default class extends Component {
  get language() {
    return this.args.name?.split('.')[1];
  }

  get snippet() {
    return snippets[this.args.name];
  }
}
