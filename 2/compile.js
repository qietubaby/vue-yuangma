
class Compile {
  constructor(el, vm) {
    
    // 要遍历的宿主节点
    this.$el = document.querySelector(el);

    // kvue的实例
    this.$vm = vm;

    console.log(this.$el)

    // 编译
    if(this.$el) {
      
      // 转换内部的内容片段为Fragment
      this.$fragment = this.node2Fragment(this.$el);

      // 执行编译
      this.compile(this.$fragment);

      // 将编译完的html追加至$el
      this.$el.appendChild(this.$fragment)
    }

  }

  // 将宿主元素中的代码片段拿出来遍历，这样做比较高效
  node2Fragment(el){
    const frag = document.createDocumentFragment();

    //将el中的所有子元素搬家至frag中
    let child;
    while(child = el.firstChild) {
      frag.appendChild(child);
    }
    return frag;
  }

  // 编译过程
  compile(el){
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      if(this.isElement(node)) {
        // 元素
        console.log('编译元素'+node.nodeName);
      } else if(this.isInterpolation(node)) {
        // 文本
        // console.log('编译文本'+node.textContent);
        this.compileText(node)
      }

      // 递归子节点
      if(node.childNodes && node.childNodes.length>0) {
        this.compile(node)
      }


    })
  }

  // 编译文本
  compileText(node) {
    console.log(RegExp.$1); //得到分组中的内容
    node.textContent = this.$vm.$data[RegExp.$1];
  }


  // 判断是否是节点元素
  isElement(node) {
    return node.nodeTtype === 1;
  }
  // 判断是否是插值文本
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }


  // 更新函数
  update(node, vm, exp, dir) {
    const updateFn = this[dir+'Updater'];
  }

}