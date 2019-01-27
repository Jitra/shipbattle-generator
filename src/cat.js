export default class Cat {
  constructor(name) {
    this._name = name || 'Cat';
    console.log('cat is ', name + ' :)');
  }
  get name() {
    return this._name;
  }
}
