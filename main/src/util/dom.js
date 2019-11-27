/**
 * 阻止目标元素滚动到顶部时的浏览器回弹效果
 * @param {DomElement||String} $node 目标容器或class或ID
 */
export function disableScrollBounce($node) {
  if (!$node) {
    throw new Error('disableScrollBounce参数不能为空')
  }
  if (typeof $node === 'string') {
    $node = document.querySelector($node)
  }
  if (!$node || !$node.addEventListener) {
    throw new Error('disableScrollBounce找不带目标元素')
  }
  let startY, endY
  // 记录手指触摸的起点坐标
  $node.addEventListener(
    'touchstart',
    function (e) {
      startY = e.touches[0].pageY
    },
    false
  )
  $node.addEventListener(
    'touchmove',
    function (e) {
      endY = e.touches[0].pageY // 记录手指触摸的移动中的坐标
      // 手指下滑，页面到达顶端不能继续下滑
      if (endY > startY && $node.scrollTop <= 0) {
        e.preventDefault()
        // e.stopPropagation()
      }
    },
    false
  )
}
