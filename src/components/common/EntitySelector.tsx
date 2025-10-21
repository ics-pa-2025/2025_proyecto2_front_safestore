'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formStyles } from './FormStyles';

export interface EntitySelectorOption {
    id: number;
    name: string;
    [key: string]: any;
}

export interface EntitySelectorProps<T extends EntitySelectorOption> {
    options: T[];
    value: number;
    onChange: (value: number) => void;
    entityName: string;
    entityNamePlural: string;
    createRoute: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    allowCreate?: boolean;
    onReload?: () => Promise<void>;
    emptyOptionText?: string;
    displayProperty?: keyof T;
    filterFn?: (option: T) => boolean;
    formatOptionText?: (option: T) => string;
    showDetailCard?: boolean;
    detailCardContent?: (option: T) => React.ReactNode;
}

export function EntitySelector<T extends EntitySelectorOption>({
    options,
    value,
    onChange,
    entityName,
    entityNamePlural,
    createRoute,
    label,
    placeholder,
    required = false,
    error,
    disabled = false,
    allowCreate = true,
    onReload,
    emptyOptionText,
    displayProperty = 'name',
    filterFn,
    formatOptionText,
    showDetailCard = false,
    detailCardContent
}: EntitySelectorProps<T>) {
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    
    const filteredOptions = filterFn ? options.filter(filterFn) : options;
    const defaultEmptyText = emptyOptionText || `Select ${entityName}`;
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        
        if (selectedValue === 'create-new') {
            handleCreateNew();
        } else {
            onChange(Number(selectedValue));
        }
    };
    
    const handleCreateNew = () => {
        setIsCreating(true);
        const currentPath = window.location.pathname + window.location.search;
        localStorage.setItem('returnPath', currentPath);
        localStorage.setItem('returnFromEntityCreation', 'true');
        navigate(createRoute);
    };
    
    useEffect(() => {
        const handleReturnFromCreate = () => {
            const returnPath = localStorage.getItem('returnPath');
            const isReturning = localStorage.getItem('returnFromEntityCreation') === 'true';
            
            if (returnPath && isReturning && window.location.pathname + window.location.search === returnPath) {
                localStorage.removeItem('returnPath');
                localStorage.removeItem('returnFromEntityCreation');
                if (onReload) {
                    onReload();
                }
                setIsCreating(false);
            }
        };
        
        handleReturnFromCreate();
        window.addEventListener('popstate', handleReturnFromCreate);
        
        return () => {
            window.removeEventListener('popstate', handleReturnFromCreate);
        };
    }, [onReload]);
    
    return (
        <div className={formStyles.fieldWrapper}>
            <label htmlFor={`select-${entityName}`} className={formStyles.label}>
                {label} {required && <span className={formStyles.required}>*</span>}
            </label>
            
            <div className="relative">
                <select
                    id={`select-${entityName}`}
                    value={value}
                    onChange={handleSelectChange}
                    disabled={disabled || isCreating}
                    className={`${formStyles.select} ${allowCreate ? 'pr-10' : ''}`}
                >
                    <option value={0}>{defaultEmptyText}</option>
                    
                    {filteredOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                            {formatOptionText ? formatOptionText(option) : String(option[displayProperty])}
                        </option>
                    ))}
                    
                    {allowCreate && (
                        <>
                            <option disabled>────────────</option>
                            <option value="create-new">
                                ➕ Create new {entityName}
                            </option>
                        </>
                    )}
                </select>
                
                {allowCreate && !disabled && (
                    <button
                        type="button"
                        onClick={handleCreateNew}
                        disabled={isCreating}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 text-sm font-medium bg-transparent border-none cursor-pointer disabled:opacity-50"
                        title={`Create new ${entityName}`}
                    >
                        ➕
                    </button>
                )}
            </div>
            
            {error && (
                <p className={formStyles.errorMessage}>{error}</p>
            )}
            
            {isCreating && (
                <p className="mt-1 text-xs text-blue-600">
                    Creating new {entityName}...
                </p>
            )}
            
            {filteredOptions.length === 0 && !isCreating && (
                <p className="mt-1 text-xs text-amber-600">
                    No {entityNamePlural} available. 
                    {allowCreate && (
                        <button
                            type="button"
                            onClick={handleCreateNew}
                            className="ml-1 text-blue-600 hover:text-blue-800 underline"
                        >
                            Create the first {entityName}
                        </button>
                    )}
                </p>
            )}
            
            {/* Detail card for selected item */}
            {showDetailCard && value > 0 && detailCardContent && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    {(() => {
                        const selectedOption = filteredOptions.find(option => option.id === value);
                        return selectedOption ? detailCardContent(selectedOption) : null;
                    })()}
                </div>
            )}
        </div>
    );
}

export function useEntitySelector() {
    const [isLoading, setIsLoading] = useState(false);
    
    const reloadData = async <T,>(loadFn: () => Promise<T[]>, setData: (data: T[]) => void) => {
        setIsLoading(true);
        try {
            const data = await loadFn();
            setData(data);
        } catch (error) {
            console.error('Error reloading data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return { isLoading, reloadData };
}