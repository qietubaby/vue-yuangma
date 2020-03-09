class KVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.observe(this.$data)
  }
  observe(value) {
    if (!value || typeof value !== 'object') {
      return;
    }

    // 遍历该对象
    Object.keys(value).forEach(key => {
      this.defineReactive(value, key, value[key]) // 对象，key 值
    })
  }

  //  数据响应化
  defineReactive(obj, key, val) {

    this.observe(val); //当前的val，递归解决数据的层次嵌套，因为有的数据是对象

    Object.defineProperty(obj, key, {
      get() {
        return val;
      },
      set(newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        console.log(`${key}属性更新了: ${val}`);
      }
    })
  }

}



// Dep: 用来管理Watcher
class Dep {
  constructor () {
    // 这里存放若干watcher
    this.deps = [];
  }
  addDep(dep) {
    this.deps.push(dep)
  }
  notify() { // 用来通知所有的依赖去做更新
    this.deps.forEach( dep => dep.update() )

  }
}

// Watcher
class Watcher {
  constructor() {
    // 将当前watcher实例指定到Dep静态属性target
    Dep.target = this;
  }

  update () {
    console.log('属性更新了')
  }
}