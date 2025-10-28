import { type Option } from '../../types'

interface SelectWithSearchButtonProps<T, V> {
    noSelectedTitle?: string
    id: string
    disabled?: boolean
    handleClick: () => void
    selectedValue: Option<T> | null
    error?: string
    success?: string
    ValueNode?: React.FC<{ name: string, value: V, obj?: T | null }>
    showOptions: boolean
    customClassName?: string
}

export function SelectWithSearchButton<T, V>({
    noSelectedTitle = 'Selecciona una opción',
    id,
    disabled = false,
    handleClick,
    selectedValue,
    error = '',
    success = '',
    ValueNode,
    showOptions,
    customClassName
}: SelectWithSearchButtonProps<T, V>) {
    const getButtonClass = () => {
        let baseClass = customClassName || 'select__button'

        if (error) {
            baseClass += ' select__button--error'
        } else if (success) {
            baseClass += ' select__button--success'
        }

        if (showOptions) {
            baseClass += ' select__button--open'
        }

        return baseClass
    }

    return (
        <button
            id={id}
            type="button"
            className={getButtonClass()}
            disabled={disabled}
            onClick={handleClick}
        >
            {ValueNode
                ? <div className="select__button__value">
                    <ValueNode name={selectedValue?.name ?? noSelectedTitle ?? ''} value={selectedValue?.value as V} obj={selectedValue?.obj} />
                </div>
                : <span className={selectedValue?.name ? 'select__button__value' : 'select__button__placeholder'}>
                    {selectedValue?.name ?? noSelectedTitle}
                </span>
            }
            <span className="select__button__icon" />
        </button>
    )
}
