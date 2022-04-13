import { useState, ChangeEvent, useRef } from 'react';
import { useOutsideClicking } from '../hooks/useOutsideClicking';
import './Autocomplete.css';

type OptionResult = {
  id: string,
  label: string
}

type AutocompleteProps = {
  loadOptions: (query: string) => Promise<OptionResult[]>
}

function Autocomplete(props: AutocompleteProps) {
  const [query, setQuery] = useState<string>('');
  const [options, setOptions] = useState<OptionResult[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const componentRef = useRef<HTMLDivElement>(null);

  const updateOptions = async (query: string) => {
    setQuery(query);
    const results = await props.loadOptions(query);
    setOptions(results);
    setOpen(true);
  }

  const handleChangeValue = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    updateOptions(event.target.value);
  }

  const handleClickOption = (item: OptionResult) => {
    setQuery(item.label);
    setOpen(false);
  }

  const handleClickInput = () => {
    if (!open) {
      updateOptions(query)
    }
  }

  useOutsideClicking(componentRef, event => {
    setOpen(false)
  });

  return <div className='container' ref={componentRef}>
    <input type="text" 
      className="autocomplete-input" 
      value={query}
      onChange={handleChangeValue}
      onClick={handleClickInput}
    />
    {open && <div className='options-container'>
      {options.map((item: OptionResult) => {

        const parts = item.label.split(query.toUpperCase());

        return <div key={item.id} className='autocomplete-option' onClick={() => handleClickOption(item)}>
          {parts.map((part: string, idx: number) => <>
            <span>{part}</span>
            {(idx < parts.length - 1) && <span className='highlight'>{query.toUpperCase()}</span>}
          </>)}
        </div>;
        })}

        {options.length == 0 && <div className='empty-text'>
          No items found!
        </div>}
    </div>}
  </div>;
}

export default Autocomplete;
