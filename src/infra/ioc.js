export default class IoC {
  constructor() {
    this.dependencies = {};
  }

  register(name, dependency) {
    this.dependencies[name] = dependency;
  }

  inject(name) {
    return this.dependencies[name];
  }
}
