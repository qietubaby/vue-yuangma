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




  // 监听到属性变化了 然后去 依赖收集 
  // 依赖收集的目录：遍历模板，找出和数据有依赖的部分，如果模板中没有依赖，即便数据变化了，也不用去通知更新，这就是依赖收集的目的
  



