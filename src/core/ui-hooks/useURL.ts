import { useLocation } from 'react-router'

interface UseUrlProps {
    right?: number
    left?: number
}

export const useURL = ({ right = 0, left = 0 }: UseUrlProps) => {
    const { pathname, search, hash } = useLocation()

    const getURL = (id: number) => {
        let url = pathname.split('/')
        url[url.length - 1 - right] = id.toString() + (search ?? '') + (hash ?? '')
        if (left !== 0) url = ['', ...url.slice(left + 1, url.length)]
        return url.join('/')
    }

    return { getURL }
}
