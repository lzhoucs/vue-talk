
class VueDemo {
  constructor({el, data, computed}) {
    const root = document.querySelector(el)

    const deps = {}

    for(let key in data) {
      deps[key]= new Dep()
    }

    const p = new Proxy(data, {
      get(obj, prop) {
        deps[prop] && deps[prop].depend()
        return obj[prop]
      },
      set(obj, prop, newVal) {
        obj[prop] = newVal
        deps[prop] && deps[prop].notify()
        return true
      }
    })
    for(let key in computed) {
      let func = computed[key]

      watcher(() => p[key] = func.call(p))
    }

    const render = _.template(root.innerHTML, { interpolate: /{{([\s\S]+?)}}/g })
    watcher(() => {
      root.innerHTML = render(p)
    })
    return p
  }
}

class Dep {
  constructor () {
    this.subscribers = []
  }
  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target)
    }
  }
  notify() {
    this.subscribers.forEach(sub => sub())
  }
}

function watcher(func) {
  target = func
  target()
  target = null
}
