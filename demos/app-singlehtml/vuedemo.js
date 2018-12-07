
class VueDemo {
  constructor({el, data, computed}) {
    const root = document.querySelector(el)

    for(let key in data) {
      let val = data[key]
      const dep = new Dep()

      Object.defineProperty(this, key, {
        get() {
          dep.depend()
          return val
        },
        set(newVal) {
          val = newVal
          dep.notify()
        }
      })
    }

    for(let key in computed) {
      let func = computed[key]

      watcher(() => this[key] = func.call(this))
    }

    const render = _.template(root.innerHTML, { interpolate: /{{([\s\S]+?)}}/g })
    watcher(() => {
      root.innerHTML = render(this)
    })
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
