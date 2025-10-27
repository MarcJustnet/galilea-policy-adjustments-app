import { useState, useEffect, useMemo } from 'react'

const WIDTH = Object.freeze({
    MOBILE: 'mobile',
    TABLET: 'tablet',
    DESKTOP: 'desktop'
})

type Width = typeof WIDTH[keyof typeof WIDTH]

const WIDTHS = Object.freeze({
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1440
})

export const useWindow = () => {
    const [width, setWidth] = useState<number>(window.innerWidth)
    const [height, setHeight] = useState<number>(window.innerHeight)
    const [widthType, setWidthType] = useState<Width>(WIDTH.DESKTOP)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)
        }
        window.addEventListener('resize', handleResize)
        return () => { window.removeEventListener('resize', handleResize) }
    }, [])

    useEffect(() => {
        if (width <= WIDTHS.MOBILE) setWidthType(WIDTH.MOBILE)
        else if (width <= WIDTHS.TABLET) setWidthType(WIDTH.TABLET)
        else setWidthType(WIDTH.DESKTOP)
    }, [width])

    const isMobile = useMemo(() => widthType === WIDTH.MOBILE, [widthType])
    const isTablet = useMemo(() => widthType === WIDTH.TABLET, [widthType])
    const isTabletOrMobile = useMemo(() => isMobile || isTablet, [isMobile, isTablet])
    const isDesktop = useMemo(() => widthType === WIDTH.DESKTOP, [widthType])

    return { width, height, widthType, isMobile, isTablet, isDesktop, isTabletOrMobile }
}
