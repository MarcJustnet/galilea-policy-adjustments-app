import { KeyOfType } from '@/core/types'
import { useId } from 'react'
import { useSelectWithSearch } from '../hooks'
import type { SelectWithSearchProps, SelectWithSearchValue } from '../types'

import { SelectWithSearchButton, SelectWithSearchInput, SelectWithSearchOptionsList } from './partials'

export function SelectWithSearch<T extends Record<K, number>, K extends KeyOfType<T, number>, V = SelectWithSearchValue>(p: SelectWithSearchProps<T, K, V>) {
    const id = useId()
    const { selectRef, handleClick, selectedValue, showOptions, toUseOptions, setOptions, handleChange } = useSelectWithSearch<T, K, V>(p)

    const renderAddons = () => {
        const leftAddons = p.leftAddons ?? []
        const rightAddons = p.addons ?? []
        const hasLeftAddons = leftAddons.length > 0
        const hasRightAddons = rightAddons.length > 0

        if (!hasLeftAddons && !hasRightAddons) {
            return (
                <div className="select" style={p.style} ref={selectRef}>
                    <SelectWithSearchButton
                        noSelectedTitle={p.noSelectedTitle}
                        id={id}
                        disabled={p.disabled}
                        handleClick={handleClick}
                        selectedValue={selectedValue}
                        error={p.error}
                        success={p.success}
                        ValueNode={p.ValueNode}
                        showOptions={showOptions}
                    />
                    <SelectWithSearchOptionsList<T, K, V>
                        nullable={p.nullable}
                        noSelectedOption={p.noSelectedOption}
                        showOptions={showOptions}
                        options={toUseOptions}
                        setOptions={setOptions}
                        handleChange={handleChange}
                        useInfinity={p.useInfinity}
                        nameField={p.nameField}
                        valueField={p.valueField}
                        ItemNode={p.ItemNode}
                        extraOptions={p.extraOptions}
                    >
                        {[undefined, true].includes(p.showInput) && <SelectWithSearchInput<T> autoFocus={p.autoFocus} showOptions={showOptions} useSelectorStore={p.useSelectorStore} />}
                    </SelectWithSearchOptionsList>
                </div>
            )
        }

        let buttonClass = 'select__button'
        if (hasLeftAddons && hasRightAddons) {
            buttonClass = 'select__button--with-addon-both'
        } else if (hasLeftAddons) {
            buttonClass = 'select__button--with-addon-left'
        } else if (hasRightAddons) {
            buttonClass = 'select__button--with-addon-right'
        }

        return (
            <div className="select__wrapper">
                {hasLeftAddons && (
                    <div className="form__addons">
                        {leftAddons.map((addon, index) => (
                            <div key={`left-${index}`} className="form__addon">
                                {addon}
                            </div>
                        ))}
                    </div>
                )}
                <div className="select" style={p.style} ref={selectRef}>
                    <SelectWithSearchButton
                        noSelectedTitle={p.noSelectedTitle}
                        id={id}
                        disabled={p.disabled}
                        handleClick={handleClick}
                        selectedValue={selectedValue}
                        error={p.error}
                        success={p.success}
                        ValueNode={p.ValueNode}
                        showOptions={showOptions}
                        customClassName={buttonClass}
                    />
                    <SelectWithSearchOptionsList<T, K, V>
                        nullable={p.nullable}
                        noSelectedOption={p.noSelectedOption}
                        showOptions={showOptions}
                        options={toUseOptions}
                        setOptions={setOptions}
                        handleChange={handleChange}
                        useInfinity={p.useInfinity}
                        nameField={p.nameField}
                        valueField={p.valueField}
                        ItemNode={p.ItemNode}
                        extraOptions={p.extraOptions}
                    >
                        {[undefined, true].includes(p.showInput) && <SelectWithSearchInput<T> autoFocus={p.autoFocus} showOptions={showOptions} useSelectorStore={p.useSelectorStore} />}
                    </SelectWithSearchOptionsList>
                </div>
                {hasRightAddons && (
                    <div className="form__addons">
                        {rightAddons.map((addon, index) => (
                            <div key={`right-${index}`} className="form__addon">
                                {addon}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="form__group">
            {p.label && <label className="form__label" htmlFor={id}>{p.label}</label>}
            {renderAddons()}
            {p.showError !== false && p.error && <p className="form__error">{p.error}</p>}
            {p.success && <p className="form__success">{p.success}</p>}
        </div>
    )
}
