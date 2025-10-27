import { useEffect } from 'react'

import type { Any } from '../types'

export const useClickOutside = (refs: Array<React.RefObject<HTMLElement | null>>, callback: () => void, reloadArray: Any[] = []) => {
    useEffect(() => {
        const handleClickOutside = ({ target }: MouseEvent) => {
            if (refs.every(ref => ref.current && !ref.current.contains(target as Node))) callback()
        }
        document.body.addEventListener('click', handleClickOutside)
        return () => { document.body.removeEventListener('click', handleClickOutside) }
    }, reloadArray)
}
