class KVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.observe(this.$data)


    // 模拟watcher创建
    // new Watcher()
    // this.$data.test //激活了get  添加了依赖
    // new Watcher()
    // this.$data.foo.bar //激活了get  添加了依赖

    new Compile(options.el, this);
    if(options.created) {
      options.created.call(this)
    }

  }
  observe(value) {
    if (!value || typeof value !== 'object') {
      return;
    }

    // 遍历该对象
    Object.keys(value).forEach(key => {
      this.defineReactive(value, key, value[key]) // 对象，key 值
      //代理data中的属性到vue实例上
      this.proxyData(key)

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

  // 实现代理 访问this.key就相当于访问this.data.key
  proxyData(key) {
    Object.defineProperty(this, key, {
    
      get(){
        return this.$data[key]
      },
      set(newVal){
        this.$data[key] = newVal
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
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    // 将当前watcher实例指定到Dep静态属性target
    Dep.target = this;
    this.vm[this.key]; //读属性是为了触发getter，添加依赖
    Dep.target = null; //置空
  }

  update () {
    // console.log('属性更新了')
    this.cb.call(this.vm,this.vm[this.key])
  }
}