import { useId } from "react"
import { OnChangeEvent } from "../types"

namespace Input {
    export interface Addon {
        content: React.ReactNode
        position?: 'left' | 'right'
        className?: string
    }

    export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
        label: string
        error?: string
        onChange?: (e: OnChangeEvent) => void
        addons?: Addon[]
        ref?: React.RefObject<HTMLInputElement | null>
        addonPosition?: 'external' | 'internal' // external = junto al input, internal = dentro del input
    }
}

const Input: React.FC<Input.Props> = ({
    label,
    error,
    addons = [],
    addonPosition = 'external',
    className = '',
    id: _,
    ...rest
}) => {
    const id = useId()

    const leftAddons = addons.filter(addon => addon.position === 'left')
    const rightAddons = addons.filter(addon => addon.position !== 'left')
    const hasLeftAddons = leftAddons.length > 0
    const hasRightAddons = rightAddons.length > 0

    // Determine input class based on addon positions
    let inputClass = `form__input ${error ? 'form__input--error' : ''}`
    if (addonPosition === 'external') {
        if (hasLeftAddons && hasRightAddons) {
            inputClass = `form__input--with-addon-both ${error ? 'form__input--error' : ''}`
        } else if (hasLeftAddons) {
            inputClass = `form__input--with-addon-left ${error ? 'form__input--error' : ''}`
        } else if (hasRightAddons) {
            inputClass = `form__input--with-addon-right ${error ? 'form__input--error' : ''}`
        }
    } else if (addonPosition === 'internal' && addons.length > 0) {
        inputClass = `form__input--with-internal-addon ${error ? 'form__input--error' : ''}`
    }

    const inputElement = (
        <input
            className={`${inputClass} ${className}`}
            id={id}
            {...rest}
        />
    )

    const renderInput = () => {
        if (addonPosition === 'internal' && addons.length > 0) {
            return (
                <div className='form__input-wrapper' style={{ position: 'relative' }}>
                    {inputElement}
                    <div className='form__internal-addon'>
                        {addons.map((addon, index) => (
                            <div key={index} className={addon.className}>
                                {addon.content}
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        if (addonPosition === 'external' && addons.length > 0) {
            return (
                <div className='form__input-wrapper'>
                    {hasLeftAddons && (
                        <div className='form__addons'>
                            {leftAddons.map((addon, index) => (
                                <div key={`left-${index}`} className={`form__addon ${addon.className || ''}`}>
                                    {addon.content}
                                </div>
                            ))}
                        </div>
                    )}
                    {inputElement}
                    {hasRightAddons && (
                        <div className='form__addons'>
                            {rightAddons.map((addon, index) => (
                                <div key={`right-${index}`} className={`form__addon ${addon.className || ''}`}>
                                    {addon.content}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )
        }

        return inputElement
    }

    return (
        <div className='form__group'>
            <label className='form__label' htmlFor={id}>{label}</label>
            {renderInput()}
            {error && <p className='form__error'>{error}</p>}
        </div>
    )
}

export default Input