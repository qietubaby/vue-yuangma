class KVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.observe(this.$data)


    // 模拟watcher创建
    new Watcher()
    this.$data.test //激活了get  添加了依赖
    new Watcher()
    this.$data.foo.bar //激活了get  添加了依赖

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



    // 初始化Dep
    const dep = new Dep();



    Object.defineProperty(obj, key, {
      get() {
        Dep.target && dep.addDep(Dep.target)
        return val;
      },
      set(newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        // console.log(`${key}属性更新了: ${val}`);

        dep.notify()


      }
    })

  }

}


/*
 我们增加了一个Dpe类的对象，用来收集watcher对象。读
 数据的时候，会触发getter函数把当前的watcher对象（存放在Dep.target中）收集到Dep类中去

 写数据的时候，则会触发setter方法，通知Dep类调用notify来触发所有watcher对象的update方法更新对应识图
 */


// Dep: 用来管理Watcher 观察者的集合
class Dep {
  constructor() {
    // 这里存放若干watcher
    this.deps = [];
  }
  addDep(dep) {
    this.deps.push(dep)
  }
  notify() { // 用来通知所有的依赖去做更新
    this.deps.forEach(dep => dep.update())
  }
}

// Watcher 一个watcher对应一个属性（依赖）
class Watcher {
  constructor() {
    // 将当前watcher实例指定到Dep静态属性target
    Dep.target = this;

  }
  update() {
    console.log('属性更新了')
  }
}