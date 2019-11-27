
import cellComponent from './cell.vue'
const cell = {
  install: function (Vue) {
    Vue.component('cell-item', cellComponent)
  }
}

export default cell
