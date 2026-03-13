/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 11/03/2026 - 16:38:15
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 11/03/2026
    * - Author          : fortu
    * - Modification    : 
**/
import { Children, cloneElement, createRef, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import './CardSwap.css'

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
))
Card.displayName = 'Card'

const makeSlot = (index, distX, distY, total) => ({
  x: index * distX,
  y: -index * distY,
  z: -index * distX * 1.5,
  zIndex: total - index,
})

const placeNow = (element, slot, skew) => {
  if (!element) return
  gsap.set(element, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  })
}

function CardSwap({
  width = 500,
  height = 320,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  swapOnClick = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children,
}) {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        }

  const childArr = useMemo(() => Children.toArray(children), [children])
  const refs = useMemo(
    () => childArr.map(() => createRef()),
    [childArr.length]
  )

  const order = useRef(Array.from({ length: childArr.length }, (_, index) => index))
  const tlRef = useRef(null)
  const intervalRef = useRef(null)
  const containerRef = useRef(null)
  const swapRef = useRef(() => {})
  const busyRef = useRef(false)
  const clickSwapRef = useRef(false)

  const clearSwapInterval = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startSwapInterval = () => {
    clearSwapInterval()
    intervalRef.current = window.setInterval(() => {
      swapRef.current()
    }, delay)
  }

  useEffect(() => {
    const total = refs.length
    if (total === 0) return

    refs.forEach((ref, index) => {
      placeNow(ref.current, makeSlot(index, cardDistance, verticalDistance, total), skewAmount)
    })

    const swap = () => {
      if (order.current.length < 2 || busyRef.current) return
      const [front, ...rest] = order.current
      const frontElement = refs[front]?.current
      if (!frontElement) return
      busyRef.current = true
      tlRef.current?.kill()
      // Use fast durations for click swaps
      const isClick = clickSwapRef.current
      const animConfig = isClick
        ? { durDrop: 0.22, durMove: 0.22, durReturn: 0.22, promoteOverlap: 0.45, returnDelay: 0.1, ease: 'power1.inOut' }
        : config
      clickSwapRef.current = false
      const timeline = gsap.timeline({
        onComplete: () => {
          busyRef.current = false
        }
      })
      tlRef.current = timeline
      timeline.to(frontElement, {
        y: '+=500',
        duration: animConfig.durDrop,
        ease: animConfig.ease,
      })
      timeline.addLabel('promote', `-=${animConfig.durDrop * animConfig.promoteOverlap}`)
      rest.forEach((idx, index) => {
        const element = refs[idx]?.current
        const slot = makeSlot(index, cardDistance, verticalDistance, refs.length)
        if (!element) return
        timeline.set(element, { zIndex: slot.zIndex }, 'promote')
        timeline.to(
          element,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: animConfig.durMove,
            ease: animConfig.ease,
          },
          `promote+=${index * 0.15}`
        )
      })
      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length)
      timeline.addLabel('return', `promote+=${animConfig.durMove * animConfig.returnDelay}`)
      timeline.call(
        () => {
          gsap.set(frontElement, { zIndex: backSlot.zIndex })
        },
        undefined,
        'return'
      )
      timeline.to(
        frontElement,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: animConfig.durReturn,
          ease: animConfig.ease,
        },
        'return'
      )
      timeline.call(() => {
        order.current = [...rest, front]
      })
    }

    swapRef.current = swap

    swap()
    startSwapInterval()

    if (pauseOnHover) {
      const node = containerRef.current
      const pause = () => {
        tlRef.current?.pause()
        clearSwapInterval()
      }
      const resume = () => {
        tlRef.current?.play()
        startSwapInterval()
      }

      node?.addEventListener('mouseenter', pause)
      node?.addEventListener('mouseleave', resume)

      return () => {
        node?.removeEventListener('mouseenter', pause)
        node?.removeEventListener('mouseleave', resume)
        clearSwapInterval()
        tlRef.current?.kill()
      }
    }

    return () => {
      clearSwapInterval()
      tlRef.current?.kill()
    }
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs])

  const rendered = childArr.map((child, index) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: index,
          ref: refs[index],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (event) => {
            child.props.onClick?.(event)
            if (swapOnClick) {
              clickSwapRef.current = true
              swapRef.current()
              startSwapInterval()
            }
            onCardClick?.(index)
          },
        })
      : child
  )

  return (
    <div ref={containerRef} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  )
}

export default CardSwap
